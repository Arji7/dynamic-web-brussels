// Auteur: Ayoub Rajouai 
// Datum: maart 2026
// Bron API: https://opendata.brussels.be
// AI assistent: Claude (Anthropic) 

// Importeer de CSS styling//
import './style.css';

// URL van de Brussels API
const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100';

// selecteer de tabel body uit de HTML//
const tableBody = document.getElementById('table-body');

// data ophalen van de API met fetch en async/await//
const fetchData = async () => {
  try {
    // api aanroepen//
    const response = await fetch(API_URL);

    //JSON data ophalen uit de response//
    const data = await response.json();

    // Tabel vullen met de opgehaalde data //
    fillTable(data.results);

  } catch (error) {
    console.error('Fout bij ophalen data:', error);
  }
};

// tabel vullen met locaties//
const fillTable = (locations) => {
  // Elke locatie toevoegen als rij in de tabel//
  locations.forEach(location => {
    // Template literal gebruiken voor de HTML van elke rij//
    const row = `
      <tr>
        <td>${location.translations_fr_name ?? 'Onbekend'}</td>
        <td>${location.visit_category_fr_multi ? location.visit_category_fr_multi[0] : 'Onbekend'}</td>
        <td>${location.add_municipality_fr ?? 'Onbekend'}</td>
        <td>${location.translations_fr_address_line1 ?? 'Onbekend'}</td>
        <td>${location.visit_category_fr_multi ? location.visit_category_fr_multi.join(', ') : 'Onbekend'}</td>
        <td>${location.translations_fr_website ? `<a href="${location.translations_fr_website}" target="_blank">Website</a>` : 'Geen website'}</td>
      </tr>
    `;

    // Rij toevoegen aan de tabel//
    tableBody.innerHTML += row;
  });
};

// App opstarten//
fetchData();