import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Backdrop,
} from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useLocation } from "react-router-dom";
import "./MenuCard.css";

// Animated Fade component
const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, ...other } = props;
  const style = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool.isRequired,
};

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MainMenuCard = ({ menuItem }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation modal
  const [servingTimes, setServingTimes] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [submitted, setSubmitted] = useState(false); // State to track submission
  const [loading, setLoading] = useState(false); // State to track delete request
  const [item_ID, setItem_ID] = useState(""); // State to track item ID for editing
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const handleCheckboxChange = (event) => {
    setServingTimes({
      ...servingTimes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", menuItem.name);
    formData.append("price", 52); // Updated price
    formData.append("avatar", `${menuItem.avatar}`);
    formData.append("user_ID", localStorage.getItem("user_ID")); // Get restaurant ID from local storage

    // Collect serving times as an array
    const servingTimesArray = Object.keys(servingTimes).filter(
      (time) => servingTimes[time]
    );
    formData.append("servingTime", JSON.stringify(servingTimesArray)); // Append serving times as a JSON string
    axios
      .post("http://localhost:3000/api/myMenu/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the content type is set correctly
        },
      })
      .then((response) => {
        console.log(
          "Item added successfully:",
          response.data.data.newItemMenu._id
        );
        setItem_ID(response.data.data.newItemMenu._id); // Set item ID for editing
        setSubmitted(true); // Set submitted state to true
        handleClose(); // Close modal after submission
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  };

  const handleDeleteSelection = () => {
    setConfirmOpen(true); // Open confirmation modal instead of deleting immediately
  };

  const handleDeleteConfirm = () => {
    setLoading(true); // Start loading state

    axios
      .delete(`http://localhost:3000/api/myMenu/${item_ID}`)
      .then((response) => {
        console.log("Menu item deleted successfully:", response.data);
        setSubmitted(false); // Reset the submitted state
        setLoading(false); // End loading state
        handleConfirmClose(); // Close confirmation modal
      })
      .catch((error) => {
        console.error("Error deleting menu item:", error);
        setLoading(false); // End loading state even if there's an error
        handleConfirmClose(); // Close confirmation modal
      });
  };

  const handleDeleteCancel = () => {
    handleConfirmClose(); // Close confirmation modal without deleting
  };

  // Format serving times for display
  const servingTimesArray = menuItem.servingTime || [];
  const displayedServingTimes = servingTimesArray.join(", ") || "Not available";

  return (
    <div className={`card ${submitted ? "blurred" : ""}`}>
      <div style={{ height: "200px" }}>
        <img
          src={`http://localhost:3000/uploads/${menuItem.avatar}`}
          alt={menuItem.name}
        />
      </div>
      <h3>{menuItem.name}</h3>
      <p>
        Serving Time:{" "}
        <span style={{ color: "#3f51b5", textTransform: "capitalize" }}>
          {displayedServingTimes}
        </span>
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          gap: "10px",
        }}
      >
        {!submitted ? (
          <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px", borderRadius: "10px" }}
          >
            Choose Serving Times
          </Button>
        ) : (
          <>
            <Button
              onClick={handleDeleteSelection}
              variant="contained"
              color="secondary"
              style={{ marginTop: "10px" }}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}
      </div>

      {/* Modal for selecting serving times */}
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="spring-modal-title" variant="h6" component="h2">
              Select Serving Times
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={servingTimes.breakfast}
                  onChange={handleCheckboxChange}
                  name="breakfast"
                />
              }
              label="Breakfast"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={servingTimes.lunch}
                  onChange={handleCheckboxChange}
                  name="lunch"
                />
              }
              label="Lunch"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={servingTimes.dinner}
                  onChange={handleCheckboxChange}
                  name="dinner"
                />
              }
              label="Dinner"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                handleClose();
                setServingTimes({
                  breakfast: false,
                  lunch: false,
                  dinner: false,
                });
              }}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={confirmOpen}
        onClose={handleConfirmClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={confirmOpen}>
          <Box sx={modalStyle}>
            <Typography
              id="confirmation-modal-title"
              variant="h6"
              component="h2"
            >
              Confirm Deletion
            </Typography>
            <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteConfirm}
              sx={{ mt: 2 }}
            >
              Delete
            </Button>
            <Button onClick={handleDeleteCancel} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

MainMenuCard.propTypes = {
  menuItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    price: PropTypes.number,
    description: PropTypes.string,
    servingTime: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MainMenuCard;
