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
          // handle unauthorized or missing token
          if (response.status === 401) {
            console.warn("No valid session, redirecting...");
            navigate("/authentication");
            return;
          }

          throw new Error(
            `Authentication failed with status: ${response.status}`
          );
        }

        // ✅ only parse JSON when ok
        const data = await response.json();
        setUser(data.user);
        setUserId(data.userId);
        navigate("/"); // restore user from cookie
      } catch (error) {
        navigate("/authentication");
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchFriendsAndSuggestions = async () => {
      try {
        const [friendsRes, suggestionsRes] = await Promise.all([
          fetch(`${apiUrl}/friends`, { credentials: "include" }),
          fetch(`${apiUrl}/friendSuggestions`, { credentials: "include" }),
        ]);

        const friendsData = await friendsRes.json();
        const suggestionsData = await suggestionsRes.json();

        setFriends(friendsData);
        setFriendSuggestions(suggestionsData);
      } catch (err) {
        console.error("Error fetching friends or suggestions:", err);
      }
    };

    fetchFriendsAndSuggestions();
  }, [user]);

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
