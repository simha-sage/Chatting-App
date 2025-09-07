import React from "react";
import { useApp } from "../context/context1";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const logOut = async () => {
    setUser("");
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/authentication");
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
          🚀ChatME
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>{user} </summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <p onClick={() => navigate("/profile")}>Profile</p>
                </li>
                <li>
                  <p className="text-orange-600" onClick={logOut}>
                    Logout
                  </p>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
