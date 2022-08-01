import React, { useState, useEffect } from 'react';
import Searchbar from 'components/Searchbar/Searchbar';
import Modal from 'components/Modal/Modal';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import FetchData from 'services/API';
import Notiflix from 'notiflix';
import * as Scroll from 'react-scroll';

export default function App() {
   const [searchName, setSearchName] = useState('');
   const [countPage, setCountPage] = useState(1);
   const [perPage, setPerPage] = useState(12);
   const [imagesList, setImagesList] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [showLoadMore, setShowLoadMore] = useState(false);
   const [loading, setLoading] = useState(false);
   const [openModalItem, setOpenModalItem] = useState({ url: '', alt: '' });

   useEffect(() => {
      if (!searchName) {
         return;
      }
      setShowLoadMore(false);
      setLoading(true);
      FetchData(searchName, countPage, perPage)
         .then(data => {
            const filterDataHits = data.hits.map(img => {
               return Object.fromEntries(
                  Object.entries(img).filter(([key]) =>
                     ['id', 'tags', 'largeImageURL', 'webformatURL'].includes(
                        key
                     )
                  )
               );
            });
            const total = data.total;
            setImagesList(prev => [...prev, ...filterDataHits]);
            setLoading(false);
            if (data.hits.length > 0 && data.hits.length < total) {
               setShowLoadMore(true);
            }
            if (countPage === 1) {
               Notiflix.Notify.success(
                  `Woo-hoo!!! We've found ${data.totalHits} images.`
               );
            }

            if (total <= countPage * perPage) {
               setShowLoadMore(false);
               Notiflix.Notify.info(
                  "Whoops! You've just reached the end of the image list."
               );
            }
         })
         .catch(onApiError);
   }, [countPage, searchName, perPage]);

   const onApiError = () => {
      Notiflix.Notify.failure(
         'Oops! No images found for your request. Please try again.'
      );
      setShowLoadMore(false);
      setLoading(false);
   };

   const onSubmit = (name, itemsPerPage) => {
      if (!name) {
         Notiflix.Notify.warning(
            'Please enter a name of the picture to search'
         );
         setShowLoadMore(false);
      }

      if (searchName === name && countPage === 1 && itemsPerPage === perPage) {
         return;
      }

      setSearchName(name);
      setPerPage(perPage);
      setCountPage(1);
      setImagesList([]);
   };

   const onloadMore = () => {
      setCountPage(prev => prev + 1);
      scrollSlowly();
   };

   const scrollSlowly = () => {
      const { height: cardHeight } = document
         .querySelector('#ImageGallery')
         .firstElementChild.getBoundingClientRect();
      Scroll.animateScroll.scrollMore(cardHeight * 2);
   };

   const openModal = (url, alt) => {
      setOpenModalItem({ url, alt });
      setTimeout(() => {
         setShowModal(true);
      }, 100);
   };

   return (
      <div className="App">
         <Searchbar onSubmit={onSubmit} />
         {showModal && (
            <Modal
               url={openModalItem.url}
               alt={openModalItem.alt}
               onClose={() => setShowModal(false)}
            />
         )}
         <ImageGallery params={imagesList} openModal={openModal} />
         {loading && <Loader />}
         {showLoadMore && <Button onClick={onloadMore} title="Load more..." />}
      </div>
   );
}
