import React, { useContext, useState, useEffect } from "react";
import { useApp } from "../context/conext1";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setUserId } = useApp();
  const handleSignIn = async (e) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/userSignIn`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.message == "Login successful") {
      setUser(data.userName);
      setUserId(data.userId);
      console.log(data.userId, "aaple");
      setEmail("");
      setPassword("");
      navigate("/");
    } else {
      window.alert("Login Unsucessful");
    }
  };

  return (
    <div className="bg-amber-400 h-4/12 w-4/12 flex justify-center items-center">
      <form
        className="flex flex-col items-center"
        id="signIn"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
      >
        <p className="font-extrabold">SIGN IN</p>
        <input
          type="email"
          placeholder="enter email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          required
          minLength="6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="bg-green-800 p-1 rounded-md font-black"
          type="submit"
        />
      </form>
    </div>
  );
};

const SignUp = ({ setIsSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const handleSignUp = async (e) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/userSignUp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName }),
      }
    );
    const data = await response.json();
    if (data.message === "User added sucessfully") {
      setIsSignIn(true);
    }
    console.log(data.message);

    setEmail("");
    setPassword("");
  };
  return (
    <div className="bg-amber-700 h-4/12 w-4/12 flex justify-center items-center">
      <form
        className="flex flex-col items-center"
        id="signUp"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <p className="font-extrabold">SIGN UP</p>
        <input
          type="email"
          placeholder="enter email"
          value={email}
          required
          maxLength={30}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter username"
          value={userName}
          required
          maxLength={30}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          required
          minLength={6}
          maxLength={30}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="bg-amber-400 p-1 rounded-md font-black"
          type="submit"
        />
      </form>
    </div>
  );
};

const SignUpButton = ({ onClick }) => (
  <div className="bg-amber-200 h-4/12 w-2/12 flex flex-col justify-center items-center">
    <p>New here..</p>
    <p>Create an account?</p>
    <input
      type="button"
      className="bg-amber-400 p-2 rounded-md font-black"
      value="Register"
      onClick={onClick}
    />
  </div>
);
const SignInButton = ({ onClick }) => (
  <div className="bg-amber-200 h-4/12 w-2/12 flex flex-col justify-center items-center">
    <p>Welcome back!</p>
    <input
      type="button"
      className="bg-amber-600 p-2 rounded-md font-black"
      value="Login"
      onClick={onClick}
    />
  </div>
);
const UserAuthToggle = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <>
      <div className="flex justify-center items-center h-screen  bg-green-800">
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
