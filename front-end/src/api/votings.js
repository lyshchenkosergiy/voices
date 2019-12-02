import { authGet, authPut, authPost, authDelete } from './axios';

export const getVotings = () => authGet('voting');

export const getMyVotings = () => authGet('voting', { params: { my: true } });

export const createVoting = (data) => authPost('voting', { data });

export const deleteVoting = (id) => authDelete(`voting/${id}`);

export const getVotingById = (id) => authGet(`voting/${id}`);

export const createVotingVariant = (data) => authPost('voting/variant', { data });

export const deleteVotingVariant = (id) => authDelete(`voting/variant/${id}`);

export const updateVotingVariant = (id, data) => authPut(`voting/variant/${id}`, { data });

export const startVoting = (id) => authPost(`voting/start/${id}`);

export const finishVoting = (id) => authPost(`voting/finish/${id}`);

export const joinVoting = (data) => authPost('voting/member', { data });

export const acceptMember = (id) => authPost(`voting/member/accept/${id}`);

export const declineMember = (id) => authPost(`voting/member/decline/${id}`);

export const vote = (data) => authPost('voting/vote', { data });

export const updateVoting = (id, data) => authPut(`voting/${id}`, { data });
