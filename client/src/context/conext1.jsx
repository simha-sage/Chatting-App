import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("none");
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([]);
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
        setUserId(data.userId);
        navigate("/"); // restore user from cookie
      })
      .catch(() => {
        navigate("/authentication"); // optional
      });
  }, []);
  useEffect(() => {
    user == "" ? navigate("/authentication") : navigate("/");
    if (user !== "") {
      async function fetchFriends() {
        try {
          const res = await fetch("http://localhost:5000/friends", {
            method: "GET",
            credentials: "include", // 🔑 send cookies
          });
          const data = await res.json();

          setFriends(data);
          console.log("Friends:", data);
          return data;
        } catch (err) {
          console.error("Error fetching friends:", err);
        }
      }
      fetchFriends();
    }
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
        userId,
        setUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => useContext(AppContext);
