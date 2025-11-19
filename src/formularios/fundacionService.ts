import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const fundacionService = {
    // GET con parámetros (equivalente a listAllTasks con `params`)
    traerPersonas: () => {
        return axios.get(`${API_URL}/Fundacion`);
    },

    // POST (crear) o PUT (actualizar) según si hay ID
    crear: (data: FormData) => {
        // Registro público: no enviamos Authorization aquí para garantizar
        // que cualquier usuario (no autenticado) pueda crear una fundación.
        // No fijamos Content-Type: axios lo establecerá correctamente para FormData
        return axios.post(`${API_URL}/crearFundacion`, data);
    },

    traerPersonaId: (data: any) => {
        return axios.get(`${API_URL}/traerPersonaIdFundacion`, data);
    },

    // POST (crear) o PUT (actualizar) según si hay ID
    actualizar: (data: any) => {
        return axios.post(`${API_URL}/actualizarFundacion`, data);
    },

    // DELETE por ID
    eliminarPorId: (data: any) => {
        return axios.post(`${API_URL}/eliminarPorIdFundacion`, data);
    },

};

export default fundacionService;