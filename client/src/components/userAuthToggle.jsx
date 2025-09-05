import React, { useContext, useState, useEffect } from "react";
import { useApp } from "../context/conext1";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setUserId } = useApp();
  const handleSignIn = async (e) => {
    try {
      const response = await fetch(`${apiUrl}/userSignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      fetch(`${apiUrl}/health`, { credentials: "include" })
        .then((res) => res.json())
        .then(console.log);

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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#61944a] h-4/12 w-60 md:w-4/12 flex justify-center items-center">
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
          className="border-2 border-grey-500 rounded p-1 px-1 my-1 text-black"
        />
        <input
          type="password"
          placeholder="password"
          required
          minLength="6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-grey-500 rounded p-1 px-1 my-1 text-black"
        />
        <input
          className="bg-[#446834] p-1 m-1 rounded-md font-bold text-black"
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
    const response = await fetch(`${apiUrl}/userSignUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userName }),
    });
    const data = await response.json();
    if (data.message === "User added sucessfully") {
      setIsSignIn(true);
    }
    console.log(data.message);

    setEmail("");
    setPassword("");
  };
  return (
    <div className="bg-[#446834] h-4/12 w-60 md:w-4/12 flex justify-center items-center">
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
          className="border-2 border-grey-500 rounded p-1 px-1 my-1 text-black "
        />
        <input
          type="text"
          placeholder="enter username"
          value={userName}
          required
          maxLength={30}
          onChange={(e) => setUserName(e.target.value)}
          className="border-2 border-grey-500 rounded p-1 px-1 my-1 text-black "
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          required
          minLength={6}
          maxLength={30}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-grey-500 rounded p-1 px-1 my-1 text-black"
        />
        <input
          className="bg-[#61944a] p-1 m-1 rounded-md text-black font-bold"
          type="submit"
        />
      </form>
    </div>
  );
};

const SignUpButton = ({ onClick }) => (
  <div className="bg-[#446834] h-30 md:h-4/12 w-60 md:w-2/12 flex flex-col justify-center items-center">
    <p className="text-black">New here..</p>
    <p className="text-black">Create an account?</p>
    <input
      type="button"
      className="bg-[#61944a] p-1 m-1 rounded-md font-bold text-black"
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
