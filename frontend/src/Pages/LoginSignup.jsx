import React, { useState } from 'react';
import './css/LoginSignup.css';
import axiosConfig from "../axiosConfig";

const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    try {
      const response = await axiosConfig.post('users/login', formData);
      const responseData = response.data;

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed", formData);
    try {
      const response = await axiosConfig.post('users/signup', formData);
      const responseData = response.data;

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your Name"
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup(); }}>
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
