import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InfoImage from "../assets/animated/InfoImage";
import { Link } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useState } from "react";
import phone from "phone";
export default function BasicInfo() {
  const [textFields, setTextFields] = useState([1]);
  const [error, setError] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    nameRest: "",
    Phone: "",
    street: "",
    start: "9:0 AM",
    end: "9:0 PM",
    nearby: "",
  });

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
      nearby: newTextFields.map((field) => field.value),
    });
  };

  const handleChangePass = (e) => {
    const { isValidNumber, phoneNumber } = phone(e.target.value);
    const formattedNumber = isValidNumber ? phoneNumber : e.target.value;
    setBasicInfo({ ...basicInfo, Phone: formattedNumber });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!basicInfo.nameRest) {
        setError(true);
      } else {
        setError(false);
        // Handle form submission logic here
      }
    };
  };
  return (
    <div className="register basic FORM">
      <form>
        <h1>Basic Information</h1>
        <p className="description">
          Please fill your email and password to login.
        </p>

        <TextField
          id="Name-basic"
          label="Name Restaurant"
          variant="filled"
          className="textfield"
          value={basicInfo.nameRest}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, nameRest: e.target.value })
          }
          required
          error={error}
          helperText={error ? "This field is required" : ""}
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
          error={error}
          helperText={error ? "This field is required" : ""}
          onChange={(e) => {
            handleChangePass(e);
          }}
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
          error={error}
          helperText={error ? "This field is required" : ""}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimeField", "TimeField", "TimeField"]}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "50px",
              }}
            >
              {" "}
              <TimeField
                label="Start Time"
                defaultValue={dayjs("2022-04-17T9:00")}
                format="hh:mm a"
                inputProps={{
                  inputMode: "numeric",
                }}
                onChange={(newValue) => {
                  setBasicInfo({
                    ...basicInfo,
                    start:
                      newValue.$H > 12
                        ? (newValue.$H % 12) + ":" + newValue.$m + " PM"
                        : (newValue.$H % 12) + ":" + newValue.$m + " AM",
                  });
                  console.log(newValue.$H);
                }}
              />
              <TimeField
                label="End Time"
                defaultValue={dayjs("2022-04-17T21:00")}
                format="hh:mm a"
                inputProps={{
                  inputMode: "numeric",
                }}
                onChange={(newValue) => {
                  setBasicInfo({
                    ...basicInfo,
                    end:
                      newValue.$H > 12
                        ? (newValue.$H % 12) + ":" + newValue.$m + " PM"
                        : (newValue.$H % 12) + ":" + newValue.$m + " AM",
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
              error={error}
              helperText={error ? "This field is required" : ""}
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
          ad
        </div>

        <Button
          variant="contained"
          className="main-btn "
          type="submit"
          onClick={() => {
            console.log(basicInfo);
          }}
        >
          Submit
        </Button>
        <p>
          Create Account <Link to="/register">SIGHUP</Link>
        </p>
      </form>
      <p className="image-wrapper">
        <InfoImage />
      </p>
    </div>
  );
}
