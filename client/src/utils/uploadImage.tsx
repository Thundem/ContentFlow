import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/thundem/image/upload';
const UPLOAD_PRESET = 'ContentFlow';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
