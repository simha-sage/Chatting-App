import { useNavigate } from "react-router-dom";
const FriendCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border p-3 m-1 rounded-lg shadow-lg flex w-89 min-w-78 justify-between items-center"
      onClick={() =>
        navigate(`/chatPage/?friendId=${data._id}&name=${data.name}`)
      }
    >
      <div className="border rounded-4xl h-13 w-13 bg-amber-500 flex justify-center items-center">
        {/* optional icon or text here */}
      </div>
      <div className="ml-4 flex-1">
        <p>{data.name}</p>
      </div>
    </div>
  );
};
export default FriendCard;
