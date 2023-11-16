import React, { useEffect, useState, useRef } from "react";
import "./Profile.css";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Profile() {
  const [userdata, setuserdata] = useState({});
  const [passworddata, setpassworddata] = useState({});
  const [userupdateddata, setuserupdateddata] = useState({});
  const [admin, setadmin] = useState(false);

  // loading icon
  const [loading, setloading] = useState(false);

  // load screen when loaded
  const [loadeddata, setloadeddata] = useState(false);

  // Get Token
  const Token = JSON.parse(localStorage.getItem("userData"));

  // return to login if not logged in
  if (!Token) {
    window.location.href = "/";
  }

  // Navigator To Next Page
  const navigator = useNavigate();

  // Show Password Icon
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  //Fill Data
  const filldata = (e) => {
    setuserupdateddata({ ...userupdateddata, [e.target.name]: e.target.value });
  };

  //Fill Password Data
  const fillpassworddata = (e) => {
    setpassworddata({ ...passworddata, [e.target.name]: e.target.value });
  };

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  // Get user data
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/getUser`, config)
      .then(({ data }) => {
        setuserdata(data.data.users);
        if (
          data.data.users.role === "admin" ||
          data.data.users.role === "superadmin"
        ) {
          setadmin(true);
        }
        setloadeddata(true);
      });
  }, []);

  // Upload Image
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/user/uploadimage`,
          formData,
          config
        );
        location.reload();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email is used!",
        });
      }
    } else {
      ``;
      alert("Please select a file before uploading.");
    }
  };

  const handleFileChange = async () => {
    const selectedFile = fileInputRef.current.files[0];
    handleUpload(selectedFile);
  };

  // delete image
  const deleteimage = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/deletimage`,
        {},
        config
      );
      location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something wrong happened!",
      });
    }
  };

  // update data
  const updatedata = async () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setloading(true);
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/user/updateMe`,
            userupdateddata,
            config
          );
          setloading(false);
          Swal.fire("Saved!", "", "success");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email is used!",
          });
          setloading(false);
        }
      }
    });
  };

  const updatepassword = async () => {
    Swal.fire({
      title: "Do you want to change the password?",
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setloading(true);
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/user/changepassword`,
            passworddata,
            config
          );
          setloading(false);
          Swal.fire("Saved!", "", "success");
          localStorage.removeItem("userData");
          navigator("/");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Check current user & New passwords if they are the same(8 digits).",
          });
          setloading(false);
        }
      }
    });
  };

  const deleteMe = () => {
    Swal.fire({
      title: "Do you want to delete your account?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Are you sure?",
          showCancelButton: true,
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setloading(true);
              await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/user/deleteMe`,
                {},
                config
              );
              setloading(false);
              Swal.fire("Account Deleted!", "", "success");
              localStorage.removeItem("userData");
              navigator("/");
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something wrong happened.",
              });
              setloading(false);
            }
          }
        });
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userID");
    navigator("/");
    location.reload();
  };

  //load
  if (loadeddata) {
    return (
      <div className="profile-full-container">
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

        <div className="profile-container">
          <div className="profile-head">
            <h1>Profile</h1>
            <div className="buttons">
              {admin ? (
                <button
                  style={{ background: "green" }}
                  onClick={() => navigator("/admin")}
                >
                  Admin
                </button>
              ) : (
                ""
              )}
              <button onClick={logout}>Logout</button>
              <button onClick={() => navigator("/")}>Back</button>
            </div>
          </div>
          <div className="profile-data-container">
            <div className="profile-image-container">
              <img
                className="profile-image"
                src={`${import.meta.env.VITE_API_URL}/images/${
                  userdata.photo
                } `}
              />

              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  style={{ color: "blue" }}
                  className="image-upload-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose Image
                </button>
              </div>

              <button className="image-upload-button" onClick={deleteimage}>
                Delete Image
              </button>
            </div>

            <div className="user-data-container">
              <TextField
                className="small-inputfield"
                label="Name"
                variant="outlined"
                name="name"
                defaultValue={userdata.name}
                onChange={filldata}
              />
              <TextField
                className="small-inputfield"
                label="Age"
                variant="outlined"
                name="age"
                defaultValue={userdata.age}
                onChange={filldata}
              />
              <TextField
                className="small-inputfield"
                label="Phone Number"
                variant="outlined"
                name="phonenumber"
                defaultValue={userdata.phonenumber}
                onChange={filldata}
              />
              <TextField
                className="large-inputfield"
                label="Email"
                variant="outlined"
                name="email"
                defaultValue={userdata.email}
                onChange={filldata}
              />
              <TextField
                className="large-inputfield"
                id="outlined-multiline-static"
                multiline
                label="About us"
                variant="outlined"
                rows={3}
                name="aboutus"
                defaultValue={userdata.aboutus}
                onChange={filldata}
              />
              <button onClick={updatedata} className="save-button">
                Save Changes
              </button>

              <div className="user-changepass-container">
                <FormControl className="small-inputfield" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Current Password
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Current Password"
                    name="currentpassword"
                    onChange={fillpassworddata}
                  />
                </FormControl>
                <FormControl className="small-inputfield" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    name="password"
                    onChange={fillpassworddata}
                  />
                </FormControl>
                <FormControl className="small-inputfield" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm New Password
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm New Password"
                    name="passwordConfirm"
                    onChange={fillpassworddata}
                  />
                </FormControl>

                <button
                  style={{ background: "red" }}
                  onClick={updatepassword}
                  className="save-button"
                >
                  Change Password
                </button>
                <button
                  onClick={deleteMe}
                  style={{ background: "red" }}
                  className="save-button"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
