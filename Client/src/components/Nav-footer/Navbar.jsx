import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import "./style.css";
import { useChat } from "../chatContext";

function Navbar() {
  const [loggedin, setloggedin] = useState(false);
  const [userdata, setuserdata] = useState({});
  const [mobileview, setmobileview] = useState(false);
  const [done, setdone] = useState(false);

  const { setrole } = useChat();

  const navigator = useNavigate();

  const Token = JSON.parse(localStorage.getItem("userData"));

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  // Get user data
  useEffect(() => {
    if (Token) {
      setloggedin(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/getUser`, config)
        .then(({ data }) => {
          setrole(data.data.users.role);
          setuserdata(data.data.users);
          setdone(true);
        });
    } else {
      setdone(true);
    }
  }, []);

  if (done) {
    return (
      <>
        {mobileview ? (
          <div className="mobile-view">
            <div
              className="background-mobile"
              onClick={() => setmobileview(false)}
            ></div>
            <ul>
              <li className="nav-item-mobile">
                <Link to="/">Home</Link>
              </li>
              {loggedin ? (
                <ul>
                  <li className="nav-item-mobile">
                    <Link to="/youritems">Your Items</Link>
                  </li>
                  <li className="nav-item-mobile">
                    <Link to="/chats">Chats</Link>
                  </li>{" "}
                </ul>
              ) : (
                ""
              )}
            </ul>
          </div>
        ) : (
          ""
        )}

        <nav className="navbar">
          <div className="logo" onClick={() => navigator("/")}>
            WeShop
          </div>
          <li style={{ listStyle: "none" }} className="nav-item">
            <Link to="/">Home</Link>
          </li>
          {loggedin ? (
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/youritems">Your Items</Link>
              </li>
              <li className="nav-item">
                <Link to="/chats">Chats</Link>
              </li>
            </ul>
          ) : (
            ""
          )}
          <button
            className="menu-button-nav"
            onClick={() => setmobileview(true)}
          >
            <MenuIcon />
          </button>

          {!loggedin ? (
            <button onClick={() => navigator("/login")}>Login/SignUp</button>
          ) : (
            <div className="profile-page" onClick={() => navigator("/profile")}>
              <img
                // className="profile-image"
                src={`${import.meta.env.VITE_API_URL}/images/${
                  userdata.photo
                } `}
              />
              <p className="user-name-nav">{userdata.name}</p>
            </div>
          )}
        </nav>
      </>
    );
  }
}

export default Navbar;
