import axios from 'axios';

const URL = 'https://ffn.extranat.fr/webffn';

const instance = axios.create({
    baseURL: URL,
});

export default instance;
