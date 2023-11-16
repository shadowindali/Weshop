import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Itemcard(props) {
  const navigator = useNavigate();

  // Convert createdAt to a Date object
  const createdAtDate = new Date(props.item.createdAt);
  // Get day and month
  const day = createdAtDate.getDate();
  const month = createdAtDate.toLocaleString("default", { month: "short" });

  return (
    <div
      className="card-container"
      onClick={() => navigator(`/item/${props.item._id}`)}
    >
      <div className="hidden-div">
        <p>Show details</p>
      </div>
      <img
        src={`${import.meta.env.VITE_API_URL}/images/${props.item.picture} `}
      />
      <div className="item-details-home">
        <p className="item-price">{props.item.price} USD</p>
        <p className="item-name"> {props.item.name}</p>
        <div className="loc-date">
          <p className="item-location"> {props.item.location}</p>
          <p className="item-Date"> {`${day} ${month}`}</p>
        </div>
      </div>
    </div>
  );
}

export default Itemcard;
