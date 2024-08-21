import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'https://e-commerce-mern-2ygv.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosConfig;
