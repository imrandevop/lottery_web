// config/environment.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    LOG_LEVEL: 'debug',
    ENABLE_MOCK_DATA: true
  },
  production: {
    API_BASE_URL: 'https://sea-lion-app-begbw.ondigitalocean.app/api',
    LOG_LEVEL: 'error',
    ENABLE_MOCK_DATA: false
  },
  test: {
    API_BASE_URL: 'http://localhost:8000/api',
    LOG_LEVEL: 'silent',
    ENABLE_MOCK_DATA: true
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];