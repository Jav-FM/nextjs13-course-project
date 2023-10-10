import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const returnError = (errorMessage: string) => {
      return res.status(400).json({ errorMessage });
    };

    const validatorErrors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(bookerFirstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validator.isLength(bookerLastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isEmail(bookerEmail),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(bookerPhone),
        errorMessage: "Phone number is invalid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        validatorErrors.push(check.errorMessage);
      }
    });

    if (validatorErrors.length) {
      returnError(validatorErrors[0]);
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
      },
    });

    if (!restaurant) {
      return returnError("Restaurant not found");
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return returnError("Restaurant is not open at that time");
    }

    const searchTimesWithTables = await findAvailableTables({
      time,
      day,
      res,
      restaurant,
    });

    if (!searchTimesWithTables) {
      return returnError("Invalid data provider");
    }

    const timeWithTables = searchTimesWithTables.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!timeWithTables) {
      return returnError("No availability, cannot book");
    }

    const tablesCount: { 2: number[]; 4: number[] } = {
      2: [],
      4: [],
    };

    timeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBooks: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBooks.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBooks.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBooks.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBooks.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    if (seatsRemaining < 0) {
      return returnError("Not enough seats");
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        restaurant_id: restaurant.id,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
      },
    });

    const bookingsOnTablesData = tablesToBooks.map((table_id) => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json({
      booking,
    });
  }
}
