import { useState, useEffect } from "react";

import "./App.css";
import Container from "../components/Container";
import Register from "../components/Register";
import { createTheme, ThemeProvider } from "@mui/material";
import Login from "../components/Login";
import { Route, Routes } from "react-router-dom";
import BasicInfo from "../components/BasicInfo";
import MenuRest from "../components/MenuRest";
import Maintenance from "../components/Maintenance";
import Dashboard from "../components/Dashboard";
import MyMenu from "../components/MyMenu";
import MyBasicInfo from "../components/MyBasicInfo";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2b32b2",
    },
    secondary: {
      main: "#1488cc",
    },
  },
  typography: {
    fontFamily: ["JosefinSans", "Arial", "sans-serif"],
    h1: {
      fontSize: "36px",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/basic-information" element={<BasicInfo />} />
          <Route path="/menu-restaurant" element={<MenuRest />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/my-basic-info" element={<MyBasicInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-menu" element={<MyMenu />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
