import axios from 'axios';
import Notiflix from 'notiflix';
export let page = 1;
export let query = null;


const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35873387-043be5fc32218bbe1343d3f51';
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export async function getPictures (searchQuery){
    if (searchQuery !== query) {
        page = 1;
        query= searchQuery;
    }

    try {
        const response = await axios.get(`${BASE_URL}${params}&q=${query}&page=${page}`);
        page +=1;
        return response.data;

    } catch (error) {
        Notiflix.Notify.failure('Something went wrong! Please retry');
        console.log(error);
    }
}