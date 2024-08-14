import React from "react";
import "./CardDashboard.css";
export default function CardDashboard({ name }) {
  return (
    <div className="notification">
      <div className="notiglow" />
      <div className="notiborderglow" />
      <div className="notititle">
        <div className="notiname">{name}</div>
      </div>
    </div>
  );
}
