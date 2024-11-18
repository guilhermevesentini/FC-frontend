import axios from "axios";

// Criação da instância do Axios
const axiosAdapater = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Variável de ambiente
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autorização (opcional)
axiosAdapater.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosAdapater;
