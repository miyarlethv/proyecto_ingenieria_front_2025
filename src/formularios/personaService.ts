import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const personaService = {
    // GET con parámetros (equivalente a listAllTasks con `params`)
    traerPersonas: () => {
        return axios.get(`${API_URL}/`);
    },

    // POST (crear) o PUT (actualizar) según si hay ID
    crear: (data:any) => {
        return axios.post(`${API_URL}/crear`, data);
    },
    
    traerPersonaId: (data:any) => {
        return axios.get(`${API_URL}/traerPersonaId`, data);
    },

    // POST (crear) o PUT (actualizar) según si hay ID
    actualizar: (data:any) => {
        return axios.post(`${API_URL}/actualizar`, data);
    },

    // DELETE por ID
    eliminarPorId: (data:any) => {
        return axios.post(`${API_URL}/eliminarPorId/`,data);
    },

};

export default personaService;