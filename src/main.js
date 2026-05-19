// Auteur: Ayoub Rajouai
// Datum: april 2026
// Bron API: https://opendata.brussels.be
// AI assistent: Claude (Anthropic)

import './style.css';

// link naar de api
const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100';

// html elementen ophalen
const tableBody = document.getElementById('table-body');
const tableView = document.getElementById('table-view');
const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
const viewTableBtn = document.getElementById('view-table');
const viewCardsBtn = document.getElementById('view-cards');

// alle locaties opslaan
let allLocations = [];

// favorieten ophalen uit localstorage of lege array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// huidige weergave (tabel of kaarten) opslaan in localstorage
let currentView = localStorage.getItem('view') || 'table';

// icoon kiezen op basis van type
const getIcon = (type) => {
  if (!type) return '📍';
  const t = type.toLowerCase();
  if (t.includes('musea') || t.includes('museum')) return '🏛️';
  if (t.includes('monument')) return '🗿';
  if (t.includes('bar') || t.includes('caf')) return '🍺';
  if (t.includes('nacht') || t.includes('club')) return '🪩';
  if (t.includes('muziek')) return '🎵';
  if (t.includes('kunst')) return '🎨';
  if (t.includes('podium') || t.includes('theater')) return '🎭';
  if (t.includes('rondleiding')) return '🚶';
  if (t.includes('vergader')) return '💼';
  if (t.includes('attractie')) return '🎢';
  return '📍';
};

// data ophalen van de api
const fetchData = async () => {
  tableBody.innerHTML = '<tr><td colspan="7">Data wordt geladen...</td></tr>';

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allLocations = data.results;

    fillFilter(allLocations);
    render(allLocations);
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="7">Fout bij ophalen data</td></tr>';
    console.error('error:', error);
  }
};

// dropdown vullen met alle categorieën
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

// observer api - fade in effect
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// renderen op basis van huidige view
const render = (locations) => {
  if (currentView === 'table') {
    fillTable(locations);
  } else {
    fillCards(locations);
  }
};

// tabel vullen
const fillTable = (locations) => {
  tableBody.innerHTML = '';

  if (locations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Geen resultaten gevonden</td></tr>';
    return;
  }

  locations.forEach(location => {
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

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  document.querySelectorAll('tbody tr').forEach(row => {
    observer.observe(row);
  });
};

// kaarten vullen
const fillCards = (locations) => {
  cardsContainer.innerHTML = '';

  if (locations.length === 0) {
    cardsContainer.innerHTML = '<p>Geen resultaten gevonden</p>';
    return;
  }

  locations.forEach(location => {
    const isFav = favorites.includes(location.id);
    const star = isFav ? '★' : '☆';
    const type = location.visit_category_nl_multi ? location.visit_category_nl_multi[0] : 'Onbekend';
    const icon = getIcon(type);

    const card = `
      <div class="card">
        <div class="card-icon">${icon}</div>
        <div class="card-body">
          <h3 class="card-title">${location.translations_nl_name ?? 'Onbekend'}</h3>
          <span class="card-type">${type}</span>
          <p class="card-info"><strong>Gemeente:</strong> ${location.add_municipality_nl ?? 'Onbekend'}</p>
          <p class="card-info"><strong>Adres:</strong> ${location.translations_nl_address_line1 ?? 'Onbekend'}</p>
          <div class="card-footer">
            ${location.translations_fr_website ? `<a href="${location.translations_fr_website}" target="_blank">Bezoek website</a>` : '<span>Geen website</span>'}
            <button class="fav-btn" data-id="${location.id}">${star}</button>
          </div>
        </div>
      </div>
    `;
    cardsContainer.innerHTML += card;
  });

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
};

// favoriet toggle
const toggleFavorite = (event) => {
  const id = event.target.dataset.id;

  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  filterAndSearch();
};

// zoeken en filteren
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

  render(filtered);
};

// sorteren
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

  render(sorted);
};

// wisselen tussen tabel en kaarten weergave
const switchView = (view) => {
  currentView = view;
  localStorage.setItem('view', view);

  if (view === 'table') {
    tableView.style.display = 'table';
    cardsContainer.style.display = 'none';
    viewTableBtn.classList.add('active');
    viewCardsBtn.classList.remove('active');
  } else {
    tableView.style.display = 'none';
    cardsContainer.style.display = 'grid';
    viewTableBtn.classList.remove('active');
    viewCardsBtn.classList.add('active');
  }

  filterAndSearch();
};

// event listeners
searchInput.addEventListener('input', filterAndSearch);
filterSelect.addEventListener('change', filterAndSearch);
sortSelect.addEventListener('change', sortLocations);
viewTableBtn.addEventListener('click', () => switchView('table'));
viewCardsBtn.addEventListener('click', () => switchView('cards'));

// voorkeursweergave laden bij start
switchView(currentView);

// app starten
fetchData();

// formulier validatie
const form = document.getElementById('suggestion-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const suggestionInput = document.getElementById('suggestion');
const suggestionsList = document.getElementById('suggestions-list');

let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

const showSuggestions = () => {
  suggestionsList.innerHTML = '';
  suggestions.forEach(s => {
    suggestionsList.innerHTML += `
      <div class="suggestion-item">
        <strong>${s.name}</strong> (${s.email})<br>
        ${s.suggestion}
      </div>
    `;
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  document.getElementById('name-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('suggestion-error').textContent = '';

  let valid = true;

  if (nameInput.value.trim().length < 3) {
    document.getElementById('name-error').textContent = 'Naam moet minstens 3 letters hebben';
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    document.getElementById('email-error').textContent = 'Geen geldig email adres';
    valid = false;
  }

  if (suggestionInput.value.trim() === '') {
    document.getElementById('suggestion-error').textContent = 'Suggestie mag niet leeg zijn';
    valid = false;
  }

  if (valid) {
    suggestions.push({
      name: nameInput.value,
      email: emailInput.value,
      suggestion: suggestionInput.value
    });

    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    showSuggestions();
    form.reset();
  }
});

showSuggestions();