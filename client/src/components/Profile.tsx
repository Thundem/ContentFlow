import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import { User } from "./types";
import "./style/Profile.css";

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [userData, setUserData] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get<User>(`/api/users/${username}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError('Failed to load user data.');
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    return (
        <div>
            {error ? (
                <p>{error}</p>
            ) : userData ? (
                <div className="content">
                    <div className="content-1">
                        {userData.avatarUrl && (
                            <img src={userData.avatarUrl} alt={`${userData.username}'s avatar`} style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                        )}
                        <h2 className="username">{userData.username}</h2>
                    </div>
                    <div className="content-2">
                        <p>Email: {userData.email}</p>
                        <p>Gender: {userData.gender}</p>
                        <p>Date of Birth: {new Date(userData.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;