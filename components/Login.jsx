import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginImage from "../assets/animated/LoginImage";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handelGoToSignUpPage = () => {
    navigate("/register", { replace: true }); // Redirect to the signup page
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (email && password) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/users/login`,
          {
            email,
            password,
          }
        );

        if (response.status === 200) {
          // Handle successful login (e.g., store token, redirect user)
          console.log("Login successful:", response.data);
          localStorage.setItem("token", response.data.data.user.token); // Store JWT token in local storage
          localStorage.setItem("user_ID", response.data.data.user._id); // Store user ID in local storage
          localStorage.setItem("User", JSON.stringify(response.data.data.user)); // Store user data in
          // Example: navigate to a different page on successful login
          navigate("/dashboard", { replace: true }); // Redirect to a protected route or dashboard
        } else {
          // Handle errors (e.g., show error message)
          console.error("Login failed:", response.data.message);
          alert("Login failed: " + response.data.message);
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="register FORM">
      <form onSubmit={handleSubmit}>
        <h1>Welcome Back.</h1>
        <p className="description">
          Please fill your email and password to login.
        </p>

        <TextField
          id="E-mail-basic"
          label="E-mail"
          variant="filled"
          className="textfield"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="textfield"
          id="filled-password-input"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" type="submit" className="main-btn">
          Login
        </Button>
        <p>
          Create Account <Button onClick={handelGoToSignUpPage}>SIGN UP</Button>
        </p>
      </form>
      <p className="image-wrapper">
        <LoginImage />
      </p>
    </div>
  );
}
