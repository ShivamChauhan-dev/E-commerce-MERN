import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'https://e-commerce-mern-2ygv.onrender.com:4000/',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosConfig;
