import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([
    { name: "John Doe", email: "hello", _id: "hi" },
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/protectedRoute", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) throw new Error("invalid token");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        navigate("/"); // restore user from cookie
      })
      .catch(() => {
        navigate("/authentication"); // optional
      });
  }, []);
  useEffect(() => {
    user == "" ? navigate("/authentication") : navigate("/");
  }, [user]);
  useEffect(() => {
    const getSuggestions = async function () {
      const response = await fetch("http://localhost:5000/friendSuggestions", {
        method: "GET",
        credentials: "include", // 🔑 send cookies
      });
      const data = await response.json();
      setFriendSuggestions(data);
      console.log(data);
      console.log(user);
    };
    getSuggestions();
  }, []);
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        friendSuggestions,
        setFriendSuggestions,
        friends,
        setFriends,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => useContext(AppContext);
