import React, { useState } from "react";
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

const MyMenuCard = ({ menuItem }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation modal
  const [servingTimes, setServingTimes] = useState({
    breakfast: menuItem.servingTime.includes("breakfast"),
    lunch: menuItem.servingTime.includes("lunch"),
    dinner: menuItem.servingTime.includes("dinner"),
  });
  const [submitted, setSubmitted] = useState(false); // State to track submission
  const [loading, setLoading] = useState(false); // State to track delete request

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

  const handleUpdateServingTimes = () => {
    const servingTimesArray = Object.keys(servingTimes).filter(
      (time) => servingTimes[time]
    );

    setLoading(true); // Start loading state

    axios
      .put(`http://localhost:3000/api/myMenu/update/${menuItem._id}`, {
        servingTime: servingTimesArray,
      })
      .then((response) => {
        console.log("Serving times updated successfully:", response.data);
        setSubmitted(true); // Optionally set submitted state
        handleClose(); // Close modal after submission
        setLoading(false); // End loading state
        window.location.reload(); // Refresh the page to reflect the changes
      })
      .catch((error) => {
        console.error("Error updating serving times:", error);
        setLoading(false); // End loading state even if there's an error
      });
  };

  const handleDeleteSelection = () => {
    setConfirmOpen(true); // Open confirmation modal instead of deleting immediately
  };

  const handleDeleteConfirm = () => {
    setLoading(true); // Start loading state

    axios
      .delete(`http://localhost:3000/api/myMenu/${menuItem._id}`)
      .then((response) => {
        console.log("Menu item deleted successfully:", response.data);
        setSubmitted(false); // Reset the submitted state
        setLoading(false); // End loading state
        handleConfirmClose(); // Close confirmation modal
        window.location.reload(); // Refresh the page to reflect the changes
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
        <Button
          onClick={handleOpen}
          variant="contained"
          color="primary"
          style={{ marginTop: "10px", borderRadius: "10px" }}
        >
          Choose Serving Times
        </Button>

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
              sx={{ mt: 2 }}
              onClick={handleUpdateServingTimes} // Call update function
              disabled={loading} // Disable button while loading
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
            <Button
              onClick={() => {
                handleClose();
                setServingTimes({
                  breakfast: menuItem.servingTime.includes("breakfast"),
                  lunch: menuItem.servingTime.includes("lunch"),
                  dinner: menuItem.servingTime.includes("dinner"),
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

MyMenuCard.propTypes = {
  menuItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    price: PropTypes.number,
    description: PropTypes.string,
    servingTime: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MyMenuCard;
