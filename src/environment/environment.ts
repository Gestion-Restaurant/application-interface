const apiEndPoint = import.meta.env.API_ENDPOINT || 'http://localhost:8000';

export const environment = {
    production: false,
    apiEndpoint: apiEndPoint
};