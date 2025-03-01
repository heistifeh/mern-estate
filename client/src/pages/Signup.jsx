import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      navigate("/sign-in");
      if (data.success === false) {
        throw new Error(data.message, "fucked up");
      }
    } catch (error) {
      setError(error.message, "error message");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData);
  return (
    <div className="text-center mt-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="  p-3 rounded-lg focus:outline-0 bg-slate-200"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className=" p-3 rounded-lg focus:outline-0 bg-slate-200"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className=" p-3 rounded-lg focus:outline-0 bg-slate-200"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className=" p-3 rounded-lg focus:outline-0 bg-slate-700 uppercase hover:opacity-95 cursor-pointer text-slate-100"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex justify-center p-4 gap-1">
        <p>Have an account? </p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500 italic">Sign in</span>
        </Link>
      </div>
      {error && <span>{error}</span>}
    </div>
  );
};

export default Signup;
