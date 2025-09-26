import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const loginService = {
  login: (data: { email: string; password: string }) => {
    return axios.post(`${API_URL}/login`, data);
  },
};

export default loginService;
