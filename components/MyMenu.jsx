import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuCard from "./MainMenuCard";
import "./MenuCard.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MyMenuCard from "./MyMenuCard";

export default function MyMenu() {
  const [menuData, setMenuData] = useState([]);
  const navigate = useNavigate();
  const [user_ID, setuserID] = useState(localStorage.getItem("user_ID") || ""); // Set default user ID for testing

  useEffect(() => {
    setuserID(localStorage.getItem("user_ID")); // Get restaurant ID from local storage
    // Fetch data from your API
    axios
      .get(`http://localhost:3000/api/myMenu/${user_ID}`)
      .then((response) => {
        const { data } = response;
        if (data.status === "success") {
          console.log("Menu data:", data.data); // Adjust based on actual API response
          setMenuData(data.data); // Update with actual data structure
        } else {
          console.error("Failed to fetch menu data");
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []); // Include rest_ID in the dependency array if it changes

  return (
    <div className="App">
      <h1>My Menu</h1>
      <div className="menu-container">
        {menuData.length > 0 ? (
          menuData.map((item) => <MyMenuCard key={item._id} menuItem={item} />)
        ) : (
          <p>No menu items available</p>
        )}
      </div>
      <Button
        variant="contained"
        className="main-btn"
        type="submit"
        onClick={() => {
          navigate("/dashboard", { replace: true });
        }}
      >
        Dashboard
      </Button>
    </div>
  );
}
