import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [additionalInfoTitle, setAdditionalInfoTitle] = useState("");
  const [additionalInfoContent, setAdditionalInfoContent] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e, type) => {
    e.preventDefault();
    dispatch({
      type: `ADD_${type.toUpperCase()}`,
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (portfolios) => {
      return newRequest.post("/portfolios", portfolios);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!state.title) errors.title = "Title is required";
    if (!state.cat) errors.cat = "Category is required";
    if (!state.desc) errors.desc = "Description is required";
    if (!state.address) errors.address = "Address is required";
    if (!state.phone) errors.phone = "Phone number is required";
    if (!state.email) errors.email = "Email is required";
    if (!state.cover) errors.email = "cover image is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormSubmitting(true);
    mutation.mutate({ ...state, additionalInfo }, {
      onSuccess: () => {
        setFormSubmitting(false);
        navigate("/mygigs");
      },
      onError: () => {
        setFormSubmitting(false);
      }
    });
  };

  const handleAddAdditionalInfoTitle = (e) => {
    e.preventDefault();
    setAdditionalInfo((prev) => [
      ...prev,
      { title: additionalInfoTitle, content: [] },
    ]);
    setAdditionalInfoTitle("");
  };

  const handleAddAdditionalInfoContent = (e, index) => {
    e.preventDefault();
    const updatedInfo = [...additionalInfo];
    updatedInfo[index].content.push(additionalInfoContent);
    setAdditionalInfo(updatedInfo);
    setAdditionalInfoContent("");
  };

  const handleRemoveAdditionalInfoContent = (titleIndex, contentIndex) => {
    const updatedInfo = additionalInfo.map((info, index) =>
      index === titleIndex
        ? {
            ...info,
            content: info.content.filter((_, i) => i !== contentIndex),
          }
        : info
    );
    setAdditionalInfo(updatedInfo);
  };

  const handleRemoveAdditionalInfoTitle = (index) => {
    setAdditionalInfo((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Portfolio</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            {formErrors.title && <span className="error">{formErrors.title}</span>}
            
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="design">Design</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
              <option value="photography">Photography</option>
            </select>
            {formErrors.cat && <span className="error">{formErrors.cat}</span>}
            
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              placeholder="Brief descriptions or biography about you"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            {formErrors.desc && <span className="error">{formErrors.desc}</span>}
            
            <label htmlFor="">Address</label>
            <input
              type="text"
              name="address"
              placeholder="e.g. 123 Main St, City, Country"
              onChange={handleChange}
            />
            {formErrors.address && <span className="error">{formErrors.address}</span>}
            
            <label htmlFor="">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +1234567890"
              onChange={handleChange}
            />
            {formErrors.phone && <span className="error">{formErrors.phone}</span>}
            
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. you@example.com"
              onChange={handleChange}
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}

            <button onClick={handleSubmit} disabled={formSubmitting}>
              {formSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
          
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. video editing"
              onChange={handleChange}
            />
            
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>
            
            <label htmlFor="">Add Skills</label>
            <form className="add" onSubmit={(e) => handleFeature(e, "skill")}>
              <input type="text" placeholder="e.g. video editing" />
              <button type="submit">Add</button>
            </form>
            <div className="addedItems">
              {state?.skills?.map((item) => (
                <div className="item" key={item}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_SKILL", payload: item })
                    }
                  >
                    {item}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Add Specialties</label>
            <form
              className="add"
              onSubmit={(e) => handleFeature(e, "specialty")}
            >
              <input type="text" placeholder="e.g. graphic design" />
              <button type="submit">Add</button>
            </form>
            <div className="addedItems">
              {state?.specialties?.map((item) => (
                <div className="item" key={item}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_SPECIALTY", payload: item })
                    }
                  >
                    {item}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Add Experience</label>
            <form
              className="add"
              onSubmit={(e) => handleFeature(e, "experience")}
            >
              <input type="text" placeholder="e.g. 5 years in film industry" />
              <button type="submit">Add</button>
            </form>
            <div className="addedItems">
              {state?.experiences?.map((item) => (
                <div className="item" key={item}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_EXPERIENCE", payload: item })
                    }
                  >
                    {item}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Add Education</label>
            <form
              className="add"
              onSubmit={(e) => handleFeature(e, "education")}
            >
              <input
                type="text"
                placeholder="e.g. certificate from known organization"
              />
              <button type="submit">Add</button>
            </form>
            <div className="addedItems">
              {state?.educations?.map((item) => (
                <div className="item" key={item}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_EDUCATION", payload: item })
                    }
                  >
                    {item}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Add Social Media Links</label>
            <form
              className="add"
              onSubmit={(e) => handleFeature(e, "socialMedia")}
            >
              <input
                type="text"
                placeholder="e.g. https://twitter.com/yourprofile"
              />
              <button type="submit">Add</button>
            </form>
            <div className="addedItems">
              {state?.socialMedias?.map((item) => (
                <div className="item" key={item}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_SOCIALMEDIA", payload: item })
                    }
                  >
                    {item}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Add Additional Information</label>
            <form className="add" onSubmit={handleAddAdditionalInfoTitle}>
              <input
                type="text"
                placeholder="Title"
                value={additionalInfoTitle}
                onChange={(e) => setAdditionalInfoTitle(e.target.value)}
              />
              <button type="submit">Add Title</button>
            </form>
            {additionalInfo.map((info, index) => (
              <div key={index}>
                <h3>{info.title}</h3>
                <form
                  className="add"
                  onSubmit={(e) => handleAddAdditionalInfoContent(e, index)}
                >
                  <input
                    type="text"
                    placeholder="Content"
                    value={additionalInfoContent}
                    onChange={(e) => setAdditionalInfoContent(e.target.value)}
                  />
                  <button type="submit">Add Content</button>
                </form>
                <div className="addedItems">
                  {info.content.map((content, contentIndex) => (
                    <div className="item" key={contentIndex}>
                      <button
                        onClick={() =>
                          handleRemoveAdditionalInfoContent(index, contentIndex)
                        }
                      >
                        {content}
                        <span>X</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleRemoveAdditionalInfoTitle(index)}>
                  Remove Title
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
