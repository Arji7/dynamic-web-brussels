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

// data ophalen van de api
const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // resultaten opslaan
    allLocations = data.results;

    fillFilter(allLocations);
    fillTable(allLocations);
  } catch (error) {
    // als er iets fout gaat tonen we een foutmelding
    console.error('error:', error);
  }
};

// dropdown vullen met alle categorieën uit de api
const fillFilter = (locations) => {
  const categories = [];

  locations.forEach(location => {
    if (location.visit_category_nl_multi) {
      location.visit_category_nl_multi.forEach(cat => {
        // categorie niet 2 keer toevoegen
        if (!categories.includes(cat)) {
          categories.push(cat);
        }
      });
    }
  });

  // alfabetisch sorteren
  categories.sort();

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
};

// tabel vullen met locaties
const fillTable = (locations) => {
  // eerst leegmaken
  tableBody.innerHTML = '';

  // melding als er niets gevonden is
  if (locations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">Geen resultaten gevonden</td></tr>';
    return;
  }

  locations.forEach(location => {
    // rij aanmaken met template literal
    const row = `
      <tr>
        <td>${location.translations_nl_name ?? 'Onbekend'}</td>
        <td>${location.visit_category_nl_multi ? location.visit_category_nl_multi[0] : 'Onbekend'}</td>
        <td>${location.add_municipality_nl ?? 'Onbekend'}</td>
        <td>${location.translations_nl_address_line1 ?? 'Onbekend'}</td>
        <td>${location.visit_category_nl_multi ? location.visit_category_nl_multi.join(', ') : 'Onbekend'}</td>
        <td>${location.translations_fr_website ? `<a href="${location.translations_fr_website}" target="_blank">Website</a>` : 'Geen website'}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
};

// zoeken en filteren combineren
const filterAndSearch = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedFilter = filterSelect.value;

  // alleen locaties tonen die overeenkomen
  const filtered = allLocations.filter(location => {
    const name = location.translations_nl_name?.toLowerCase() ?? '';

    // checken of naam overeenkomt met zoekterm
    const matchesSearch = searchTerm === '' ? true : name.includes(searchTerm);

    // checken of categorie overeenkomt met filter
    const matchesFilter = selectedFilter === '' ? true :
      location.visit_category_nl_multi?.includes(selectedFilter);

    return matchesSearch && matchesFilter;
  });

  fillTable(filtered);
};

// sorteren op naam of gemeente
const sortLocations = () => {
  const sortValue = sortSelect.value;

  // kopie maken zodat de originele array niet wijzigt
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