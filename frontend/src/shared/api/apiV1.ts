import axios from 'axios';

import { calculateSecretSignature, extractTelegramInitData } from '~/shared/utils';

const apiV1 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'X-Token': extractTelegramInitData(),
  },
});

apiV1.interceptors.request.use(
  config => {
    const data = JSON.stringify(config.data);
    const signature = calculateSecretSignature(data, import.meta.env.VITE_SECRET_TOKEN);
    config.headers['X-Signature'] = signature;

    return config;
  },
  error => Promise.reject(error),
);

apiV1.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isAxiosError(error)) {
      return Promise.reject(
        error.response || {
          data: { error: error.message ?? 'Unknown error' },
          status: error.status ?? 400,
        },
      );
    }

    return Promise.reject(error);
  },
);

export default apiV1;
