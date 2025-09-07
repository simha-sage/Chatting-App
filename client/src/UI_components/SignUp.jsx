import { useState } from "react";
import PasswordInput from "./PasswordInput";
const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = ({ setIsSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/userSignUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSignIn(true);
        setEmail("");
        setPassword("");
        setUserName("");
      } else {
        setError(data.message || "Sign up failed. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#446834] h-auto w-60 md:w-4/12 flex justify-center items-center p-4 rounded-lg shadow-lg">
      <form
        className="flex flex-col items-center w-full"
        onSubmit={handleSignUp}
      >
        <p className="font-extrabold text-lg mb-3">SIGN UP</p>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          required
          maxLength={30}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-gray-500 rounded p-2 my-1 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          required
          maxLength={30}
          onChange={(e) => setUserName(e.target.value)}
          className="border-2 border-gray-500 rounded p-2 my-1 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          minLength={6}
          className="border-2 border-gray-500 rounded p-2 my-1 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="submit"
          value={loading ? "Signing Up..." : "Sign Up"}
          disabled={loading}
          className="bg-[#61944a] p-2 mt-3 rounded-md text-black font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
        />
      </form>
    </div>
  );
};

export default SignUp;
