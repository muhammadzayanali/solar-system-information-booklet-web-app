import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", formData);
      alert(response.data.message);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center" style={{ backgroundImage: "url('loginbg.jpg')",  backgroundSize: "cover" }}>
      <div className="p-8 w-full max-w-md border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Sign Up</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;