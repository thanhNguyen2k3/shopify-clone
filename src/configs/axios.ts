import axios from 'axios';

export const restApi = axios.create({
    url: `${process.env.NEXT_REDIRECT_URL}`,
});
