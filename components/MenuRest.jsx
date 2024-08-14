import React, { useState, useEffect } from "react";
import MenuCard from "./MainMenuCard";
import "./MenuCard.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MainMenuCard from "./MainMenuCard";
export default function MenuRest() {
  // Initialize with placeholder data structure
  const [menuData, setMenuData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch data from your API
    fetch("http://localhost:3000/api/menu") // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Menu data:", data.data.menu); // Adjust based on actual API response
          setMenuData(data.data.menu); // Update with actual data structure
        } else {
          console.error("Failed to fetch menu data");
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="App">
      <h1>Menu</h1>
      <div className="menu-container">
        {menuData.length > 0 ? (
          menuData.map((item) => (
            <MainMenuCard key={item._id} menuItem={item} />
          ))
        ) : (
          <p>No menu items available</p>
        )}
      </div>

      <Button
        variant="contained"
        className="main-btn"
        type="submit"
        onClick={() => {
          navigate("/maintenance", { replace: true });
        }}
      >
        Submit
      </Button>
    </div>
  );
}
