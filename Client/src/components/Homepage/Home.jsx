import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Itemcard from "./Itemcard";
import Itemdetails from "../Itemdetail/Itemdetails";
import Navbar from "../Nav-footer/Navbar";

function Home() {
  const [items, setitems] = useState([]);
  const [loaded, setloaded] = useState(false);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/items/`, config)
      .then(({ data }) => {
        setitems(data.data);
        setloaded(true);
      });
  }, []);

  if (loaded) {
    return (
      <>
        <Navbar />
        <div className="home-full-container">
          <div className="items-container">
            {items.map((item) => {
              return <Itemcard key={item._id} item={item} />;
            })}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
