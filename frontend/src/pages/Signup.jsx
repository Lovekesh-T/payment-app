import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate()
  const [firstname,setFirstname] = useState("");
  const [lastname,setLastname] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");

  const action = async (e)=>{
    e.preventDefault();
    
   try {
     const response =  await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/create`,{firstname,lastname,password,email});
     setFirstname("");
     setLastname("");
     setPassword("");
     setEmail("");
     toast.success(response.data.message);
     navigate("/login");
     
   } catch (error) {
    toast.error(error.response.data.message);
   }

      
  };
  return (
    <div className="h-screen bg-slate-500 flex justify-center items-center">
      <div className="flex flex-col bg-white py-6 px-5 gap-6 rounded-md">
        <div>
          <Heading text={"Sign Up"}/>
          <SubHeading text={"Enter your information to create a account"}/>
        </div>
        <form className="flex flex-col gap-3" onSubmit={action}>
          <InputBox type={"text"} label={"First Name"} placeholder={"John"} value={firstname} changeHandle={setFirstname}/>
          <InputBox type={"text"} label={"Last Name"} placeholder={"Doe"} value={lastname} changeHandle={setLastname}/>
          <InputBox type={"email"} label={"Email"} placeholder={"John@gmail.com"} value={email} changeHandle={setEmail}/>
          <InputBox type={"password"} label={"Password"} placeholder={""} value={password} changeHandle={setPassword}/>
          <Button text={"Sign Up"} />
          <p className="text-center text-sm">Already have a account? <Link to={"/login"} className="underline text-sm">Login</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Signup;
