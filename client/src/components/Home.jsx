import { useNavigate } from "react-router-dom";
import { useApp } from "../context/context1";
import { useState, useEffect, use } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const { friendSuggestions, friends } = useApp();

  return (
    <div>
      <div className="flex flex-col items-center">
        <p>Friends</p>
        {friends.map((item) => {
          return <FriendCard key={item._id} data={item} />;
        })}
        <p>Suggestion</p>
        {friendSuggestions.map((item) => {
          return <SuggestionCard key={item._id} data={item} />;
        })}
      </div>
    </div>
  );
};
export default Home;
