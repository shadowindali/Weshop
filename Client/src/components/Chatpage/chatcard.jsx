import React, { useEffect, useState } from "react";
import "./chatpage.css";
import useSocket from "../../utils/useSocket";

function chatcard(props) {

  const userID = JSON.parse(localStorage.getItem("userID"));

  const { emitEvent } = useSocket();

  useEffect(() => {}, []);
  let user = props.data.participants;

  const otherID = user.find((id) => {
    return id._id !== userID;
  });

  return (
    <div
      className="chat-card-container"
      onClick={() => {
        // console.log(props.previousID);
        emitEvent("leave", { room: props.previousID });
        props.setpreviousID(props.data._id);
        emitEvent("join room", { room: props.data._id }); // join room
        props.setchatid(props.data._id);
        props.setotheruser(otherID);
        props.setclick(true);
      }}
    >
      <img src={`${import.meta.env.VITE_API_URL}/images/${otherID.photo} `} />
      <p className={props.clicked ? "text-profile" : ""}>{otherID.name}</p>
    </div>
  );
}

export default chatcard;
