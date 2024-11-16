import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { notify } from "./toast";
import axios from 'axios';
import styles from "./style/ResendVerification.module.css";

const ResendVerification: React.FC = () => {
    const [email, setEmail] = useState("");

    const handleResend = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) {
            notify("Please enter your email", "error");
            return;
        }

        try {
            const response = await axiosInstance.post("/api/auth/resend-verification", { email });
            notify(response.data, "success");
        } catch (error) {
            console.error('Error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    notify(error.response.data, "error");
                } else {
                    notify("Something went wrong during the request", "error");
                }
            } else {
                notify("An unexpected error occurred", "error");
            }
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.resend} onSubmit={handleResend}>
                <h2>Resend Verification Email</h2>
                <div>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                </div>
                <div>
                    <button type="submit">Resend Email</button>
                </div>
            </form>
        </div>
    );
};

export default ResendVerification;