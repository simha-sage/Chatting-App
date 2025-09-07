const apiUrl = import.meta.env.VITE_API_URL;
import { useApp } from "../context/context1";
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
    <div className="border p-3 m-1 rounded-lg shadow-lg flex w-96 justify-between items-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500">
        {/* optional icon or initials */}
      </div>

      <div className="ml-4 flex-1">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-gray-600">{data.email}</p>
      </div>

      <input
        type="button"
        value="ADD"
        className="w-20 h-10 bg-amber-400 rounded text-center font-medium hover:bg-amber-500 cursor-pointer"
        onClick={async () => {
          const response = await addFriend(data);
          if (response?.success) {
            setFriends([data, ...friends]);
            setFriendSuggestions(
              friendSuggestions.filter((i) => i._id !== data._id)
            );
          }
        }}
      />
    </div>
  );
};
export default SuggestionCard;
