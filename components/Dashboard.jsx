import React, { useEffect, useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CardDashboard from "./CardDashboard";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false); // State for modal visibility

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleConfirmLogout = () => {
    logout();
    handleCloseModal();
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
    setUser(JSON.parse(localStorage.getItem("User")) || {});
  }, [navigate]);

  const handleBasicInfo = () => {
    navigate("/my-basic-info");
  };

  const handleMyMenu = () => {
    navigate("/my-menu");
  };

  const handleMaintenance = () => {
    navigate("/maintenance");
  };

  console.log(user.fullName);

  return (
    <>
      <div className="register FORM" style={{ flexDirection: "column" }}>
        <h1>Welcome, {user.fullName}</h1>

        <div style={{ flexDirection: "row", display: "flex", gap: "20px" }}>
          <span onClick={handleBasicInfo}>
            <CardDashboard name={"Basic Information"} />
          </span>
          <span onClick={handleMyMenu}>
            <CardDashboard name={"My Menu"} />
          </span>
          <span onClick={handleMaintenance}>
            <CardDashboard name={"Maintenance"} />
          </span>
        </div>
      </div>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        style={{
          fontSize: "20px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "red",
        }}
        color="secondary"
      >
        Logout
      </Button>

      {/* Confirmation Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="logout-confirmation-title"
            variant="h6"
            component="h2"
          >
            Confirm Logout
          </Typography>
          <Typography id="logout-confirmation-description" sx={{ mt: 2 }}>
            Are you sure you want to log out? This action will end your current
            session.
          </Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: "red",
            }}
            onClick={handleConfirmLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
}
