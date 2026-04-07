import client from "./config";

export const doLogin = async (credential:Credential) => {
    return client.post('/auth/login',credential);
}

export const doRegister = async (credential:Credential) => {
    return client.post('/auth/register',credential);
}

export const getRecords = async () => {
    return client.get('/generation/records');
}

export const deleteRecords = async (id:number) => {
    return client.delete(`/generation/${id}`);
}