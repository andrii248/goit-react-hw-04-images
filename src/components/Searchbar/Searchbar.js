import React, { useState } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';
import { GoSearch } from 'react-icons/go';

export default function Searchbar({ onSubmit }) {
   const [value, setValue] = useState('');

   const onFormSubmit = e => {
      e.preventDefault();
      onSubmit(value);
   };

   return (
      <header className={css.Searchbar}>
         <form className={css.SearchForm} onSubmit={onFormSubmit}>
            <button type="submit" className={css.SearchFormButton}>
               <GoSearch />
            </button>
            <label className={css.SearchFormButtonLabel}></label>
            <input
               className={css.SearchFormInput}
               type="text"
               autoComplete="off"
               autoFocus={true}
               value={value}
               onChange={e => setValue(e.target.value)}
               placeholder="Search images and photos"
            />
         </form>
      </header>
   );
}

Searchbar.propTypes = {
   onSubmit: PropTypes.func.isRequired,
};
