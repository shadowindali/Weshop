import React, { useEffect, useState } from "react";
import "./adminpage.css";
import Usercard from "./usercard";
import Itemcardadmin from "./itemcardadmin";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function adminpage() {
  const [users, setUsers] = useState([]);
  const [items, setitems] = useState([]);
  const [switcher, setswitcher] = useState(false);
  const [loading, setLoading] = useState(true); // Introduce a loading state

  const Token = JSON.parse(localStorage.getItem("userData"));

  // Navigator To Next Page
  const navigator = useNavigate();

  // return to login if not logged in
  if (!Token) {
    window.location.href = "/";
  }

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/getAllUsers`, config)
      .then(({ data }) => {
        const filteredUsers = data.data.users.filter(
          (user) => user.role !== "superadmin"
        );
        setUsers(filteredUsers);
        setLoading(false); // Data is loaded, set loading to false
      });

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/items/unavailable`, config)
      .then(({ data }) => {
        // console.log(data.data);
        setitems(data.data);
      });
  }, []);

  if (!loading) {
    return (
      <div className="admin-page-full-container">
        <div className="admin-page-container">
          <div className="admin-page-head">
            <h1>Admin</h1>
            <button
              onClick={() => setswitcher(true)}
              style={{ background: "green" }}
              className="back-button"
            >
              Users
            </button>
            <button
              onClick={() => setswitcher(false)}
              style={{ background: "blue" }}
              className="back-button"
            >
              Items
            </button>
            <button
              className="back-button"
              onClick={() => navigator("/profile")}
            >
              Back
            </button>
          </div>
          <div
            className="users-container"
            style={switcher ? { display: "flex" } : { display: "none" }}
          >
            {users.map((user) => (
              <Usercard
                key={user._id} // Add a unique key prop when mapping over an array
                name={user.name}
                email={user.email}
                role={user.role}
                id={user._id}
                config={config}
              />
            ))}
          </div>
          <div
            className="items-container-admin"
            style={switcher ? { display: "none" } : { display: "flex" }}
          >
            {items.map((item) => (
              <Itemcardadmin item={item} config={config} />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="admin-page-full-container">
        <div className="admin-page-container">
          <div className="admin-page-head">
            <h1>Administrator Page</h1>
          </div>
          <div></div>
          <div className="not-admin">
            <h1>Your not an admin</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default adminpage;
