import React, { useEffect, useState } from "react";
import "./Youritems.css";
import Navbar from "../Nav-footer/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Itemcard from "../Homepage/Itemcard";

function Youritems() {
  const navigator = useNavigate();
  const [items, setitems] = useState([]);
  const [loaded, setloaded] = useState(false);

  const Token = JSON.parse(localStorage.getItem("userData"));

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
      .get(`${import.meta.env.VITE_API_URL}/api/items/getmine`, config)
      .then(({ data }) => {
        setitems(data.data);
        setloaded(true);
      });
  }, []);
  if (loaded)
    return (
      <div className="your-items-full-container">
        <Navbar />
        <button
          className="additem-button"
          onClick={() => navigator("/additem")}
        >
          +
        </button>

        <div className="items-container">
          {items.map((item) => {
            return <Itemcard key={item._id} item={item} />;
          })}
        </div>
      </div>
    );
}

export default Youritems;
