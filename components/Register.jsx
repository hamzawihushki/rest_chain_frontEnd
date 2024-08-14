import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import SignUpImage from "../assets/animated/SignUpImage";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Validate email to end with 'gmai.com'
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

    return emailPattern.test(email);
  };
  const handelGoTologinPage = () => {
    navigate("/", { replace: true }); // Redirect to the signup page
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!userData.fullName || !userData.email || !userData.password) {
      setError("Please fill in all fields!");
      return;
    }

    // Email validation
    if (!validateEmail(userData.email)) {
      setError(
        "Please enter a valid email address ending with @(gmail | yahoo | outlook).com !"
      );
      return;
    }

    axios
      .post("http://localhost:3000/api/users/register", userData)
      .then((res) => {
        if (res.data.status === "success") {
          console.log("Response:", res.data.data.user._id); // Get user ID from response
          localStorage.setItem("token", res.data.data.user.token); // Store JWT token in local storage
          localStorage.setItem("user_ID", res.data.data.user._id); // Store user ID in local storage
          localStorage.setItem("User", JSON.stringify(res.data.data.user)); // Store user data in local
          setUserData({
            fullName: "",
            email: "",
            password: "",
          });
          navigate("/basic-information", { replace: true }); // Redirect to another page if needed
        } else {
          // Handle other response messages if needed
          setError(res.data.message || "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        if (err.response) {
          // Check if error response is available
          const { status, data } = err.response;
          if (status === 400 && data.message === "email already exists") {
            setError(
              "The email address is already in use. Please choose another one."
            );
          } else {
            setError(data.message || "An error occurred. Please try again.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error:", err);
      });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register FORM">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p className="description">
          Create an account to access all features of the Resto app.
        </p>
        {error && (
          <p
            className="error"
            style={{ color: "red", background: "#eee", padding: "20px" }}
          >
            {error}
          </p>
        )}
        <TextField
          id="fullName-basic"
          label="User Name"
          variant="filled"
          className="textfield"
          value={userData.fullName}
          onChange={(e) =>
            setUserData({ ...userData, fullName: e.target.value })
          }
        />
        <TextField
          id="email-basic"
          label="E-mail"
          variant="filled"
          className="textfield"
          type="email" // Basic HTML5 validation
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <TextField
          className="textfield"
          id="filled-password-input"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          variant="filled"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
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
          Sign Up
        </Button>
        <p>
          Already have an account?
          <Button onClick={handelGoTologinPage}>LOGIN</Button>
        </p>
      </form>
      <p className="image-wrapper">
        <SignUpImage />
      </p>
    </div>
  );
}
