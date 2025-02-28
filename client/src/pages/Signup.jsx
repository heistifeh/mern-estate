import React from "react";
import { Link } from "react-router-dom";
const Signup = () => {
  return (
    <div className="text-center mt-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="  p-3 rounded-lg focus:outline-0 bg-slate-200"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className=" p-3 rounded-lg focus:outline-0 bg-slate-200"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className=" p-3 rounded-lg focus:outline-0 bg-slate-200"
        />
        <button className=" p-3 rounded-lg focus:outline-0 bg-slate-700 uppercase hover:opacity-95 cursor-pointer text-slate-100">
          Sign Up
        </button>
      </form>
      <div className="flex justify-center p-4 gap-1">
        <p>Have an account? </p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500 italic">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
