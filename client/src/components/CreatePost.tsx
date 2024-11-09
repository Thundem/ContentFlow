import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./style/CreatePost.module.css";
import Editor from "./Editor";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadImage } from "../utils/uploadImage";
import { AxiosError } from "axios";
import { PostData } from "./types";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Перевірка типу файлу
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please upload a valid image or video file.");
        return;
      }

      // Перевірка розміру файлу (наприклад, до 10MB для зображень і відео)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("File size should be less than 10MB.");
        return;
      }

      setMediaFile(file);
      setShowCropper(true);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 800,
        height: 600,
      });
      if (canvas) {
        setCroppedImage(canvas.toDataURL());
        setShowCropper(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Початок завантаження
    try {
      let mediaUrl = "";
      if (croppedImage) {
        const blob = await (await fetch(croppedImage)).blob();
        const file = new File([blob], "croppedImage.png", { type: "image/png" });
        mediaUrl = await uploadImage(file); // Завантаження зображення на Cloudinary
      }

      // Створення форми даних
      const formData = {
        content,
        mediaUrl,
      };

      // Відправка даних на сервер з типізацією відповіді
      const response = await axiosInstance.post<PostData>("/api/posts", formData);

      // Використання response.data, наприклад, для логування або оновлення UI
      console.log("Post created:", response.data);

      toast.success("Content created successfully!");
      navigate("/"); // Перенаправлення на головну сторінку або список постів
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error creating content:", axiosError);

      // Отримання повідомлення про помилку
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Завершення завантаження
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create New Content</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Content:</label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div className={styles.formGroup}>
          <label>Upload Image or Video:</label>
          <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
        </div>
        {showCropper && mediaFile && mediaFile.type.startsWith("image/") && (
          <div className={styles.cropperContainer}>
            <Cropper
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={16 / 9}
              src={URL.createObjectURL(mediaFile)}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <button type="button" onClick={handleCrop} className={styles.cropButton}>
              Crop Image
            </button>
          </div>
        )}
        {showCropper && mediaFile && mediaFile.type.startsWith("video/") && (
          <div className={styles.preview}>
            <video controls width="100%">
              <source src={URL.createObjectURL(mediaFile)} type={mediaFile.type} />
              Your browser does not support the video tag.
            </video>
            <button type="button" onClick={() => setShowCropper(false)} className={styles.cropButton}>
              Use Video
            </button>
          </div>
        )}
        {croppedImage && mediaFile && mediaFile.type.startsWith("image/") && (
          <div className={styles.preview}>
            <img src={croppedImage} alt="Cropped" />
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