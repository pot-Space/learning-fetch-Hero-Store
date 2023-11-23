"use strict";

fetch('heroes.json')
   .then(response => {
      if (!response.ok) {
         throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
   })
   .then(json => initialize(json))
   .catch(err => console.error(`Fetch problem: ${err.message}`));

function initialize(heroes) {
   const category = document.querySelector('#category'),
      searchTerm = document.querySelector('#searchTerm'),
      searchBtn = document.querySelector('button'),
      main = document.querySelector('main');

   let lastCategory = category.value;
   let lastSearch = '';

   let categoryGroup;
   let finalGroup;

   finalGroup = heroes;
   updateDisplay();

   categoryGroup = [];
   finalGroup = [];

   searchBtn.addEventListener('click', selectCategory);

   function selectCategory(event) {
      event.preventDefault();

      categoryGroup = [];
      finalGroup = [];

      if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
         return;

      } else {
         lastCategory = category.value;
         lastSearch = searchTerm.value.trim();

         if (category.value === 'all') {
            categoryGroup = heroes;
            selectHeroes();

         } else {
            const lowerCaseType = category.value.toLowerCase();
            categoryGroup = heroes.filter(hero => hero.type === lowerCaseType);

            selectHeroes();
         }
      }
   }


   function selectHeroes() {
      if (searchTerm.value.trim() === '') {
         finalGroup = categoryGroup;

      } else {
         const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
         finalGroup = categoryGroup.filter(hero => hero.name.includes(lowerCaseSearchTerm));
      }
      updateDisplay();
   }


   function updateDisplay() {
      while (main.firstChild) {
         main.removeChild(main.firstChild);
      }

      if (finalGroup.length === 0) {
         const paragraph = document.createElement('p');
         paragraph.textContent = 'No results to display!';
         main.appendChild(paragraph);

      } else {
         for (const hero of finalGroup) {
            fetchBlob(hero);
         }
      }
   }


   function fetchBlob(hero) {
      const url = `images/${hero.image}`;

      fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error(`HTTP error: ${response.status}`);
            }
            return response.blob();
         })
         .then(blob => showHero(blob, hero))
         .catch(err => console.error(`Fetch problem: ${err.message}`));
   }

   function showHero(blob, hero) {
      const objectURL = URL.createObjectURL(blob);

      console.log(objectURL);

      const section = document.createElement('section');
      const image = document.createElement('img');
      const heading = document.createElement('h2');
      const paragraph = document.createElement('p');

      section.setAttribute('class', hero.type);
      section.setAttribute('tabindex', '0');

      heading.textContent = hero.name.replace(hero.name.charAt(0), hero.name.charAt(0).toUpperCase());

      paragraph.textContent = `$ ${hero.price}`;

      image.src = objectURL;
      image.alt = hero.name;

      main.appendChild(section);
      section.appendChild(image);
      section.appendChild(heading);
      section.appendChild(paragraph);
   }
}