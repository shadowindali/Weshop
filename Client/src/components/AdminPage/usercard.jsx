import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function usercard(props) {
  const [adminbutton, setadminbutton] = useState(true);
  const [adminuser, setadminuser] = useState(false);
  const [superadminbutton, setsuperadminbutton] = useState(false);

  const Token = JSON.parse(localStorage.getItem("userData"));

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  useEffect(() => {
    if (props.role === "admin") {
      setadminbutton(false);
      setadminuser(true);
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/getUser`, config)
      .then(({ data }) => {
        if (data.data.users.role === "superadmin") {
          setsuperadminbutton(true);
          setadminbutton(false);
        }
      });
  }, []);

  const makeadmin = async () => {
    Swal.fire({
      title: `Do you want to make ${props.name} admin?`,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/user/makeadmin/${props.id}`,
            {},
            config
          );
          await Swal.fire("Saved!", "", "success");
          location.reload();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Wrong Happened!",
          });
        }
      }
    });
  };

  const makeuser = async () => {
    Swal.fire({
      title: `Do you want to make ${props.name} user?`,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/user/makeuser/${props.id}`,
            {},
            config
          );
          await Swal.fire("Saved!", "", "success");
          location.reload();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Wrong Happened!",
          });
        }
      }
    });
  };

  const deleteaccount = async () => {
    Swal.fire({
      title: `Do you want to delete ${props.name} account?`,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/user/deleteaccount/${
              props.id
            }`,
            {},
            config
          );
          await Swal.fire("Deleted!", "", "success");
          location.reload();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Wrong Happened!",
          });
        }
      }
    });
  };

  return (
    <div className="user-card">
      <p style={{ display: "flex", justifyContent: "center" }}>{props.name}</p>
      <p style={{ display: "flex", justifyContent: "center" }}>{props.email}</p>
      <p style={{ color: "green", display: "flex", justifyContent: "center" }}>
        {props.role}
      </p>

      {superadminbutton ? (
        <Button onClick={deleteaccount} style={{ color: "red" }}>
          Delete User
        </Button>
      ) : (
        ""
      )}
      {superadminbutton ? (
        !adminuser ? (
          <Button onClick={makeadmin}>Makeadmin</Button>
        ) : (
          <Button onClick={makeuser}>Makeuser</Button>
        )
      ) : (
        ""
      )}

      {adminbutton ? (
        <Button onClick={deleteaccount} style={{ color: "red" }}>
          Delete User
        </Button>
      ) : (
        ""
      )}

      {adminbutton ? <Button onClick={makeadmin}>Make Admin</Button> : ""}
    </div>
  );
}

export default usercard;
