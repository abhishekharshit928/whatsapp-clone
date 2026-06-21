import { useForm } from "react-hook-form";
import api from '../api/axios'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";

function Signup() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

    const { register, handleSubmit } = useForm();
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false);
    const user = useSelector((state)=> state.auth.user)
    const isLoggined = Boolean(user)
    useEffect(() => {
      if (isLoggined) {
      navigate("/");
  }
}, [isLoggined, navigate]);


    const submit = async (data) => {
        try {
            setLoading(true)
            const res = await api.post("/auth/signup", data)
            console.log(res.data)
            // dispatch(setUser(res.data.user))
            navigate("/login");
            
        } catch (error) {
            if (error.response?.data?.message)
                setError(error.response?.data?.message)
            else {
                setError("failed to create account")
            }
        } finally {
            setLoading(false)
        }
    }

return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-indigo-950 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">
        
        {/* Logo & Heading */}
        
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
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
          >
          {loading ? "Creating Account..." : "Signup"}
          </button>
          
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span className="text-purple-400 cursor-pointer hover:text-purple-300" onClick={()=>{navigate("/login")}}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;