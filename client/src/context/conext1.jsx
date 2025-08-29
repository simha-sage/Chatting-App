import { createContext, useContext, useEffect, useState } from "react";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState("noUser");
  useEffect(() => {
    console.log("user changed", user);
  }, [user]);
  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
export const useApp = () => useContext(AppContext);
