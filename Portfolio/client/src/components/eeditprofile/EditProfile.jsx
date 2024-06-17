import React, { useState, useEffect } from 'react';
import upload from '../../utils/upload';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser';
import { useNavigate } from 'react-router-dom';
import './EditProfile.scss';

function EditProfile() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState(''); // Separate state for password
  const [user, setUser] = useState({
    username: '',
    email: '',
    img: '',
    City: '',
    isSeller: false,
    desc: '',
    phone: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setPassword(''); // Clear password field
        } else {
          navigate('/login'); // Redirect to login if user data is not fetched
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Update the password state
  };

  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = file ? await upload(file) : user.img;
    const updatedUser = { ...user, img: url };

    // Include password only if it has been changed
    if (password) {
      updatedUser.password = password;
    }

    try {
      const response = await newRequest.put(`/users/${user._id}`, updatedUser);

      // Update localStorage with the updated user data
      const updatedUserData = response.data;
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

      // Navigate after updating localStorage
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          img: reader.result,
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="edit-profile">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Edit Your Profile</h1>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Your Name"
            value={user.username}
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label>Profile Picture</label>
          {user.img && <img src={user.img} alt="Profile" className="avatar" />}
          <input type="file" onChange={handleFileChange} />
          <label>City</label>
          <input
            name="City"
            type="text"
            placeholder="City"
            value={user.City}
            onChange={handleChange}
          />
        </div>
        <div className="middle-space"></div>
        <div className="right">
          <label>Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="Only +251"
            value={user.phone}
            onChange={handleChange}
          />
          <label>Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            value={user.desc}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="submit-btn">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
