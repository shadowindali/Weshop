import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Homepage/Home";
import Profile from "./components/Profile/Profile";
import Adminpage from "./components/AdminPage/adminpage";
import Itemdetails from "./components/Itemdetail/Itemdetails";
import Additem from "./components/AddItem/additem";
import Youritems from "./components/Youritems/Youritems";
import Chatpage from "./components/Chatpage/chatpage";

function App() {
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Prevent the default right-click menu
  });

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Adminpage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<Chatpage />} />
      <Route path="/item/:itemId" element={<Itemdetails />} />
      <Route path="/additem" element={<Additem />} />
      <Route path="/youritems" element={<Youritems />} />
    </Routes>
  );
}

export default App;
