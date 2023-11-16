import React, { useEffect, useState } from "react";
import Navbar from "../Nav-footer/Navbar";
import "./Itemdetails.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useChat } from "../chatContext";

function Itemdetails() {
  const [itemsdata, setdata] = useState({});
  const [mine, setmine] = useState(false);
  const [loaded, setloaded] = useState(false);

  const { role } = useChat();

  const { itemId } = useParams();

  const navigator = useNavigate();

  const Token = JSON.parse(localStorage.getItem("userData"));

  const userID = JSON.parse(localStorage.getItem("userID"));

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/items/${itemId}`, config)
      .then(({ data }) => {
        setdata(data.data);
        setloaded(true);
      });
    if (loaded) {
      if (userID === itemsdata.user._id) {
        setmine(true);
      }
    }
  }, [loaded]);

  const deleteitem = () => {
    Swal.fire({
      title: `Do you want to delete this item?`,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/items/${itemsdata._id}`,
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          );
          await Swal.fire("Deleted!", "", "success");
          navigator("/");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something Wrong Happened!",
          });
        }
      }
    });
  };

  const createconversation = async () => {
    try {
      const reponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/`,
        { userId: itemsdata.user._id },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (reponse.data.message === "Done") {
        navigator("/chats");
      } else {
        await Swal.fire("Created chat!", "", "success");
        navigator("/chats");
      }
    } catch (err) {
      navigator("/login");
    }
  };

  // Convert createdAt to a Date object
  const createdAtDate = new Date(itemsdata.createdAt);

  // Get day and month
  const day = createdAtDate.getDate();
  const month = createdAtDate.toLocaleString("default", { month: "short" });

  if (loaded)
    return (
      <>
        <Navbar />
        <div className="item-details-container">
          <div className="item-details">
            <div className="left-part">
              <Carousel
                showThumbs={false}
                showStatus={false}
                dynamicHeight={true}
              >
                <div>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/images/${
                      itemsdata.picture
                    }`}
                    alt="Image 1"
                  />
                </div>
                {/* <div>
                  <img src="img-2.jpg" alt="Image 2" />
                </div>
                <div>
                  <img src="img-3.jpg" alt="Image 3" />
                </div> */}
              </Carousel>
              <div className="price-name-location-date">
                {mine || role === "superadmin" ? (
                  <button onClick={deleteitem} className="delete-item-button">
                    Delete item
                  </button>
                ) : (
                  ""
                )}
                <h1 style={{ color: "red" }}>{itemsdata.price} USD</h1>
                <h2>{itemsdata.name}</h2>
                <div className="loc-date-details">
                  <p>
                    <LocationOnIcon />
                    {itemsdata.location}
                  </p>
                  <p>{`${day} ${month}`}</p>
                </div>
              </div>
            </div>
            <div className="right-part">
              <div className="description">
                <h1>Description:</h1>
                <p>{itemsdata.description}</p>
              </div>
              <div className="owner">
                <div className="owner-details">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/images/${
                      itemsdata.user.photo
                    }`}
                  />
                  <p>{itemsdata.user.name}</p>
                </div>
                {mine ? (
                  ""
                ) : (
                  <button onClick={createconversation}>
                    Chat <SendIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  else {
    return (
      <div className="loading-container">
        <div className="loading">
          <span>Loading</span>
        </div>
      </div>
    );
  }
}

export default Itemdetails;

// const scrollToBottom = () => {
//   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// };
