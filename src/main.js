// Auteur: Ayoub Rajouai
// Datum: april 2026
// Bron API: https://opendata.brussels.be
// AI assistent: Claude (Anthropic)

import './style.css';

// CONST - api url als constante zodat die niet per ongeluk verandert
const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100';

// DOM MANIPULATIE - elementen selecteren via getElementById
const tableBody = document.getElementById('table-body');
const tableView = document.getElementById('table-view');
const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
const viewTableBtn = document.getElementById('view-table');
const viewCardsBtn = document.getElementById('view-cards');
const resetBtn = document.getElementById('reset-btn');
const clearFavsBtn = document.getElementById('clear-favs-btn');
const resultsCount = document.getElementById('results-count');
const favsCount = document.getElementById('favs-count');

// alle opgehaalde locaties bijhouden
let allLocations = [];

// LOCALSTORAGE - favorieten laden uit vorige sessie, of lege array als er geen zijn
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// LOCALSTORAGE - gebruikersvoorkeur voor weergave onthouden tussen sessies
let currentView = localStorage.getItem('view') || 'table';

// ARROW FUNCTION + TERNARY OPERATOR - juist icoon kiezen op basis van het type locatie
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

// FETCH + ASYNC/AWAIT + PROMISES - data ophalen van de Brussels Open Data API
const fetchData = async () => {
  tableBody.innerHTML = '<tr><td colspan="7">Data wordt geladen...</td></tr>';

  try {
    // fetch geeft een promise terug, await wacht op het resultaat
    const response = await fetch(API_URL);
    // JSON manipuleren - response omzetten naar javascript object
    const data = await response.json();

    allLocations = data.results;

    fillFilter(allLocations);
    render(allLocations);
  } catch (error) {
    // DOM manipulatie - foutmelding tonen in de tabel
    tableBody.innerHTML = '<tr><td colspan="7">Fout bij ophalen data</td></tr>';
    console.error('error:', error);
  }
};

// FOREACH + ARRAY METHODE - dropdown vullen met unieke categorieën uit de data
const fillFilter = (locations) => {
  const categories = [];

  // forEach itereert over alle locaties
  locations.forEach(location => {
    if (location.visit_category_nl_multi) {
      // geneste forEach om door categorieën per locatie te gaan
      location.visit_category_nl_multi.forEach(cat => {
        // INCLUDES - controleren of categorie al in de lijst staat
        if (!categories.includes(cat)) {
          categories.push(cat);
        }
      });
    }
  });

  // SORT - categorieën alfabetisch sorteren
  categories.sort();

  // DOM MANIPULATIE - opties toevoegen aan de dropdown
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
};

// OBSERVER API - IntersectionObserver voor fade-in animatie bij scrollen
const observer = new IntersectionObserver((entries) => {
  // CALLBACK FUNCTION - wordt uitgevoerd telkens een element zichtbaar wordt
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// tellers updaten in de info-balk
const updateCounts = (locations) => {
  resultsCount.textContent = `${locations.length} locaties gevonden`;
  favsCount.textContent = `${favorites.length} favorieten ★`;
};

// juiste weergave renderen op basis van huidige keuze
const render = (locations) => {
  updateCounts(locations);
  if (currentView === 'table') {
    fillTable(locations);
  } else {
    fillCards(locations);
  }
};

// DOM MANIPULATIE - tabelrijen dynamisch opbouwen en invoegen
const fillTable = (locations) => {
  tableBody.innerHTML = '';

  if (locations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Geen resultaten gevonden</td></tr>';
    return;
  }

  locations.forEach(location => {
    // TERNARY OPERATOR - ster tonen als locatie al in favorieten zit
    const isFav = favorites.includes(location.id);
    const star = isFav ? '★' : '☆';

    // TEMPLATE LITERAL - HTML string opbouwen met variabelen
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

  // CALLBACK FUNCTION + EVENT - kliklistener koppelen aan elke favoriet-knop
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  // OBSERVER API - rijen registreren voor fade-in animatie
  document.querySelectorAll('tbody tr').forEach(row => {
    observer.observe(row);
  });
};

// DOM MANIPULATIE - kaarten dynamisch genereren en tonen
const fillCards = (locations) => {
  cardsContainer.innerHTML = '';

  if (locations.length === 0) {
    cardsContainer.innerHTML = '<p>Geen resultaten gevonden</p>';
    return;
  }

  locations.forEach(location => {
    const isFav = favorites.includes(location.id);
    // TERNARY OPERATOR - gevulde of lege ster tonen
    const star = isFav ? '★' : '☆';
    const type = location.visit_category_nl_multi ? location.visit_category_nl_multi[0] : 'Onbekend';
    const icon = getIcon(type);

    // TEMPLATE LITERAL - kaart HTML opbouwen
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

  // CALLBACK FUNCTION + EVENT - kliklistener koppelen aan elke favoriet-knop
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  // OBSERVER API - kaarten registreren voor fade-in animatie
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
};

// LOCALSTORAGE - favoriet toevoegen of verwijderen en opslaan
const toggleFavorite = (event) => {
  const id = event.target.dataset.id;

  // ARRAY METHODE (filter) - favoriet verwijderen als het er al in zit
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }

  // LOCALSTORAGE - bijgewerkte lijst opslaan zodat die bewaard blijft
  localStorage.setItem('favorites', JSON.stringify(favorites));
  filterAndSearch();
};

// FILTER + INCLUDES - zoekterm en categorie combineren om resultaten te filteren
const filterAndSearch = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedFilter = filterSelect.value;

  // ARRAY METHODE (filter) + ARROW FUNCTION - alleen matching locaties bijhouden
  const filtered = allLocations.filter(location => {
    const name = location.translations_nl_name?.toLowerCase() ?? '';
    // INCLUDES - controleren of naam de zoekterm bevat
    const matchesSearch = searchTerm === '' ? true : name.includes(searchTerm);
    const matchesFilter = selectedFilter === '' ? true :
      location.visit_category_nl_multi?.includes(selectedFilter);
    // beide voorwaarden moeten kloppen
    return matchesSearch && matchesFilter;
  });

  render(filtered);
};

// SORT ARRAY METHODE - locaties sorteren op naam of gemeente
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

  // gesorteerde lijst opslaan zodat filter daarna nog werkt
  allLocations = sorted;
  filterAndSearch();
};

// wisselen tussen tabel en kaarten, voorkeur opslaan in localStorage
const switchView = (view) => {
  currentView = view;
  // LOCALSTORAGE - weergavevoorkeur onthouden
  localStorage.setItem('view', view);

  // DOM MANIPULATIE - juiste weergave tonen en verbergen
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

// EVENTS + CALLBACK FUNCTIONS - luisteren naar gebruikersacties
searchInput.addEventListener('input', filterAndSearch);
filterSelect.addEventListener('change', filterAndSearch);
sortSelect.addEventListener('change', sortLocations);
viewTableBtn.addEventListener('click', () => switchView('table'));
viewCardsBtn.addEventListener('click', () => switchView('cards'));

// alle filters resetten en volledige lijst opnieuw tonen
resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterSelect.value = '';
  sortSelect.value = '';
  render(allLocations);
});

// LOCALSTORAGE:  alle favorieten wissen na bevestiging
clearFavsBtn.addEventListener('click', () => {
  if (confirm('Ben je zeker dat je alle favorieten wilt wissen?')) {
    favorites = [];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    filterAndSearch();
  }
});

// voorkeurweergave toepassen bij het laden van de pagina
switchView(currentView);

// app opstarten: data ophalen van de API
fetchData();

// FORMULIER VALIDATIE:  invoervelden controleren voor opslaan
const form = document.getElementById('suggestion-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const suggestionInput = document.getElementById('suggestion');
const suggestionsList = document.getElementById('suggestions-list');

// LOCALSTORAGE: eerder ingediende suggesties laden
let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

// DOM MANIPULATIE - opgeslagen suggesties tonen op de pagina
const showSuggestions = () => {
  suggestionsList.innerHTML = '';
  // TEMPLATE LITERAL + FOREACH,  elke suggestie als HTML blok renderen
  suggestions.forEach(s => {
    suggestionsList.innerHTML += `
      <div class="suggestion-item">
        <strong>${s.name}</strong> (${s.email})<br>
        ${s.suggestion}
      </div>
    `;
  });
};

// FORMULIER VALIDATIE:  velden controleren bij indienen
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // foutmeldingen eerst leegmaken
  document.getElementById('name-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('suggestion-error').textContent = '';

  let valid = true;

  // naam moet minstens 3 tekens zijn
  if (nameInput.value.trim().length < 3) {
    document.getElementById('name-error').textContent = 'Naam moet minstens 3 letters hebben';
    valid = false;
  }

  // emailadres valideren met een regex patroon
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    document.getElementById('email-error').textContent = 'Geen geldig email adres';
    valid = false;
  }

  // suggestie mag niet leeg zijn
  if (suggestionInput.value.trim() === '') {
    document.getElementById('suggestion-error').textContent = 'Suggestie mag niet leeg zijn';
    valid = false;
  }

  if (valid) {
    // LOCALSTORAGE: nieuwe suggestie opslaan zodat die bewaard blijft
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

// suggesties tonen bij het laden van de pagina
showSuggestions();