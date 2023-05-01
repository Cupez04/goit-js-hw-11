import './css/styles.css'
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getPictures, page, query} from './js/pixabay';
import { createMarkup } from './js/markup';
import { formRef, galleryRef, loadRef } from './js/refs';

// controlador de eventos
formRef.addEventListener('submit', onSubmit);
loadRef.addEventListener('click', onLoadClick);

// creacion de instancia SimpleLightBox
const lightbox = new SimpleLightbox ('.gallery a');

/**
 * funcion para controlar los valores en la entrada y 
 * notificar los posibles fallos provenientes de la ejecucion
 */

async function onSubmit(event){
    event.preventDefault();
    const searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

    if (!searchQuery) {
        Notiflix.Notify.failure('Enter a Search Query!');
        return;
    }
    try {
        const searchData = await getPictures(searchQuery);
        const { hits, totalHits} = searchData;
        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        Notiflix.Notify.failure(`Hooray! We found ${totalHits} images!`);
        const markup = hits.map(item => createMarkup(item)).join('');
        galleryRef.innerHTML = markup;
        if (totalHits > 40) {
            loadRef.classList.remove('js-load-btn');
            page +=1;
        }
        lightbox.refresh();
    } catch (error) {
      Notiflix.Notify.failure('Something went wrong! Please retry');
      console.log(error);  
    }
}
async function onLoadClick(){
    const response = await getPictures(query);
    const { hits, totalHits} = response;
    const markup = hits.map(item => createMarkup(item)).join('');
    galleryRef.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    const amountOfPages = totalHits / 40 - page;
    if (amountOfPages < 1) {
        loadRef.classList.add('js-load-btn');
        Notiflix.Notify.info("Were sorry, but you've reached the end of search results.")
    }
}