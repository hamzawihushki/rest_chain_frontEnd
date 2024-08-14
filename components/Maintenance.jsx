import React, { useEffect, useState } from "react";
import "../src/App.css";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import MaintenanceImage from "../assets/animated/MaintenanceImage";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

export default function Maintenance() {
  const [formData, setFormData] = useState({
    start: null,
    end: null,
    impact: "1", // Default to complete shutdown
    price: "",
    comments: "",
    user_ID: localStorage.getItem("user_ID"), // Retrieve user_ID from local storage
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [maintenanceData, setMaintenanceData] = useState([]); // State for fetched data
  const [fetching, setFetching] = useState(true); // State for fetching status
  const navigate = useNavigate();

  // Fetch maintenance data based on user_ID on component mount
  useEffect(() => {
    const { user_ID } = formData;
    if (user_ID) {
      axios
        .get(`http://localhost:3000/api/maintenance/${user_ID}`)
        .then((res) => {
          setMaintenanceData(res.data.data || []);
          console.log(res.data);
          setFetching(false);
        })
        .catch((err) => {
          setError("Failed to fetch maintenance data. Please try again.");
          setFetching(false);
          console.error("Error fetching maintenance data:", err.message);
        });
    } else {
      setFetching(false); // No user_ID found, stop fetching
    }
  }, [formData.user_ID]); // Add formData.user_ID as a dependency

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData({
      ...formData,
      [name]: newValue ? newValue.format("YYYY-MM-DD") : null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form submission starts

    console.log("Form data:", formData);

    // Validate required fields
    if (!formData.start || !formData.end || !formData.price) {
      setError("Please fill in all required fields!");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    axios
      .post("http://localhost:3000/api/maintenance", formData)
      .then((res) => {
        setLoading(false); // Set loading to false when request completes
        if (res.data.status === "success") {
          console.log("Response:", res.data.data);
          navigate("/Dashboard"); // Replace with your success page route
        } else {
          setError(res.data.message || "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        setLoading(false); // Set loading to false if an error occurs
        if (err.response) {
          setError(
            err.response.data.message || "An error occurred. Please try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.log("Error:", err.message);
      });
  };

  return (
    <div
      style={{
        paddingBottom: "20px",
      }}
    >
      {!fetching && maintenanceData.length > 0 && (
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
      )}
      <div className="maintenance-form FORM register">
        {loading && <CircularProgress />}
        <form onSubmit={handleSubmit}>
          <h1>Maintenance Form</h1>
          <p
            className="description"
            style={{
              color: "red",
              background: "#eee",
              padding: "20px",
              display: `${error ? "block" : "none"}`,
            }}
          >
            {error}
          </p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: "flex", gap: "20px" }}>
              <DatePicker
                label="Start Date"
                value={formData.start ? dayjs(formData.start) : null}
                onChange={handleDateChange("start")}
                renderInput={(params) => <TextField {...params} />}
                required
              />
              <DatePicker
                label="End Date"
                value={formData.end ? dayjs(formData.end) : null}
                onChange={handleDateChange("end")}
                renderInput={(params) => <TextField {...params} />}
                required
              />
            </div>
          </LocalizationProvider>

          <FormControl component="fieldset" style={{ margin: "20px 0" }}>
            <FormLabel component="legend">Impact</FormLabel>
            <RadioGroup
              aria-label="impact"
              name="impact"
              value={formData.impact}
              onChange={handleChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Complete Shutdown"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Partial Shutdown"
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="Normal Operations"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            id="price"
            name="price"
            label="Price in JD"
            variant="filled"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ marginBottom: "20px" }}
            error={!!error && !formData.price}
            helperText={
              !!error && !formData.price ? "This field is required" : ""
            }
          />

          <TextField
            id="comments"
            name="comments"
            label="Comments"
            variant="filled"
            multiline
            rows={4}
            value={formData.comments}
            onChange={handleChange}
            style={{
              marginBottom: "20px",
              width: "100%",
            }}
          />

          <Button variant="contained" className="main-btn" type="submit">
            Submit
          </Button>
        </form>

        <p className="image-wrapper">
          <MaintenanceImage />
        </p>

        {/* Conditionally render maintenance data as a table */}

        {!fetching && maintenanceData.length === 0 && ""}
      </div>

      {!fetching && maintenanceData.length > 0 && (
        <div className="maintenance-data">
          <h2>Previous Maintenance Records</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Impact</th>
                <th>Price (JD)</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((record) => (
                <tr key={record._id}>
                  <td>{record._id}</td>
                  <td>{record.start}</td>
                  <td>{record.end}</td>
                  <td>
                    {record.impact === "1"
                      ? "Complete Shutdown"
                      : record.impact === "2"
                      ? "Partial Shutdown"
                      : "Normal Operations"}
                  </td>
                  <td>{record.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
