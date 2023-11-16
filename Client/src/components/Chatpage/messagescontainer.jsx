import React, { useEffect, useRef, useState } from "react";
import Messageself from "./Messageself";
import MessageOther from "./MessageOther";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import Swal from "sweetalert2";
import useSocket from "../../utils/useSocket";
import { useChat } from "../chatContext";

function messagescontainer(props) {
  const [newmessage, setnewmessage] = useState("");
  const { chatMessages, setChatMessages } = useChat();

  const Token = JSON.parse(localStorage.getItem("userData"));
  const userID = JSON.parse(localStorage.getItem("userID"));

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const filldata = (e) => {
    setnewmessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default Enter key behavior (usually line break)
      sendMessage();
    }
  };

  const { emitEvent } = useSocket();

  const config = {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/message/${props.chatID}`,
        config
      )
      .then(({ data }) => {
        setChatMessages(data.message);
      });
  }, [props.chatID]);

  const sendMessage = async () => {
    try {
      const message = {
        content: newmessage,
        sender: userID,
        chat: props.chatID,
      };
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/message/`,
        message,
        config
      );
      setnewmessage("");
      const msg = resp.data.message;
      setChatMessages([...chatMessages, msg]);
      emitEvent("send message", { room: props.chatID, message: msg });
      inputRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  const deletechat = () => {
    Swal.fire({
      title: "Do you want to delete this chat?",
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
              await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/chat/onechat/${
                  props.chatID
                }`,
                config
              );
              Swal.fire("Chat Deleted!", "", "success");
              location.reload();
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something wrong happened.",
              });
            }
          }
        });
      }
    });
  };

  if (props.chatID)
    return (
      <>
        <div className="messages-container">
          <div className="message-user-info">
            <img
              src={`${import.meta.env.VITE_API_URL}/images/${
                props.otherID.photo
              } `}
            />
            <p> {props.otherID.name}</p>
            <button onClick={deletechat}>DELETE</button>
          </div>

          <div className="messages-user-container">
            {chatMessages.map((message, index) => {
              const sender = message.sender;
              if (sender === userID) {
                return <Messageself props={message} key={index} />;
              } else {
                return <MessageOther props={message} key={index} />;
              }
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="messages-input">
            <input
              placeholder="Type a message"
              ref={inputRef}
              onChange={filldata}
              onKeyPress={handleKeyPress}
            />
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </>
    );
}

export default messagescontainer;
