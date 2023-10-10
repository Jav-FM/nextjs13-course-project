import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const invalidDataProvidedError = () => {
      return res.status(400).json({ errorMessage: "Invalid data provider" });
    };

    if (!day || !time || !partySize) {
      return invalidDataProvidedError();
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return invalidDataProvidedError();
    }

    const searchTimesWithTables = await findAvailableTables({
      time,
      day,
      res,
      restaurant,
    });

    if (!searchTimesWithTables) {
      return invalidDataProvidedError();
    }

    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => {
          return sum + table.seats;
        }, 0);
        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability) => {
        const timeIsAfterOpenningHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpenningHour && timeIsBeforeClosingHour;
      });

    return res.json(availabilities);
  }
}
