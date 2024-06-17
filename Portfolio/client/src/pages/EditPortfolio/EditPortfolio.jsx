import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import './EditPortfolio.scss';

function EditPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({
    title: '',
    cover: '',
    desc: '',
    cat: '',
    images: [],
    experiences: [],
    educations: [],
    skills: [],
    specialties: [],
    additionalInfo: [],
  });
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await newRequest.get(`/portfolios/single/${id}`);
        setPortfolio(res.data);
        setCoverPreview(res.data.cover);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    };
    fetchPortfolio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, arrayName, index) => {
    const { value } = e.target;
    setPortfolio((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = value;
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleArrayAdd = (arrayName) => {
    setPortfolio((prev) => {
      const updatedArray = [...prev[arrayName], ''];
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleArrayRemove = (arrayName, index) => {
    setPortfolio((prev) => {
      const updatedArray = prev[arrayName].filter((_, i) => i !== index);
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleImageUpload = (e, index, arrayName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolio((prev) => {
          const updatedArray = [...prev[arrayName]];
          if (index === null) {
            updatedArray.push(reader.result);
          } else {
            updatedArray[index] = reader.result;
          }
          return { ...prev, [arrayName]: updatedArray };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolio((prev) => ({ ...prev, cover: reader.result }));
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setPortfolio((prev) => ({ ...prev, cover: '' }));
    setCoverPreview('');
  };

  const handleAddCover = () => {
    document.getElementById('cover-upload').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.put(`/portfolios/${id}`, portfolio);
      navigate('/mygigs');
    } catch (err) {
      console.error('Error updating portfolio:', err);
    }
  };

  const handleAdditionalInfoChange = (index, field, value) => {
    const newAdditionalInfo = [...portfolio.additionalInfo];
    newAdditionalInfo[index] = { ...newAdditionalInfo[index], [field]: value };
    setPortfolio((prev) => ({ ...prev, additionalInfo: newAdditionalInfo }));
  };

  const handleAddAdditionalInfo = () => {
    setPortfolio((prev) => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { title: '', content: [] }],
    }));
  };

  const handleRemoveAdditionalInfo = (index) => {
    const newAdditionalInfo = portfolio.additionalInfo.filter((_, i) => i !== index);
    setPortfolio((prev) => ({ ...prev, additionalInfo: newAdditionalInfo }));
  };

  return (
    <div className="editPortfolio">
      <h1>Edit Portfolio</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="left-section">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={portfolio.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="desc"
                value={portfolio.desc}
                onChange={handleChange}
                rows={5}
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="cat"
                value={portfolio.cat}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Cover Image:</label>
              <input
                type="file"
                accept="image/*"
                id="cover-upload"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
              {coverPreview ? (
                <div className="image-preview">
                  <img src={coverPreview} alt="Cover" className="cover-preview" />
                  <button type="button" onClick={handleRemoveCover}>Remove</button>
                </div>
              ) : (
                <button type="button" onClick={handleAddCover} className="add-btn">Add Cover Image</button>
              )}
            </div>
            <div className="form-group">
              <label>Images:</label>
              {portfolio.images.map((image, index) => (
                <div key={index} className="array-field">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, 'images')}
                  />
                  {image && <img src={image} alt={`Portfolio ${index}`} className="preview-image" />}
                  <button type="button" onClick={() => handleArrayRemove('images', index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('images')} className="add-btn">Add Image</button>
            </div>
          </div>
          <div className="middle-space"></div>
          <div className="right-section">
            <div className="form-group">
              <label>Experiences:</label>
              {portfolio.experiences.map((experience, index) => (
                <div key={index} className="array-field">
                  <textarea
                    type="text"
                    value={experience}
                    onChange={(e) => handleArrayChange(e, 'experiences', index)}
                    rows={5}
                  />
                  <button type="button" onClick={() => handleArrayRemove('experiences', index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('experiences')} className="add-btn">Add Experience</button>
            </div>
            <div className="form-group">
              <label>Educations:</label>
              {portfolio.educations.map((education, index) => (
                <div key={index} className="array-field">
                  <textarea
                    type="text"
                    value={education}
                    onChange={(e) => handleArrayChange(e, 'educations', index)}
                    rows={3}
                  />
                  <button type="button" onClick={() => handleArrayRemove('educations', index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('educations')} className="add-btn">Add Education</button>
            </div>
            <div className="form-group">
              <label>Skills:</label>
              {portfolio.skills.map((skill, index) => (
                <div key={index} className="array-field">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(e, 'skills', index)}
                  />
                  <button type="button" onClick={() => handleArrayRemove('skills', index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('skills')} className="add-btn">Add Skill</button>
            </div>
            <div className="form-group">
              <label>Specialties:</label>
              {portfolio.specialties.map((specialty, index) => (
                <div key={index} className="array-field">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => handleArrayChange(e, 'specialties', index)}
                  />
                  <button type="button" onClick={() => handleArrayRemove('specialties', index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('specialties')} className="add-btn">Add Specialty</button>
            </div>
            <div className="form-group">
              <label>Additional Information:</label>
              {portfolio.additionalInfo.map((info, index) => (
                <div key={index} className="additional-info-section">
                  <input
                    type="text"
                    placeholder="Title"
                    value={info.title}
                    onChange={(e) => handleAdditionalInfoChange(index, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="Content"
                    value={info.content}
                    onChange={(e) => handleAdditionalInfoChange(index, 'content', e.target.value)}
                    rows={3}
                  />
                  <button type="button" onClick={() => handleRemoveAdditionalInfo(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddAdditionalInfo} className="add-btn">Add Additional Information</button>
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPortfolio;
