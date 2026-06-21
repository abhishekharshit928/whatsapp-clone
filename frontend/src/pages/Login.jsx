import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { setUser } from "../store/authSlice";

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state)=>state.auth.user);
  const isLoggined = Boolean(user);


  useEffect(()=>{

    if(isLoggined){
      navigate("/");
    }

  },[isLoggined,navigate]);


  const submit = async(data)=>{

    try{

      setLoading(true);
      setError("");

      const res = await api.post("/auth/login",data);

      dispatch(setUser(res.data.user));


    }catch(error){

      setError(
        error.response?.data?.message || "Failed to login"
      );

    }finally{

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-indigo-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">


        <div className="text-center mb-8">

          <img
            src="/logo.png"
            alt="NovaChat Logo"
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg"
          />


          <h1 className="text-4xl font-bold text-purple-500">
            NovaChat
          </h1>


          <p className="text-gray-400 mt-2">
            Welcome back! Login to continue.
          </p>


        </div>



        <form 
          onSubmit={handleSubmit(submit)}
          className="space-y-5"
        >


          <div>

            <label className="block text-gray-300 mb-2">
              Username
            </label>


            <input

              {...register("userName")}

              disabled={loading}

              type="text"

              placeholder="Enter your username"

              required

              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"

            />

          </div>



          <div>

            <label className="block text-gray-300 mb-2">
              Password
            </label>


            <input

              {...register("password")}

              disabled={loading}

              type="password"

              placeholder="Enter your password"

              required

              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"

            />

          </div>



          {
            error && 
            <p className="text-red-400 text-sm">
              {error}
            </p>
          }



          <button

            type="submit"

            disabled={loading}

            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"

          >

            {loading ? "Logging in..." : "Login"}

          </button>



        </form>



        <p className="text-center text-gray-400 mt-6">

          Don't have an account?{" "}

          <span

            className="text-purple-400 cursor-pointer hover:text-purple-300"

            onClick={()=>navigate("/signup")}

          >

            Signup

          </span>


        </p>



      </div>


    </div>

  );

}

export default Login;