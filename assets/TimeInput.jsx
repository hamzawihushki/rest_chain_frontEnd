import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Container, Grid, Typography, Button } from "@mui/material";

const timeTo12HourFormat = (hour, minute) => {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute < 10 ? `0${minute}` : minute} ${period}`;
};

export default function TimeInput() {
  const [startHour, setStartHour] = useState(0);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [endMinute, setEndMinute] = useState(0);

  const handleStartHourChange = (e) =>
    setStartHour(parseInt(e.target.value) || 0);
  const handleStartMinuteChange = (e) =>
    setStartMinute(parseInt(e.target.value) || 0);
  const handleEndHourChange = (e) => setEndHour(parseInt(e.target.value) || 0);
  const handleEndMinuteChange = (e) =>
    setEndMinute(parseInt(e.target.value) || 0);

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Start Time</Typography>
        <TextField
          type="number"
          label="Hour"
          variant="filled"
          value={startHour}
          onChange={handleStartHourChange}
          inputProps={{ min: 0, max: 23 }}
          style={{ marginRight: "8px" }}
        />
        <TextField
          type="number"
          label="Minute"
          variant="filled"
          value={startMinute}
          onChange={handleStartMinuteChange}
          inputProps={{ min: 0, max: 59 }}
        />

        <Typography variant="body1">
          {timeTo12HourFormat(startHour, startMinute)}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">End Time</Typography>
        <TextField
          type="number"
          label="Hour"
          variant="filled"
          value={endHour}
          onChange={handleEndHourChange}
          inputProps={{ min: 0, max: 23 }}
          style={{ marginRight: "8px" }}
        />
        <TextField
          type="number"
          label="Minute"
          variant="filled"
          value={endMinute}
          onChange={handleEndMinuteChange}
          inputProps={{ min: 0, max: 59 }}
        />

        <Typography variant="body1">
          {timeTo12HourFormat(endHour, endMinute)}
        </Typography>
      </Grid>
    </>
  );
}
