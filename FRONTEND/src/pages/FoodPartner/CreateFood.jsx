import React, { useState } from 'react'
import './CreateFood.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [formData, setFormData] = useState({
    video: null,
    name: '',
    description: ''
  })

  const [videoPreview, setVideoPreview] = useState(null)

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVideoChange = (e) => {
    console.log(e.target.files);
    const file = e.target.files[0]
    if (file) {
      console.log(file);
      setFormData(prev => ({
        ...prev,
        video: file
      }))

      // Create video preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setVideoPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("video1", formData.video);

    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      "https://reels-backend-rxue.onrender.com/api/food",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    // Redirect to partner profile after successful food creation
    const partnerId = localStorage.getItem('partnerId');
    if (partnerId) {
      navigate(`/food-partner/${partnerId}`);
    } else {
      navigate("/");
    }
  };

  const handleReset = () => {
    setFormData({
      video: null,
      name: '',
      description: ''
    })
    setVideoPreview(null)
  }

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <div className="create-food-header">
          <h1>Create Food Item</h1>
          <p>Add a new food item to your menu</p>
        </div>

        <form onSubmit={handleSubmit} className="create-food-form">
          {/* Video Input */}
          <div className="form-group">
            <label htmlFor="video">Video Upload</label>
            <div className="video-input-wrapper">
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="video-input"
              />
              <label
                htmlFor="video"
                className="video-input-label"
              >
                {formData.video ? '✓ Video Selected' : '+ Choose Video'}
              </label>
            </div>
            {videoPreview && (
              <div className="video-preview">
                <video width="100%" height="auto" controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Food Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name"
              maxLength="100"
              required
            />
            <span className="char-count">{formData.name.length}/100</span>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter food description (ingredients, preparation, etc.)"
              rows="5"
              maxLength="500"
              required
            ></textarea>
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Create Food Item
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood
