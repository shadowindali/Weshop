import React, { useEffect, useState } from "react";
import Navbar from "../Nav-footer/Navbar";
import "./chatpage.css";
import Chatcard from "./chatcard";
import Messagecontainer from "./messagescontainer";
import axios from "axios";

function chatpage() {
  const [chats, setchats] = useState([]);
  const [chatID, setchatID] = useState("");
  const [messages, setmessages] = useState([]);
  const [loaded, setloaded] = useState(false);
  const [loadpage, setloadpage] = useState(false);
  const [otheruser, setotheruser] = useState({});
  const [otheruser2, setotheruser2] = useState({});
  const [clicked, setclicked] = useState(false);
  let [previousID, setpreviousID] = useState("");

  const Token = JSON.parse(localStorage.getItem("userData"));
  const userID = JSON.parse(localStorage.getItem("userID"));

  if (!Token) {
    window.location.href = "/";
  }

  const getchatid = (data) => {
    setchatID(data);
  };

  const setclick = (data) => {
    setclicked(data);
  };

  const setprev = (data) => {
    setpreviousID(data);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/chat/${userID}`, config)
      .then(({ data }) => {
        const array = data.data;
        if (array.length !== 0) {
          setchats(array);
          setloaded(true);
        }
      });

    if (loaded === true) {
      const user = chats[0].participants;
      const otherone = user.find((id) => {
        return id._id !== userID;
      });
      setotheruser(otherone);
      setloadpage(true);
    }
  }, [loaded]);

  if (loadpage)
    return (
      <>
        <Navbar />
        <div className="chats-full-container">
          <div className="chats-container">
            <div
              className={
                clicked
                  ? "coversations-container mobile-conversation"
                  : "coversations-container"
              }
            >
              {chats.map((chat, index) => {
                return (
                  <Chatcard
                    previousID={previousID}
                    setpreviousID={setprev}
                    key={index}
                    data={chat}
                    setchatid={getchatid}
                    setotheruser={setotheruser2}
                    setclick={setclick}
                    clicked={clicked}
                  />
                );
              })}
            </div>

            <Messagecontainer
              clicked={clicked}
              chatID={chatID}
              otherID={otheruser2}
              messages={messages}
            />
          </div>
        </div>
      </>
    );
  else {
    return (
      <>
        <Navbar />
        <div className="no-chats">
          <h1>NO CHATS</h1>
        </div>
      </>
    );
  }
}

export default chatpage;
