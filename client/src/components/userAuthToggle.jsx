import React, { useContext, useState, useEffect } from "react";
import SignUp from "../UI_components/SignUp";
import SignIn from "../UI_components/SignIn";

const SignUpButton = ({ onClick }) => (
  <div className="bg-[#61944a] h-30 md:h-4/12 w-60 md:w-2/12 flex flex-col justify-center items-center">
    <p className="text-black">New here..</p>
    <p className="text-black">Create an account?</p>
    <input
      type="button"
      className="bg-[#446834] p-1 m-1 rounded-md font-bold text-black"
      value="Register"
      onClick={onClick}
    />
  </div>
);
const SignInButton = ({ onClick }) => (
  <div className="bg-[#61944a] h-30 md:h-4/12 w-60 md:w-2/12 flex flex-col justify-center items-center">
    <p className="text-black">Welcome back!</p>
    <input
      type="button"
      className="bg-[#446834] p-1 m-1 rounded-md font-bold text-black"
      value="Login"
      onClick={onClick}
    />
  </div>
);
const UserAuthToggle = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center h-screen  bg-[#81b56b]">
        {isSignIn ? (
          <>
            <SignIn />
            <SignUpButton onClick={() => setIsSignIn(false)} />
          </>
        ) : (
          <>
            <SignInButton onClick={() => setIsSignIn(true)} />
            <SignUp setIsSignIn={setIsSignIn} />
          </>
        )}
      </div>
    </>
  );
};
export default UserAuthToggle;
