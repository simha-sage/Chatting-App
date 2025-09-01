import { useNavigate } from "react-router-dom";
import { useApp } from "../context/conext1";
import { useState, useEffect, use } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const FriendCard = ({ onClick, data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border p-4 m-4 rounded-lg shadow-lg flex w-6/12 justify-between items-center"
      onClick={() =>
        navigate(`/chatPage/?friendId=${data._id}&name=${data.name}`)
      }
    >
      <div className="border rounded-4xl h-13 w-13 bg-amber-500 flex justify-center items-center">
        {/* optional icon or text here */}
      </div>
      <div className="ml-4 flex-1">
        <p>{data.name}</p>
        <p>{data._id}</p>
      </div>
    </div>
  );
};

const SuggestionCard = ({ data }) => {
  const { friends, setFriends, setFriendSuggestions, friendSuggestions } =
    useApp();
  async function addFriend(data) {
    try {
      const res = await fetch(`${apiUrl}/addFriend`, {
        method: "POST",
        credentials: "include", // 🔑 send cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
        }),
      });

      const response = await res.json();
      console.log("Add Friend Response:", data);
      return response;
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  }

  return (
    <div className="border p-4 m-4 rounded-lg shadow-lg flex w-6/12 justify-between items-center">
      <div className="border rounded-4xl h-13 w-13 bg-amber-500 flex justify-center items-center">
        {/* optional icon or text here */}
      </div>
      <div className="ml-4 flex-1">
        <p>{data.name}</p>
        <p>{data.email}</p>
      </div>
      <div>
        <input
          className="px-4 py-2 bg-amber-400 rounded"
          type="button"
          value="ADD"
          onClick={async () => {
            const response = await addFriend(data);
            if (response?.success) {
              setFriends([data, ...friends]);
              setFriendSuggestions(
                friendSuggestions.filter((i) => i._id !== data._id)
              );
            } else {
              console.error("Failed to add friend:", response);
            }
          }}
        />
      </div>
    </div>
  );
};

const User = () => {
  const { user, setUser } = useApp();
  const [dropDown, setDropDown] = useState(false);
  const logOut = async () => {
    setUser("");
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setDropDown(false);
  };

  return (
    <div className="relative border">
      <button onClick={() => setDropDown(!dropDown)}>{user}</button>
      {dropDown && (
        <div className="absolute right-0 mt-2  bg-white border rounded-lg">
          <p className="text-right">^</p>
          <button onClick={logOut} className="px-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
const Home = () => {
  const { friendSuggestions, friends } = useApp();

  return (
    <div>
      <div className="flex justify-between items-center space-x-4 p-4 bg-gray-200">
        <input type="text" placeholder="search" className="border" />
        <input type="button" value="search" />
        <User />
      </div>

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
