import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InfoImage from "../assets/animated/InfoImage";
import { Link, useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

const BASE_URL = "http://localhost:3000"; // Replace with your base URL

export default function MyBasicInfo() {
  const [textFields, setTextFields] = useState([{ id: uuidv4(), value: "" }]);
  const [phoneError, setPhoneError] = useState(""); // State for phone number errors
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    Phone: "",
    street: "",
    open: "9:00 AM",
    close: "9:00 PM",
    nearbyLandmarks: [],
    user_ID: localStorage.getItem("user_ID"), // Get user ID from local storage
    _id: "", // Initialize with empty string for the record ID
  });
  const navigate = useNavigate(); // Use the navigate hook

  // Regular expression for validating phone number
  const phoneNumberPattern = /^(077|078|079)\d{7}$/;

  // Populate form with local storage data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("Basic Information");
    if (savedData) {
      const data = JSON.parse(savedData);
      setBasicInfo({
        name: data.name || "",
        Phone: data.Phone || "",
        street: data.street || "",
        open: data.open || "9:00 AM",
        close: data.close || "9:00 PM",
        nearbyLandmarks: data.nearbyLandmarks || [],
        user_ID: data.user_ID || localStorage.getItem("user_ID"), // Get user_ID from data or local storage
        _id: data._id || "", // Set the record ID if it exists
      });
      setTextFields(
        data.nearbyLandmarks.map((landmark) => ({
          id: uuidv4(),
          value: landmark,
        }))
      );
    }
  }, []);

  const handleAddField = () => {
    setTextFields([...textFields, { id: uuidv4(), value: "" }]);
  };

  const handleChange = (id, event) => {
    const newTextFields = textFields.map((field) =>
      field.id === id ? { ...field, value: event.target.value } : field
    );
    setTextFields(newTextFields);
    setBasicInfo({
      ...basicInfo,
      nearbyLandmarks: newTextFields.map((field) => field.value),
    });
  };

  const handleChangePhone = (e) => {
    const phoneValue = e.target.value;
    // Update state for the phone number field
    setBasicInfo({ ...basicInfo, Phone: phoneValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!basicInfo.name || !basicInfo.Phone || !basicInfo.street) {
      setPhoneError("Please fill in all required fields!");
      return;
    }

    // Check if phone number format is valid
    if (!phoneNumberPattern.test(basicInfo.Phone)) {
      setPhoneError(
        "Please enter a valid phone number format like 077 2756325"
      );
      return;
    }

    // Prepare URL and method for API request
    const url = `${BASE_URL}/api/BasicInformation/${basicInfo.user_ID}`;
    const method = basicInfo._id ? "put" : "post";

    axios({
      method,
      url,
      data: basicInfo,
    })
      .then((res) => {
        if (res.data.status === "success") {
          console.log("Response:", res.data.data.newBasicInformation);
          // Optionally handle success (e.g., show a success message or redirect)
          localStorage.setItem(
            "rest_ID",
            res.data.data.newBasicInformation._id
          );
          localStorage.setItem(
            "Basic Information",
            JSON.stringify(res.data.data.newBasicInformation)
          );
          // Store restaurant ID in local storage
          navigate("/menu-restaurant/", { replace: true }); // Use navigate for redirection
        } else {
          // Set error message from response if status is not success
          setPhoneError(
            res.data.message || "An error occurred. Please try again."
          );
        }
      })
      .catch((err) => {
        if (err.response) {
          // Set error message from response if status code is not 2xx
          setPhoneError(
            err.response.data.message || "An error occurred. Please try again."
          );
        } else {
          // Set a generic error message if no response is available
          setPhoneError("An unexpected error occurred. Please try again.");
        }
        console.error("Error:", err);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        className="main-btn"
        onClick={() => {
          navigate("/dashboard", { replace: true });
        }}
        style={{
          position: "absolute",
          top: "20px",
          left: "50px",
        }}
        color="secondary"
      >
        ➡ Return to Dashboard
      </Button>
      <div className="register basic FORM">
        <form onSubmit={handleSubmit}>
          <h1>Basic Information</h1>
          <p
            className="description"
            style={{ color: "red", background: "#eee", padding: "20px" }}
          >
            {phoneError
              ? phoneError
              : "Please fill in your details to continue."}
          </p>

          <TextField
            id="Name-basic"
            label="Name Restaurant"
            variant="filled"
            className="textfield"
            value={basicInfo.name}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, name: e.target.value })
            }
            required
            error={!!phoneError && !basicInfo.name}
            helperText={
              !!phoneError && !basicInfo.name ? "This field is required" : ""
            }
          />

          <TextField
            type="tel"
            className="textfield"
            id="phone-input"
            label="Phone Number"
            autoComplete="current-phone"
            variant="filled"
            value={basicInfo.Phone}
            required
            error={!!phoneError && !phoneNumberPattern.test(basicInfo.Phone)}
            helperText={!!phoneError ? phoneError : ""}
            onChange={handleChangePhone} // Use handleChangePhone for updating and validating phone number
          />

          <TextField
            id="Street-basic"
            label="Street Name"
            variant="filled"
            className="textfield"
            value={basicInfo.street}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, street: e.target.value })
            }
            required
            error={!!phoneError && !basicInfo.street}
            helperText={
              !!phoneError && !basicInfo.street ? "This field is required" : ""
            }
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimeField", "TimeField"]}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "50px",
                }}
              >
                <TimeField
                  label="Open Time"
                  defaultValue={dayjs(`2022-04-17T${basicInfo.open}`)}
                  format="hh:mm a"
                  inputProps={{ inputMode: "numeric" }}
                  onChange={(newValue) => {
                    setBasicInfo({
                      ...basicInfo,
                      open: newValue.format("hh:mm a"),
                    });
                  }}
                />
                <TimeField
                  label="Close Time"
                  defaultValue={dayjs(`2022-04-17T${basicInfo.close}`)}
                  format="hh:mm a"
                  inputProps={{ inputMode: "numeric" }}
                  onChange={(newValue) => {
                    setBasicInfo({
                      ...basicInfo,
                      close: newValue.format("hh:mm a"),
                    });
                  }}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>

          <div style={{ width: "50%" }}>
            {textFields.map((field) => (
              <TextField
                key={field.id}
                label="Nearby Landmarks"
                variant="filled"
                value={field.value}
                onChange={(event) => handleChange(field.id, event)}
                required
                error={!!phoneError && !field.value}
                helperText={
                  !!phoneError && !field.value ? "This field is required" : ""
                }
                style={{ marginBottom: "10px", display: "block" }}
              />
            ))}
            <Button
              variant="contained"
              onClick={handleAddField}
              style={{ fontSize: "20px", width: "50px", height: "30px" }}
              color="secondary"
            >
              +
            </Button>
          </div>

          <Button variant="contained" className="main-btn" type="submit">
            Submit
          </Button>
          <p>
            Create Account <Link to="/register">SIGN UP</Link>
          </p>
        </form>
        <p className="image-wrapper">
          <InfoImage />
        </p>
      </div>
    </>
  );
}
