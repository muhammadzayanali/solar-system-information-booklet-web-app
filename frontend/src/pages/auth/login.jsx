import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login", 
        formData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/homepage");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = (shouldNavigate) => {
    setShowConfirmation(false);
    if (shouldNavigate) {
      navigate("/signup");
    } else {
      // Reset form fields
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center" style={{ backgroundImage: "url('loginbg.jpg')",  backgroundSize: "cover" }}>
      <div className="p-8 w-full max-w-md border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
          
        </form>
        <div>
          <p className="text-center mt-4">Don't have an account? <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a></p>
        </div>
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
              <p className="mb-4 text-center">Your credential is false. Do you want to Signup your account?</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => handleConfirmation(true)}
                  className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
                >
                  Yes
                </button>
                <button 
                  onClick={() => handleConfirmation(false)}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;





// import React, { useState } from "react";
// import axios from "axios";
// import Header from "../../components/header";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/login", formData);
//       alert("Login successful!");
//       localStorage.setItem("token", response.data.token);
//       navigate("/homepage");
//     } catch (err) {
//       alert("Error: " + (err.response?.data?.error || "Invalid credentials"));
//       navigate("/signup");
//     }
//   };

//   return (
//     <div className="bg-slate-900 min-h-screen text-white">
//       <Header />
//       <div className="p-8">
//         <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
//         <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="w-full p-2 rounded bg-gray-800 text-white"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             className="w-full p-2 rounded bg-gray-800 text-white"
//             required
//           />
//           <button type="submit" className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;