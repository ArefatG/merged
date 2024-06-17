import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase.config';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Updategears = () => {
    const item = useLoaderData();
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    const onSubmit = async (data) => {
        let imageUrl = item.image;

        if (data.image[0]) {
            const file = data.image[0];
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: "Invalid file type",
                    text: "Please upload an image file.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }

            setUploading(true);
            try {
                const storageRef = ref(storage, `gears/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                imageUrl = await new Promise((resolve, reject) => {
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
            } catch (error) {
                console.error("Error uploading image:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while uploading your image. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const gearsItem = {
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            equipment: data.equipment,
            image: imageUrl
        };

        try {
            const postgearsItem = await axiosSecure.patch(`/gears/${item._id}`, gearsItem);
            if (postgearsItem) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your item updated successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/dashboard/manage-items");
            }
        } catch (error) {
            console.error("Error updating item:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while updating your item. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="w-full md:w-[870px] px-4 mx-auto">
            <h2 className="text-2xl font-semibold my-4">
                Update This <span className="text-deepblue">Gear Item</span>
            </h2>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Equipment Name*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={item.name}
                            {...register("name", { required: true })}
                            placeholder="Equipment Name"
                            className="input input-bordered w-full "
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Category*</span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered"
                                defaultValue={item.category}
                            >
                                <option disabled value="default">
                                    Select a category
                                </option>
                                <option value="camera">Camera</option>
                                <option value="lens">Lens</option>
                                <option value="lighting">Lighting</option>
                                <option value="audio">Audio</option>
                                <option value="combo_kit">Combo Kit</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price*</span>
                            </label>
                            <input
                                type="number"
                                defaultValue={item.price}
                                {...register("price", { required: true })}
                                placeholder="Price"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Equipment Details</span>
                        </label>
                        <textarea
                            defaultValue={item.equipment}
                            {...register("equipment", { required: true })}
                            className="textarea textarea-bordered h-24"
                            placeholder="Tell the world about your equipment"
                        ></textarea>
                    </div>

                    <div className="form-control w-full my-6">
                        <input
                            {...register("image")}
                            type="file"
                            accept="image/*"
                            className="file-input w-full max-w-xs"
                        />
                    </div>

                    <button className="btn bg-deepblue text-white px-6" disabled={uploading}>
                        {uploading ? "Uploading..." : "Update Gear"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Updategears;
