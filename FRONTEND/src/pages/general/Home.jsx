import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    FaHeart,
    FaRegHeart,
    FaComment,
    FaBookmark,
    FaRegBookmark
} from "react-icons/fa";

import BottomNavigation from "../BottomNavigation";
import { useNavigate } from 'react-router-dom'
import '../../pages/general/Home.css'

const Home = () => {


    const navigate = useNavigate()

    const [videos, setVideos] = useState([])
    const [likedVideos, setLikedVideos] = useState({})
    const [savedVideos, setSavedVideos] = useState({})

    useEffect(() => {

        const fetchVideos = async () => {

            try {

                const token = localStorage.getItem('accessToken')

                const response = await axios.get(
                    'http://localhost:3000/api/food',
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setVideos(response.data.foodItems || [])

            } catch (error) {
                console.error(error)
            }
        }

        fetchVideos()

    }, [])

    const handleLike = async (foodId) => {
        try {

            const token = localStorage.getItem("accessToken");

            const response = await axios.post(
                "http://localhost:3000/api/food/like",
                { foodId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLikedVideos((prev) => ({
                ...prev,
                [foodId]: response.data.liked
            }));

            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async (foodId) => {
        try {

            const token = localStorage.getItem("accessToken");

            const response = await axios.post(
                "http://localhost:3000/api/food/save",
                { foodId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSavedVideos((prev) => ({
                ...prev,
                [foodId]: response.data.saved
            }));

            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="home-container">

                <div className="video-feed">

                    {videos.length > 0 ? (

                        videos.map((video) => (

                            <div
                                key={video._id}
                                className="video-item"
                            >

                                <video
                                    className="video-player"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    controls
                                >
                                    <source
                                        src={video.video}
                                        type="video/mp4"
                                    />
                                </video>

                                <div className="video-overlay">

                                    <div className="video-content">

                                        <h3>{video.name}</h3>

                                        <p className="video-description">
                                            {video.description}
                                        </p>

                                        <button
                                            className="visit-store-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/food-partner/${video.foodPartner}`
                                                )
                                            }
                                        >
                                            Visit Store
                                        </button>

                                    </div>

                                    <div className="video-actions">

                                        <button
                                            className="action-btn"
                                            onClick={() =>
                                                handleLike(video._id)
                                            }
                                        >
                                            {
                                                likedVideos[video._id]
                                                    ? <FaHeart />
                                                    : <FaRegHeart />
                                            }
                                        </button>

                                        <button
                                            className="action-btn"
                                        >
                                            <FaComment />
                                        </button>

                                        <button
                                            className="action-btn"
                                            onClick={() =>
                                                handleSave(video._id)
                                            }
                                        >
                                            {
                                                savedVideos[video._id]
                                                    ? <FaBookmark />
                                                    : <FaRegBookmark />
                                            }
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <p>No videos found.</p>

                    )}

                </div>

            </div>

            <BottomNavigation />

        </>
    )


}

export default Home
