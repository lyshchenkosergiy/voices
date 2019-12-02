import { authPost } from './axios';

export const requestFunds = (data) => authPost('system/request-funds', { data });
