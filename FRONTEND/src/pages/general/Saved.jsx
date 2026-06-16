import React, { useEffect, useState } from "react";
import axios from "axios";
import BottomNavigation from "../BottomNavigation";
import "../../styles/Saved.css";

function Saved() {

    const [savedFoods, setSavedFoods] = useState([]);

    useEffect(() => {
        fetchSavedFoods();
    }, []);

    async function fetchSavedFoods() {
        try {

            const token = localStorage.getItem("accessToken");

            const response = await axios.get(
                "https://reels-backend-rxue.onrender.com/api/food/saved",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSavedFoods(response.data.savedFoods || []);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="saved-page">

            <h2 className="saved-title">
                Saved Foods
            </h2>

            <div className="saved-grid">

                {
                    savedFoods.map((item) => (
                        <div
                            key={item._id}
                            className="saved-card"
                        >
                            <video
                                src={item.food.video}
                                className="saved-video"
                                muted
                            />
                        </div>
                    ))
                }

            </div>

            <BottomNavigation />

        </div>
    );
}

export default Saved;