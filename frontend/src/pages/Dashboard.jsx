import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atom";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [
          {
            data: { balance },
          },
          {
            data: { users },
          },
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/user/balance", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:8000/api/v1/user/bulk", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setUsers(users);
        setBalance(balance);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/user/bulk?filter=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cancelToken: cancelToken.token,
          }
        );

        setUsers(data.users);
      } catch (error) {
        console.log(error.response?.data.message);
      }
    })();

    return () => cancelToken.cancel("closing previous request");
  }, [filter]);
  return (
    <>
      <header className="flex justify-between py-5 px-6">
        <h1 className="font-bold text-xl">Payments App</h1>
        <div className="flex items-center gap-2">
          Hello, {user.firstname}{" "}
          <span className="bg-slate-200 rounded-full w-8 h-8 flex text-center justify-center items-center text-sm relative group">
            {user.firstname[0].toUpperCase()}
            <div className="absolute bottom-0 left-0  -translate-x-8 hidden translate-y-7 bg-white py-1 px-2 justify-between items-center gap-1 rounded-md shadow-md group-hover:flex ">
              <AiOutlineLogout className="fill-blue-500 text-base font-bold" />
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </span>
        </div>
      </header>
      <hr />
      <main className="flex flex-col px-6 py-4 gap-3">
        <p className="font-bold text-lg">
          Your balance <span>${balance}</span>
        </p>

        <p>Users</p>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search users..."
          className="placeholder-slate-500 placeholder:text-xs border outline-none border-slate-200 px-4 py-1 rounded-md"
        />

        <div className="flex flex-col gap-2 mt-2">
          {users.map((user) => (
            <div key={user._id} className="flex justify-between">
              <p className="flex items-center gap-2 font-bold">
                <span className="bg-slate-200 rounded-full w-8 h-8 flex text-center justify-center items-center text-sm font-normal">
                  {user.firstname[0].toUpperCase()}
                </span>
                {user.firstname}
              </p>
              <Button
                text={"Send Money"}
                onClick={() =>
                  navigate("/send", {
                    state: { id: user._id, firstname: user.firstname },
                  })
                }
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
