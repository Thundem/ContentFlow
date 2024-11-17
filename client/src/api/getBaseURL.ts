const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://contentflow.onrender.com';
    }
    return 'http://localhost:8080';
};
  
export default getBaseURL;