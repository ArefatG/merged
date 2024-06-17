import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.config";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [errorMessage, setErrorMessage] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const watchPassword = watch("password", "");
  const passwordStrength = zxcvbn(watchPassword);

  const onSubmit = async (data) => {
    setUploading(true);
    setSigningUp(true);
    try {
      const { name, email, password, address, phoneNumber } = data;

      const emailExists = await axiosPublic.get(`/users/email/${email}`);
      if (emailExists.data.length > 0) {
        Swal.fire({
          title: "User already exists",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Login!",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login", { state: { from: location } });
          }
        });
        setErrorMessage("Email already exists. Please use a different email.");
        setUploading(false);
        setSigningUp(false);
        return;
      }

      if (passwordStrength.score < 3) {
        setErrorMessage("Password is too weak. Please choose a stronger password.");
        setUploading(false);
        setSigningUp(false);
        return;
      }

      await createUser(name, email, password, licenseFile, address, phoneNumber);
      await updateUserProfile(name, null);

      if (licenseFile) {
        const storageRef = ref(storage, `licenses/${licenseFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, licenseFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error("File upload error:", error);
            setErrorMessage("An error occurred during file upload. Please try again.");
            setUploading(false);
            setSigningUp(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              const newUser = { name, email, license: downloadURL, address, phoneNumber };

              await axiosPublic.post("/users", newUser);
              setUploading(false);
              setSigningUp(false);
              Swal.fire({
                title: "Sign up successful!",
                text: "Please check your email for verification.",
                icon: "success",
              });
              navigate("/login");
            });
          }
        );
      } else {
        setErrorMessage("Please upload a license file.");
        setUploading(false);
        setSigningUp(false);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("An error occurred. Please try again.");
      setUploading(false);
      setSigningUp(false);
    }
  };

  const handleRegister = () => {
    const address = watch("address");
    const phoneNumber = watch("phoneNumber");

    if (!address || !phoneNumber || !licenseFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill out all required fields and upload a license file before signing in with Google.",
      });
      return;
    }

    setSigningUp(true);
    signUpWithGmail(licenseFile, address, phoneNumber)
      .then(() => {
        Swal.fire({
          title: "Signin successful!",
          icon: "success",
        });
        navigate(from, { replace: true });
        setSigningUp(false);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setErrorMessage("An error occurred. Please try again.");
        setSigningUp(false);
      });
  };

  const handleLicenseFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setLicenseFile(file);
    } else {
      setLicenseFile(null);
      Swal.fire({
        icon: "warning",
        title: "Invalid file type",
        text: "Please upload a PDF file.",
      });
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Please Create An Account!</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Name <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              {...register("name", { required: true, minLength: 4 })}
            />
            {errors.name && (
              <span className="text-red-500">
                Name must be at least 4 characters long.
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Email <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Password <span className="text-red-500">*</span>
              </span>
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500">Password is required.</span>
            )}
            <div className="mt-2">
              <div
                className={`h-2 rounded ${getPasswordStrengthColor(
                  passwordStrength.score
                )}`}
              />
              <p className="text-sm text-gray-600 mt-2">
                {passwordStrength.feedback.suggestions.join(" ")}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Address <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Your address"
              className="input input-bordered"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <span className="text-red-500">{errors.address.message}</span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Phone Number <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Your phone number"
              className="input input-bordered"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Phone number must be 10-15 digits",
                },
              })}
            />
            {errors.phoneNumber && (
              <span className="text-red-500">{errors.phoneNumber.message}</span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Add Your License PDF <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={handleLicenseFileChange}
              required
            />
            {!licenseFile && (
              <span className="text-red-500">License file is required.</span>
            )}
          </div>
          <p className="text-red-500">{errorMessage}</p>
          <div className="form-control mt-6">
            <input
              type="submit"
              className="btn bg-deepblue text-white"
              value={
                uploading
                  ? "Uploading license..."
                  : signingUp
                  ? "Creating account..."
                  : "Sign up"
              }
              disabled={uploading || signingUp}
            />
          </div>
          <div className="text-center my-2">
            Have an account?
            <Link to="/login">
              <button className="ml-2 underline">Login here</button>
            </Link>
          </div>
        </form>
        <div className="text-center space-x-3">
          <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-deepblue hover:text-white"
            disabled={uploading || signingUp}
          >
            <FaGoogle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
