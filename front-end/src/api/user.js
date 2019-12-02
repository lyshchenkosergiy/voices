import { authGet, authPost, authPut } from './axios';

export const getMe = () => authGet('profile/me');

export const initProfile = (data) => authPost('profile/init', { data });

export const updateProfile = (data) => authPut('profile/update', { data });
