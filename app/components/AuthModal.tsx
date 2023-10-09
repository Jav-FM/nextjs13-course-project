"use client";

import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { CircularProgress, Alert } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { error, loading, data } = useContext(AuthenticationContext);

  const buttonClasses = `border p-1 px-4 rounded mr-3 ${
    isSignIn && "bg-blue-400 text-white"
  }`;

  const renderContent = (signInContent: string, singUpContent: string) => {
    return isSignIn ? signInContent : singUpContent;
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  useEffect(() => {
    if (isSignIn) {
      if (inputs.password && inputs.email) {
        return setButtonDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.password &&
        inputs.email &&
        inputs.city &&
        inputs.phone
      ) {
        return setButtonDisabled(false);
      }
    }
    setButtonDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    if (isSignIn) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(
        {
          email: inputs.email,
          password: inputs.password,
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          city: inputs.city,
          phone: inputs.phone,
        },
        handleClose
      );
    }
  };

  return (
    <div>
      <button onClick={handleOpen} className={buttonClasses}>
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className=" py-24 px-2 h-[500px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[500px]">
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {renderContent("Sign In", "Create Account")}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2x font-light text-center">
                  {renderContent(
                    "Log into your account",
                    "Create your OpenTable account"
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignIn={isSignIn}
                />
                <button
                  disabled={buttonDisabled}
                  className="uppercase bg-red-600 w-full text-white p-3 text-sm mb-5 rounded disabled:bg-gray-400"
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
