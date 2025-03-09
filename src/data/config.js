const API_BASE_URL = 'https://97ce-118-69-182-144.ngrok-free.app';

const createEndpoint = (path) => (id) => `${API_BASE_URL}${path}/${id}`;

export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
};

export const PREGNANCY_ENDPOINTS = {
    LIST: `${API_BASE_URL}/api/pregnancies`,
    CURRENT: `${API_BASE_URL}/api/pregnancies/current`,
    CREATE: `${API_BASE_URL}/api/pregnancies`,
    UPDATE: createEndpoint('/api/pregnancies'),
    DELETE: createEndpoint('/api/pregnancies'),
    END_PREGNANCY: (id) => `${API_BASE_URL}/api/pregnancies/${id}/end`,
    GET_BY_ID: createEndpoint('/api/pregnancies'),
    UPDATE_PROFILE: `${API_BASE_URL}/api/pregnancies/profile`,
};

export const MEDICAL_ENDPOINTS = {
    VACCINATIONS: `${API_BASE_URL}/api/medical/vaccinations`,
    CHECKUPS: `${API_BASE_URL}/api/medical/checkups`,
    MEASUREMENTS: `${API_BASE_URL}/api/medical/measurements`,
};

export const API_CONFIG = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        timeout: 10000,
    };
};

const API = {
    API_BASE_URL,
    AUTH_ENDPOINTS,
    PREGNANCY_ENDPOINTS,
    MEDICAL_ENDPOINTS,
    API_CONFIG,
};

export default API;
