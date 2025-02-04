import dotenv from 'dotenv';
dotenv.config();

const apiEndPoint = process.env.API_ENDPOINT || 'http://localhost:8000';

export const environment = {
    production: false,
    apiEndpoint: apiEndPoint
};