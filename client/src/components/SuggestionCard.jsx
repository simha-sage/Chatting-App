const apiUrl = import.meta.env.VITE_API_URL;
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
    <div className="border p-3 m-1 rounded-lg shadow-lg flex min-w-78 justify-between items-center">
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
export default SuggestionCard;
