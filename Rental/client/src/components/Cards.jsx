import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import useReserve from "../hooks/useReserve";
import axios from "axios";

const Cards = ({ item }) => {
  const { name, image, price, _id, owner } = item;
  const { user } = useContext(AuthContext);
  const [reserve, refetch] = useReserve();
  const navigate = useNavigate();
  const location = useLocation();

  const [isApproved, setIsApproved] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gearDetails, setGearDetails] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);

  useEffect(() => {
    let interval;
    const fetchUserData = () => {
      if (user) {
        axios
          .get(`http://localhost:6001/users/email/${user.email}`)
          .then((response) => {
            if (response.data.length > 0) {
              setIsApproved(response.data[0].isApproved);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    };

    fetchUserData();

    interval = setInterval(fetchUserData, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleAddToReserve = (item) => {
    if (user && user.email) {
      if (isApproved === false) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Your account is not verified. Please wait for approval.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      const reserveItem = {
        gearsItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      axios
        .post("http://localhost:6001/reserves", reserveItem)
        .then((response) => {
          if (response) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Gear added to reserve list.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to Reserve Gears",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    axios
      .get(`http://localhost:6001/gears/${_id}`)
      .then((response) => {
        setGearDetails(response.data);
        return axios.get(`http://localhost:6001/users/email/${response.data.owner}`);
      })
      .then((response) => {
        setOwnerDetails(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching gear or owner details:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGearDetails(null);
    setOwnerDetails(null); // Reset owner details
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  };

  return (
    <div className="card shadow-xl relative mr-5 md:my-5">
      <div onClick={openModal} className="card-image-wrapper">
        <figure>
          <img
            src={image}
            alt="Gear"
            className="hover:scale-105 transition-all duration-300 md:h-72"
          />
        </figure>
      </div>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$</span> {price}
          </h5>
          <button
            onClick={() => handleAddToReserve(item)}
            className="btn bg-deepblue text-white"
          >
            Reserve
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open" onClick={handleModalClick}>
          <div className="modal-box relative">
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            {gearDetails ? (
              <div>
                <h3 className="text-lg font-bold">{gearDetails.name}</h3>
                <img
                  src={gearDetails.image}
                  alt="Gear"
                  className="w-full h-auto mt-4"
                />
                <p className="py-4">Price: ${gearDetails.price}</p>
                <p>Description: {gearDetails.equipment}</p>
                {ownerDetails ? (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Owner Details</h4>
                    <p>Address: {ownerDetails.address}</p>
                    <p>Phone Number: {ownerDetails.phoneNumber}</p>
                  </div>
                ) : (
                  <p>Loading owner details...</p>
                )}
                <button
                  onClick={() => handleAddToReserve(gearDetails)}
                  className="btn bg-deepblue text-white mt-4"
                >
                  Add to Reserve
                </button>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
