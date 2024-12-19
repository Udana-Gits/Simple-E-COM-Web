import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Select Your Role</h1>
      <div style={{ marginTop: "50px" }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "20px 40px",
            fontSize: "20px",
            margin: "20px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Admin
        </button>
        <button
          onClick={() => navigate("/stafflogin")}
          style={{
            padding: "20px 40px",
            fontSize: "20px",
            margin: "20px",
            backgroundColor: "#28A745",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Staff
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
