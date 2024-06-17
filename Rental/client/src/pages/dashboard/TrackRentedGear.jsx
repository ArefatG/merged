import React, { useState, useEffect } from "react";
import useRentedGear from "../../hooks/useRentedGear";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-daisyui";

const TrackRentedGear = () => {
  const [rentedGear, refetch] = useRentedGear();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState(null);
  const [gearDetails, setGearDetails] = useState(null);
  const token = localStorage.getItem("access-token");
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = rentedGear.map(item => item.userId);
      const uniqueUserIds = [...new Set(userIds)];
      const userPromises = uniqueUserIds.map(userId =>
        axios.get(`http://localhost:6001/users/${userId}`, {
          headers: { authorization: `Bearer ${token}` },
        }).then(res => ({ [userId]: res.data.name }))
      );
      const users = await Promise.all(userPromises);
      const userMap = Object.assign({}, ...users);
      setUserNames(userMap);
    };

    if (rentedGear.length > 0) {
      fetchUserNames();
    }
  }, [rentedGear, token]);

  const handleMarkReturned = async (gear) => {
    const gearIdStr = gear.gearId._id;
    console.log("Gear ID:", gearIdStr);
    try {
      await axios.patch(`http://localhost:6001/gears/return/${gearIdStr}`, {}, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      refetch();
      Swal.fire("Success!", "Gear marked as returned.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to mark gear as returned.", "error");
    }
  };

  const handleMarkCollected = async (gearId) => {
    try {
      await axios.patch(`http://localhost:6001/gears/collect/${gearId}`, {}, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      refetch();
      Swal.fire("Success!", "Gear marked as collected.", "success");
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to mark gear as collected.", "error");
    }
  };

  const fetchGearDetails = async (gearId) => {
    try {
      const response = await axios.get(`http://localhost:6001/gears/${gearId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setGearDetails(response.data);
    } catch (error) {
      console.error("Error fetching gear details:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:6001/gears/collect`, data, {
        headers: {
          authorization: `Bearer ${token}` },
      });
      const collectedGear = rentedGear.find(item =>
        item.gearItems.some(gear => gear.uniqueCode === data.code)
      )?.gearItems.find(gear => gear.uniqueCode === data.code);

      if (collectedGear) {
        setSelectedGear(collectedGear);
        await fetchGearDetails(collectedGear.gearId._id);
        setModalOpen(true);
      }

      refetch();
      reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to collect item.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Sort the rentedGear array by createdAt in descending order
  const sortedRentedGear = rentedGear.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-full px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">Track Rented Gears</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Gear Name</th>
              <th>Rented By</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRentedGear.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.gearItems.map(gear => gear.name).join(', ')}</td>
                <td>{userNames[item.userId] || 'Loading...'}</td>
                <td>{new Date(item.gearItems[0].startDate).toLocaleDateString()}</td>
                <td>{new Date(item.gearItems[0].endDate).toLocaleDateString()}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
                <td className="space-y-2">
                  {item.gearItems.map(gear => (
                    <button
                      key={gear.gearId}
                      className="btn btn-success btn-sm w-full"
                      onClick={() => handleMarkReturned(gear)}
                      disabled={!item.collected}
                    >
                      Mark Returned
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Collect Item</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Enter 6-Digit Code</span>
            </label>
            <input
              type="text"
              {...register("code", { required: true, minLength: 6, maxLength: 6 })}
              className="input input-bordered w-full"
            />
          </div>
          <button className="btn bg-deepblue text-white w-full" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Collect Item"}
          </button>
        </form>
      </div>

      {selectedGear && gearDetails && (
        <Modal open={modalOpen} onClickBackdrop={() => setModalOpen(false)}>
          <Modal.Header>
            <h3>Gear Details</h3>
          </Modal.Header>
          <Modal.Body>
            <img src={gearDetails.image} alt={gearDetails.name} className="w-full h-64 object-cover mb-4 rounded-md" />
            <p><strong>Name:</strong> {gearDetails.name}</p>
            <p><strong>Price:</strong> ${gearDetails.price}</p>
            <p><strong>Start Date:</strong> {new Date(selectedGear.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedGear.endDate).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {gearDetails.equipment}</p>
            <p><strong>Unique Code:</strong> {selectedGear.uniqueCode}</p>
            <button
              className="btn btn-success mt-4 w-full"
              onClick={() => handleMarkCollected(selectedGear.gearId._id)}
            >
              Mark Collected
            </button>
          </Modal.Body>
          <Modal.Actions>
            <button className="btn btn-secondary w-full" onClick={() => setModalOpen(false)}>Close</button>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  );
};

export default TrackRentedGear;
