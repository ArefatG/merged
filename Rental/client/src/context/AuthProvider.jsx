import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext();
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const uploadLicense = async (file) => {
    const storageRef = ref(storage, `licenses/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const createUser = async (name, email, password, licenseFile, address, phoneNumber) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const licenseUrl = await uploadLicense(licenseFile); // Upload license
      await sendEmailVerification(auth.currentUser);
      console.log("Verification email sent to " + user.email);

      await axios.post("http://localhost:6001/users", {
        name: name,
        email: user.email,
        photoURL: user.photoURL,
        license: licenseUrl,
        address: address,
        phoneNumber: phoneNumber,
        isApproved: false,
      });
    } catch (error) {
      console.error("Error creating user: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGmail = async (licenseFile, address, phoneNumber) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const licenseUrl = await uploadLicense(licenseFile);

      await axios.post("http://localhost:6001/users", {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        license: licenseUrl,
        address: address,
        phoneNumber: phoneNumber,
        isApproved: false,
      });
    } catch (error) {
      console.error("Error signing up with Google: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGmail = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      const user = result.user;
      if (!user.emailVerified) {
        localStorage.removeItem("genius-token");
        return signOut(auth).then(() => {
          throw new Error("Email not verified");
        });
      }
      return result;
    });
  };

  const logOut = () => {
    localStorage.removeItem("genius-token");
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        return Promise.resolve();
      })
      .catch((error) => {
        setLoading(false);
        return Promise.reject(error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        axios
          .post("http://localhost:6001/jwt", userInfo)
          .then((response) => {
            if (response.data.token) {
              localStorage.setItem("access-token", response.data.token);
            }
          })
          .catch((error) => {
            console.error("Error updating profile: ", error);
          });
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    login,
    logOut,
    signUpWithGmail,
    updateUserProfile,
    resetPassword,
    signInWithGmail,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
