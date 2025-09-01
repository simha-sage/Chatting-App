import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("none");
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(`${apiUrl}/protectedRoute`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Authentication failed with status: ${response.status}`
          );
        }

        const data = await response.json();
        setUser(data.user);
        setUserId(data.userId);
        navigate("/"); // restore user from cookie
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/authentication");
      }
    };

    checkUserSession();
  }, []);
  useEffect(() => {
    user == "" ? navigate("/authentication") : navigate("/");
    if (user !== "") {
      async function fetchFriends() {
        try {
          const res = await fetch(`${apiUrl}/friends`, {
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
      const response = await fetch(`${apiUrl}/friendSuggestions`, {
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
