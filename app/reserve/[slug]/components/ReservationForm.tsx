"use client";

import { Alert, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import useReservation from "../../../../hooks/useReservation";

export default function ReservationForm({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [inputs, setInputs] = useState({
    bookerFirstName: "",
    bookerLastName: "",
    bookerPhone: "",
    bookerEmail: "",
    bookerOccasion: "",
    bookerRequest: "",
  });
  const [day, time] = date.split("T");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);
  const { loading, error, createReservation } = useReservation();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    const booking = await createReservation({
      slug,
      partySize,
      time,
      day,
      bookerFirstName: inputs.bookerFirstName,
      bookerLastName: inputs.bookerLastName,
      bookerPhone: inputs.bookerPhone,
      bookerEmail: inputs.bookerEmail,
      bookerOccasion: inputs.bookerOccasion,
      bookerRequest: inputs.bookerRequest,
      setDidBook,
    });
  };

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerPhone &&
      inputs.bookerEmail
    ) {
      return setButtonDisabled(false);
    }
    return setButtonDisabled(true);
  }, [inputs]);

  return (
    <>
      {didBook ? (
        <div className="mt-5">
          <h1 className="font-bold text-2xl">You are booked up!</h1>
          <p>Enjoy your reservation</p>
        </div>
      ) : (
        <>
          {error && (
            <Alert severity="error" className="mt-4">
              {error}
            </Alert>
          )}
          <div className="mt-10 flex flex-wrap justify-between w-[660px]">
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="First name"
              value={inputs.bookerFirstName}
              onChange={handleChangeInput}
              name="bookerFirstName"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Last name"
              value={inputs.bookerLastName}
              onChange={handleChangeInput}
              name="bookerLastName"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Phone number"
              value={inputs.bookerPhone}
              onChange={handleChangeInput}
              name="bookerPhone"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Email"
              value={inputs.bookerEmail}
              onChange={handleChangeInput}
              name="bookerEmail"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Occasion (opcional)"
              value={inputs.bookerOccasion}
              onChange={handleChangeInput}
              name="bookerOccasion"
            />
            <input
              type="text"
              className="border rounded p-3 w-80 mb-4"
              placeholder="Request (opcional)"
              value={inputs.bookerRequest}
              onChange={handleChangeInput}
              name="bookerRequest"
            />
            <button
              disabled={buttonDisabled || loading}
              className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
              onClick={handleClick}
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                "Complete reservation"
              )}
            </button>
            <p className="mt-4 text-sm">
              By clicking "Complete reservation" you agree to the OpenTable
              Terms of Use and Privacy Policy. Standard text message rates may
              apply. You may opt out of receiving text messages at any time.
            </p>
          </div>
        </>
      )}
    </>
  );
}
