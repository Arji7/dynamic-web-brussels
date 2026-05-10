// Auteur: Ayoub Rajouai
// Datum: april 2026
// Bron API: https://opendata.brussels.be
// AI assistent: Claude (Anthropic)

import './style.css';

// link naar de api
const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100';

// html elementen ophalen
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

// hier sla ik alle locaties op zodat ik ze later kan gebruiken
let allLocations = [];

// favorieten ophalen uit localstorage of lege array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// data ophalen van de api
const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allLocations = data.results;

    fillFilter(allLocations);
    fillTable(allLocations);
  } catch (error) {
    console.error('error:', error);
  }
};

// dropdown vullen met alle categorieën uit de api
const fillFilter = (locations) => {
  const categories = [];

  locations.forEach(location => {
    if (location.visit_category_nl_multi) {
      location.visit_category_nl_multi.forEach(cat => {
        if (!categories.includes(cat)) {
          categories.push(cat);
        }
      });
    }
  });

  categories.sort();

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
};

// observer api - fade in effect bij scrollen
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// tabel vullen met locaties
const fillTable = (locations) => {
  tableBody.innerHTML = '';

  if (locations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Geen resultaten gevonden</td></tr>';
    return;
  }

  locations.forEach(location => {
    // checken of locatie al favoriet is
    const isFav = favorites.includes(location.id);
    const star = isFav ? '★' : '☆';

    const row = `
      <tr>
        <td>${location.translations_nl_name ?? 'Onbekend'}</td>
        <td>${location.visit_category_nl_multi ? location.visit_category_nl_multi[0] : 'Onbekend'}</td>
        <td>${location.add_municipality_nl ?? 'Onbekend'}</td>
        <td>${location.translations_nl_address_line1 ?? 'Onbekend'}</td>
        <td>${location.visit_category_nl_multi ? location.visit_category_nl_multi.join(', ') : 'Onbekend'}</td>
        <td>${location.translations_fr_website ? `<a href="${location.translations_fr_website}" target="_blank">Website</a>` : 'Geen website'}</td>
        <td><button class="fav-btn" data-id="${location.id}">${star}</button></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // event listeners toevoegen aan favorieten knoppen
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  // observer toevoegen aan elke rij voor fade-in effect
  document.querySelectorAll('tbody tr').forEach(row => {
    observer.observe(row);
  });
};

// favoriet toggle (toevoegen of verwijderen)
const toggleFavorite = (event) => {
  const id = event.target.dataset.id;

  // checken of al favoriet is
  if (favorites.includes(id)) {
    // verwijderen uit favorieten
    favorites = favorites.filter(favId => favId !== id);
  } else {
    // toevoegen aan favorieten
    favorites.push(id);
  }

  // opslaan in localstorage
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // tabel opnieuw tonen
  filterAndSearch();
};

// zoeken en filteren combineren
const filterAndSearch = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedFilter = filterSelect.value;

  const filtered = allLocations.filter(location => {
    const name = location.translations_nl_name?.toLowerCase() ?? '';
    const matchesSearch = searchTerm === '' ? true : name.includes(searchTerm);
    const matchesFilter = selectedFilter === '' ? true :
      location.visit_category_nl_multi?.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  fillTable(filtered);
};

// sorteren op naam of gemeente
const sortLocations = () => {
  const sortValue = sortSelect.value;

  const sorted = [...allLocations].sort((a, b) => {
    if (sortValue === 'naam') {
      return (a.translations_nl_name ?? '').localeCompare(b.translations_nl_name ?? '');
    } else if (sortValue === 'gemeente') {
      return (a.add_municipality_nl ?? '').localeCompare(b.add_municipality_nl ?? '');
    }
    return 0;
  });

  fillTable(sorted);
};

// luisteren naar zoek, filter en sort
searchInput.addEventListener('input', filterAndSearch);
filterSelect.addEventListener('change', filterAndSearch);
sortSelect.addEventListener('change', sortLocations);

// app starten
fetchData();