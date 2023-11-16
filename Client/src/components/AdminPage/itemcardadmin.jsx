import React from "react";
import "./adminpage.css";
import Swal from "sweetalert2";
import axios from "axios";

function itemcardadmin(props) {
  const makeavailable = () => {
    Swal.fire({
      title: "Do you want to make it available?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/items/setavailable/${
              props.item._id
            }`,
            {},
            props.config
          );
          Swal.fire("Saved!", "", "success");
          location.reload();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error Happened!",
          });
        }
      }
    });
  };

  const deleteit = () => {
    Swal.fire({
      title: "Do you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/items/${props.item._id}`,
            props.config
          );
          Swal.fire("Deleted!", "", "success");
          location.reload();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error Happened!",
          });
        }
      }
    });
  };

  return (
    <div className="item-card-admin">
      <img
        src={`${import.meta.env.VITE_API_URL}/images/${props.item.picture} `}
      />
      <p>
        <span>price:</span> {props.item.price}USD
      </p>
      <p>
        <span>name:</span> {props.item.name}
      </p>
      <p>
        <span>loction:</span> {props.item.location}
      </p>
      <div className="two-buttons">
        <button onClick={makeavailable} style={{ background: "green" }}>
          Make available
        </button>
        <button onClick={deleteit} style={{ background: "red" }}>
          delete
        </button>
      </div>
    </div>
  );
}

export default itemcardadmin;
