"use client";
import { partySizes, times } from "../../../../data/index";
import DatePicker from "react-datepicker";
import { useState } from "react";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "../../../../utils/convertToDisplayTime";

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    } else {
      return setSelectedDate(null);
    }
  };

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  const filterTimesByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];
    let isWithinWindow = false;

    times.forEach((time) => {
      if (!isWithinWindow && time.time === openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[15%] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label
            htmlFor="
      "
          >
            Party size
          </label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="py-3 border-b font-light"
            name=""
            id=""
          >
            {partySizes.map((size) => (
              <option value={size.value} key={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleChangeDate}
              className="py-3 px-1 border-b font-light text-reg w-24"
              dateFormat="MMMM d"
              wrapperClassName="w-[48%]"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              name=""
              id=""
              className="py-3 border-b font-ligth"
            >
              {filterTimesByRestaurantOpenWindow().map((time) => (
                <option value={time.time} key={time.time}>
                  {time.displayTime}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 ">
          <button
            onClick={handleClick}
            disabled={loading}
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          >
            {loading ? <CircularProgress color="inherit" /> : "Find a time"}
          </button>
        </div>
        {data && data.length ? (
          <div className="mt-4">
            <p className="text-reg">Select a Time</p>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                return time.available ? (
                  <Link
                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 mr-3 rounded"
                    href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  >
                    <p className="text-sm font-bold">
                      {convertToDisplayTime(time.time)}
                    </p>
                  </Link>
                ) : (
                  <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
