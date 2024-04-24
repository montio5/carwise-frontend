const isLocal = false; // Change this to switch between local and destination URL

const apiUrl = isLocal ? 'http://localhost:8000/' : 'https://carwise.pythonanywhere.com';

export default apiUrl;
