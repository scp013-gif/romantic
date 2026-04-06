import client from "./config";

export const doLogin = async (credential:Credential) => {
    return client.post('/auth/login',credential);
}

export const doRegister = async (credential:Credential) => {
    return client.post('/auth/register',credential);
}
