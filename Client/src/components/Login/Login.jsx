import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function login() {
  const [signup, setsignup] = useState(false);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Fill Data From Form
  const filldata = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // Sign up, Login Switch
  const toggleView = () => {
    setsignup(!signup);
    seterror("");
  };

  // Configuration To Send With Request To Know Data Type
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Navigator To Next Page
  const navigator = useNavigate();

  // Login Function
  const loginhandler = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        data,
        config
      );
      localStorage.setItem("userData", JSON.stringify(response.data.token));
      localStorage.setItem(
        "userID",
        JSON.stringify(response.data.data.user._id)
      );
      setloading(false);
      navigator("/");
    } catch (err) {
      seterror(err.response.data.message);
      setloading(false);
    }
  };

  // Signup Function
  const signuphandler = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        data,
        config
      );
      localStorage.setItem("userData", JSON.stringify(response.data.token));
      localStorage.setItem(
        "userID",
        JSON.stringify(response.data.data.user._id)
      );
      setloading(false);
      navigator("/");
    } catch (err) {
      seterror(
        "Something wrong in inputed data check email and password has to be more than 8 digits"
      );
      setloading(false);
    }
  };

  return (
    <div className="login-full-container">
      <div
        className="loading-container"
        style={{ display: loading ? "block" : "none" }}
      >
        <div
          className="loading"
          style={{ display: loading ? "block" : "none" }}
        >
          <span>Loading</span>
        </div>
      </div>

      <div className="login-container">
        <div className="login" style={{ display: signup ? "none" : "flex" }}>
          <h1>Login</h1>
          <TextField
            onChange={filldata}
            label="Enter email"
            variant="outlined"
            name="email"
          />
          <TextField
            onChange={filldata}
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
          />
          <p className="error">{error}</p>
          <Button variant="outlined" onClick={loginhandler}>
            Login
          </Button>
        </div>

        <div className="signup" style={{ display: signup ? "flex" : "none" }}>
          <h1>Sign Up</h1>
          <TextField
            onChange={filldata}
            label="Enter Name"
            variant="outlined"
            name="name"
          />
          <TextField
            onChange={filldata}
            label="Enter Email"
            variant="outlined"
            name="email"
          />
          <TextField
            onChange={filldata}
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
          />
          <TextField
            onChange={filldata}
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            name="passwordConfirm"
          />
          <p className="error">{error}</p>
          <Button variant="outlined" onClick={signuphandler}>
            Signup
          </Button>
        </div>
        <div className="show-button">
          <Button
            onClick={toggleView}
            variant="contained"
            color="success"
            size="large"
            endIcon={<PersonAddIcon />}
          >
            {signup ? "Login" : "Sign Up"}
          </Button>
        </div>
      </div>
      <div className="login-image">
        <Button
          onClick={toggleView}
          variant="contained"
          color="success"
          size="large"
          endIcon={<PersonAddIcon />}
        >
          {signup ? "Login" : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}

export default login;
