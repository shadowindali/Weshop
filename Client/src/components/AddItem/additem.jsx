import React, { useEffect, useState } from "react";
import Navbar from "./../Nav-footer/Navbar";
import "./additem.css";
import { TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

function additem() {
  const [data, setdata] = useState({});
  const [file, setfile] = useState(null);

  const Token = JSON.parse(localStorage.getItem("userData"));

  const filldata = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  if (!Token) {
    window.location.href = "/";
  }

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  const uploaditem = async () => {
    if (!file) {
      // Handle the case when no file is selected
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select an image!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Append the form data fields to the formData object
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      await axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/items/`,
          formData, // Send the formData object
          config
        )
        .then(() => {
          Swal.fire("Saved!", "", "success");
        });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="additem-full-container">
        <div className="additem-container">
          <TextField
            onChange={filldata}
            label="Enter name"
            variant="outlined"
            name="name"
          />
          <TextField
            onChange={filldata}
            label="Enter price"
            variant="outlined"
            name="price"
          />
          <TextField
            onChange={filldata}
            className="large-inputfield"
            multiline
            label="Enter Description"
            variant="outlined"
            rows={3}
            name="description"
          />
          <TextField
            onChange={filldata}
            label="Enter location"
            variant="outlined"
            name="location"
          />
          <div style={{ display: "flex", gap: 20 }}>
            <p>choose image:</p>
            <input
              className="image-input"
              type="file"
              onChange={(e) => setfile(e.target.files[0])}
            />
          </div>
          <button onClick={uploaditem}>Post</button>
        </div>
      </div>
    </>
  );
}

export default additem;
