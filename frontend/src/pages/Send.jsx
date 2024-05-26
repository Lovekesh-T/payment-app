import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Send = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const {
    state: { id: to, firstname },
  } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!to || !amount) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/account/transfer`,
        { to, amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response?.data.message);
      navigate("/dashboard")
    } catch (error) {
      console.log(error.response?.data.message);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="h-screen bg-slate-500 flex justify-center items-center">
      <div className="flex flex-col bg-white py-6 px-8 gap-6 rounded-md max-w-sm w-full">
        <div>
          <Heading text={"Send Money"} />
        </div>

        <p className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-green-700 rounded-full w-10 h-10 flex text-center justify-center items-center text-base font-normal text-white ">
           {firstname.slice(0,1).toLowerCase()}
          </span>
          {firstname}
        </p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <InputBox
            label={"Amount (in rs)"}
            placeholder={"Enter amount"}
            value={amount}
            changeHandle={setAmount}
          />
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Initial Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Send;
