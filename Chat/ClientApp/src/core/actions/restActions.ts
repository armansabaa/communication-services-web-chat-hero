import axios from 'axios';


export interface RestPost {
    url: string;
    body: string | undefined;
}

export interface RestGet {
    url: string;
}

export interface RestDelete {
    url: string;
}

export const post = (postRequest: RestPost): Promise<any> => {
    return axios.post(postRequest.url, postRequest.body ? JSON.parse(postRequest.body) : {});
}

export const get = (getRequest: RestGet): Promise<any> => {
    return axios.get(getRequest.url);
}

export const del = (deleteRequest: RestDelete): Promise<any> => {
    return axios.delete(deleteRequest.url);
}
