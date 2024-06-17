import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.config";
import { AuthContext } from '../context/AuthProvider';
import useUser from '../hooks/useUser';
import Swal from 'sweetalert2';
import useAxiosPublic from '../hooks/useAxiosPublic';

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [userData, refetch, userId] = useUser();
  const [profileData, setProfileData] = useState({});
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const token = localStorage.getItem('access-token');
        try {
          const response = await axiosPublic.get(`users/${userId}`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          console.log("Fetched user data:", response.data);
          setProfileData(response.data);
          reset(response.data); // Populate form with existing data
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [userId, axiosPublic, reset]);

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    const { name, address, phoneNumber } = data;
    const file = data.photoURL?.[0];
    console.log(file);

    let photoURL = profileData.photoURL;

    if (file !== "h") {
      setUploading(true);
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      photoURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
      setUploading(false);
    }

    // Prepare payload
    const payload = { name, address, phoneNumber };
    if (file !== undefined) {
      payload.photoURL = photoURL;
      console.log(file);
    }

    try {
      // Update user profile only with the provided data
      await updateUserProfile(
        name,
        file !== "h" ? photoURL : profileData.photoURL, 
        address,
        phoneNumber
      );

      if (userId) {
        const token = localStorage.getItem('access-token');
        await axiosPublic.put(
          `users/${userId}`,
          payload,
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );
      }

      Swal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating your profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <div className='h-screen max-w-md mx-auto flex flex-col items-center justify-center mt-20'>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mb-6">
        <div className="card-body items-center text-center">
          <img
            src={profileData.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="card-title">{profileData.name || "Name"}</h2>
          <p className="text-gray-600">{profileData.email || "Email"}</p>
        </div>
      </div>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              defaultValue={profileData.name || ''}
              {...register("name", { required: true })}
              placeholder="Your name"
              className="input input-bordered"
              required
            />
            {errors.name && <span className="text-red-500">Name is required</span>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photoURL")}
              className="file-input w-full mt-1"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              defaultValue={profileData.address || ''}
              {...register("address", { required: true })}
              placeholder="Your address"
              className="input input-bordered"
              required
            />
            {errors.address && <span className="text-red-500">Address is required</span>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="text"
              defaultValue={profileData.phoneNumber || ''}
              {...register("phoneNumber", { 
                required: true, 
                pattern: {
                  value: /^[0-9]{10}$/, 
                  message: "Phone number must be 10 digits" 
                } 
              })}
              placeholder="Your phone number"
              className="input input-bordered"
              required
            />
            {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
          </div>
          <div className="form-control mt-6">
            <input
              type='submit'
              value={uploading ? "Updating..." : "Update"}
              className="btn bg-deepblue text-white"
              disabled={uploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
