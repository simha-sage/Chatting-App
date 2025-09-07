const apiUrl = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useApp } from "../context/context1";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
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
      const data = await response.json();
      if (data.message == "Login successful") {
        setUser(data.userName);
        setUserId(data.userId);
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
    <div className="bg-[#446834] h-4/12 w-60 md:w-4/12 flex justify-center items-center">
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
          className="border-2  rounded p-1 px-1 my-1 text-black"
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="bg-[#61944a] p-1 m-1 rounded-md font-bold text-black"
          type="submit"
        />
      </form>
    </div>
  );
};
export default SignIn;
