// SurveyPage.js
import React from "react";
import GoogleSignIn from "../app/GoogleSignIn";
import Survey from "../components/Survey";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { handleLogout } from "../services/AuthService";

function SurveyPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={() => handleLogout()}
      />
      {!isAuthenticated ? <GoogleSignIn /> : <Survey />}
    </div>
  );
}

export default SurveyPage;