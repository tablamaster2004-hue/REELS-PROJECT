import "./profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
    const { profile } = useParams();
    const navigate = useNavigate();


    const [foodPartner, setFoodPartner] = useState(null);

    useEffect(() => {
        getFoodPartner();
    }, []);

    async function getFoodPartner() {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("TOKEN SENT")

            const response = await axios.get(
                `http://localhost:3000/api/food-partner/${profile}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setFoodPartner(response.data.foodPartner);
        } catch (error) {
            console.log(error);
        }
    }

    if (!foodPartner) {
        return (
            <div className="profilePage">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="profilePage">
            {/* Header */}
            <div className="profileHeader">
                <div className="profileTop">
                    <img
                        className="profileImage"
                        src="https://images.unsplash.com/photo-1781084819510-d401a1e77a7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
                        alt="profile"
                    />

                    <div className="profileInfo">
                        <h2>{foodPartner.name}</h2>

                        <p>
                            {foodPartner.address || "Address not provided"}
                        </p>
                    </div>
                </div>

                <div className="profileStats">
                    <div className="stat">
                        <h3>{foodPartner.foodItems?.length || 0}</h3>
                        <span>Total Meals</span>
                    </div>

                    <div className="stat">
                        <h3>50K</h3>
                        <span>Customers</span>
                    </div>
                </div>

                <button
                    className="add-food-btn"
                    onClick={() => navigate('/create-food')}
                    title="Add New Food Item"
                >
                    +
                </button>
            </div>

            {/* Videos Grid */}
            <div className="videosGrid">
                {foodPartner.foodItems?.map((item) => (
                    <div key={item._id} className="videoCard">
                        <video
                            className="gridVideo"
                            muted
                            playsInline
                            preload="metadata"
                        >
                            <source
                                src={item.video}
                                type="video/mp4"
                            />
                        </video>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;