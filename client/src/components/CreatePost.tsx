import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./style/CreatePost.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { PostData, CloudinarySignatureResponse } from "./types/types";
import { useDropzone } from "react-dropzone";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setMediaFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let mediaUrl = "";

      if (mediaFile) {
        // Отримуємо підпис та timestamp з сервера
        const signatureResponse = await axiosInstance.get<CloudinarySignatureResponse>(
          "/api/posts/sign-upload"
        );

        const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;

        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("source", "browser");

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        mediaUrl = uploadResponse.data.secure_url;
      }

      const postData = {
        content,
        mediaUrl,
      };

      const response = await axiosInstance.post<PostData>("/api/posts", postData);

      console.log("Post created:", response.data);

      toast.success("Content created successfully!");
      navigate("/");
    } catch (error: unknown) {
      console.error("Error creating content:", error);

      let errorMessage = "Something went wrong!";
      if (axios.isAxiosError(error)) {
        if (typeof error.response?.data === "string") {
          errorMessage = error.response.data;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create New Content</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            placeholder="Enter your content"
            minRows={3}
          />
        </div>
        <div {...getRootProps()} className={`${styles.dropArea} ${isDragActive ? styles.dragging : ""}`}>
          <input {...getInputProps()} />
          <p>Drop your photo/video here or click to select</p>
        </div>
        {mediaPreviewUrl && (
          <div className={styles.preview}>
            {mediaPreviewUrl.startsWith("data:video") ? (
              <video src={mediaPreviewUrl} controls />
            ) : (
              <img src={mediaPreviewUrl} alt="Selected Media" />
            )}
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Content"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreatePost;