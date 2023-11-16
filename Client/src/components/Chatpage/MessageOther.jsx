import React from "react";

function MessageOther(props) {
  // Assuming props.createdAt is a valid timestamp string (e.g., "2023-10-25T14:30:00.000Z")
  const createdAt = new Date(props.props.createdAt);
  const hour = createdAt.getHours();
  const minute = createdAt.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = (hour % 12) || 12; // Convert 0 to 12 for 12:xx AM/PM
  const formattedTime = `${formattedHour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;

  return (
    <div className="other-message-container">
      <div className="conversation-container">
        <div className="other-text-content">
          <p className="con-lastMessage">{props.props.content}</p>
          <p className="self-timestamp">{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageOther;
