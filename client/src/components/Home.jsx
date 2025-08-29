import { useNavigate } from "react-router-dom";
import { useApp } from "../context/conext1";
import { useState } from "react";
const Card = ({ onClick }) => {
  return (
    <div
      className="border p-4 m-4 rounded-lg shadow-lg flex w-6/12 "
      onClick={onClick}
    >
      <div className="border rounded-4xl h-13 w-13 bg-amber-500"></div>
      <div className="ml-4">
        <p>name</p>
        <p>description</p>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { setUser } = useApp();

  return (
    <div>
      <div className="flex justify-center items-center space-x-4 p-4 bg-gray-200">
        <input
          type="text"
          placeholder="search"
          className="border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="button" value="search" onClick={() => setUser(name)} />
      </div>
      <div className="flex flex-col items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (item) {
          return (
            <Card
              key={item}
              onClick={() => {
                navigate("/chatPage");
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Home;
