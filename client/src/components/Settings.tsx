import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import styles from './style/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EditableField, User } from './types';
import { useDropzone, Accept } from 'react-dropzone';
import axios from 'axios';
import manAvatar from './img/manAvatar.png';
import womanAvatar from './img/womanAvatar.png';

type EditableUserFields = 'username' | 'email' | 'name' | 'surname' | 'dateOfBirth' | 'gender';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [editableFields, setEditableFields] = useState<Record<EditableUserFields, EditableField>>({
    username: { isEditing: false, value: '' },
    email: { isEditing: false, value: '' },
    name: { isEditing: false, value: '' },
    surname: { isEditing: false, value: '' },
    dateOfBirth: { isEditing: false, value: '' },
    gender: { isEditing: false, value: '' },
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setEditableFields({
        username: { isEditing: false, value: user.username },
        email: { isEditing: false, value: user.email },
        name: { isEditing: false, value: user.name },
        surname: { isEditing: false, value: user.surname },
        dateOfBirth: { isEditing: false, value: user.dateOfBirth },
        gender: { isEditing: false, value: user.gender },
      });
    }
  }, [user]);

  const handleEditClick = (field: EditableUserFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], isEditing: true },
    }));
  };

  const handleCancelClick = (field: EditableUserFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: { isEditing: false, value: user ? user[field] : '' },
    }));
  };

  const handleChange = (field: EditableUserFields, value: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const handleSaveClick = async (field: EditableUserFields) => {
    try {
      const updatedData: Partial<User> = {};
      
      if (field === 'gender') {
        const genderValue = editableFields.gender.value;
        if (genderValue === 'MALE' || genderValue === 'FEMALE') {
          updatedData.gender = genderValue;
        } else {
          toast.error('Будь ласка, оберіть коректне значення для гендеру.');
          return;
        }
      } else {
        updatedData[field] = editableFields[field].value;
      }
  
      const response = await axiosInstance.patch<User>('/api/users/update', updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      updateUser(response.data);
  
      toast.success(`${capitalizeFirstLetter(field)} оновлено успішно!`);
      setEditableFields((prev) => ({
        ...prev,
        [field]: { ...prev[field], isEditing: false },
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error);
        toast.error(`Не вдалося оновити ${capitalizeFirstLetter(field)}. Спробуйте ще раз.`);
      } else {
        console.error('Unexpected error:', error);
        toast.error(`Не вдалося оновити ${capitalizeFirstLetter(field)}. Спробуйте ще раз.`);
      }
    }
  };  

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      setIsUploadingAvatar(true);
      const response = await axiosInstance.patch<User>('/api/users/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateUser(response.data);
      toast.success('Аватар оновлено успішно!');
      setAvatarFile(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error);
        toast.error('Не вдалося оновити аватар. Спробуйте ще раз.');
      } else {
        console.error('Unexpected error:', error);
        toast.error('Не вдалося оновити аватар. Спробуйте ще раз.');
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  }; 

  const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] } as Accept,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setAvatarFile(acceptedFiles[0]);
      }
    },
  });

  if (!user) {
    return <div className={styles.container}>Завантаження...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Налаштування профілю</h2>
      <div className={styles.card}>
        <div className={styles.field}>
          <label>Username:</label>
          {editableFields.username.isEditing ? (
            <>
              <input
                type="text"
                value={editableFields.username.value}
                onChange={(e) => handleChange('username', e.target.value)}
              />
              <button onClick={() => handleSaveClick('username')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('username')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{user.username}</span>
              <button onClick={() => handleEditClick('username')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Email:</label>
          {editableFields.email.isEditing ? (
            <>
              <input
                type="email"
                value={editableFields.email.value}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <button onClick={() => handleSaveClick('email')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('email')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{user.email}</span>
              <button onClick={() => handleEditClick('email')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Name:</label>
          {editableFields.name.isEditing ? (
            <>
              <input
                type="text"
                value={editableFields.name.value}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <button onClick={() => handleSaveClick('name')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('name')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{user.name}</span>
              <button onClick={() => handleEditClick('name')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Surname:</label>
          {editableFields.surname.isEditing ? (
            <>
              <input
                type="text"
                value={editableFields.surname.value}
                onChange={(e) => handleChange('surname', e.target.value)}
              />
              <button onClick={() => handleSaveClick('surname')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('surname')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{user.surname}</span>
              <button onClick={() => handleEditClick('surname')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Date of Birth:</label>
          {editableFields.dateOfBirth.isEditing ? (
            <>
              <input
                type="date"
                value={editableFields.dateOfBirth.value}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
              <button onClick={() => handleSaveClick('dateOfBirth')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('dateOfBirth')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
              <button onClick={() => handleEditClick('dateOfBirth')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Gender:</label>
          {editableFields.gender.isEditing ? (
            <>
              <select
                value={editableFields.gender.value}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <button onClick={() => handleSaveClick('gender')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button onClick={() => handleCancelClick('gender')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <span>{capitalizeFirstLetter(user.gender)}</span>
              <button onClick={() => handleEditClick('gender')} className={styles.iconButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Avatar:</label>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img
                src={user.avatarUrl ? user.avatarUrl : user.gender === 'MALE' ? manAvatar : womanAvatar}
                alt="User Avatar"
                className={styles.avatar}
              />
            </div>

            <div
              {...getRootProps()}
              className={styles.dropzone}
            >
              <input {...getInputProps()} />
              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Preview"
                  className={styles.avatar}
                />
              ) : (
                <p>Drop your photo here or click to upload</p>
              )}
            </div>

            <button
              onClick={handleAvatarUpload}
              className={styles.uploadButton}
              disabled={!avatarFile || isUploadingAvatar}
            >
              {isUploadingAvatar ? 'Uploading...' : <FontAwesomeIcon icon={faSave} />}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Settings;