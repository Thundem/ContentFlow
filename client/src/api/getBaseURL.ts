const getBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
      return '/';
    }
    return 'http://localhost:8080';
};
  
export default getBaseURL;