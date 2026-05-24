# Brussels Explorer

Een interactieve single-page webapplicatie waarmee gebruikers culturele en toeristische locaties in Brussel kunnen verkennen, filteren, sorteren en opslaan als favorieten. Gebouwd met vanilla JavaScript en Vite.

**Auteur:** Ayoub Rajouai  
**Vak:** Web Advanced  
**Datum:** april 2026

---

## Functionaliteiten

- **Data ophalen** van de Brussels Open Data API (100+ locaties)
- **Twee weergavemodi**: tabel en kaarten, met bewaring van voorkeur
- **Zoekfunctie**: zoek locaties op naam
- **Filterfunctie**: filter op categorie (musea, monumenten, bars, enz.)
- **Sorteren**: sorteer op naam (A-Z) of gemeente (A-Z)
- **Favorieten**: sla favoriete locaties op, bewaard tussen sessies via LocalStorage
- **Suggestieformulier**: stel nieuwe locaties voor met formuliervalidatie
- **Responsive design**: werkt op desktop, tablet en mobiel
- **Fade-in animaties**: via IntersectionObserver bij scrollen

---

## Gebruikte API

| API | Link |
|-----|------|
| Brussels Open Data - Culturele & toeristische locaties | [opendata.brussels.be](https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100) |

## Technische vereisten - Implementatie

Hieronder staat per technisch vereiste waar en hoe het concept is toegepast in de code.

### DOM Manipulatie

| Concept | Bestand | Lijn(en) | Beschrijving |
|---------|---------|----------|--------------|
| Elementen selecteren | `src/main.js` | 12-23 | `getElementById` voor alle interactieve elementen (tabel, zoekbalk, knoppen, enz.) |
| Elementen manipuleren | `src/main.js` | 53, 129, 169, 273-276 | `innerHTML` voor tabel/kaarten vullen, `classList.add/remove` voor actieve view, `style.display` voor wisselen |
| Events koppelen | `src/main.js` | 157-159, 203-205, 289-294, 343 | `addEventListener` voor zoeken, filteren, sorteren, favorieten en formulier |

### Modern JavaScript

| Concept | Bestand | Lijn(en) | Beschrijving |
|---------|---------|----------|--------------|
| Constanten (`const`) | `src/main.js` | 9, 12-23 | API URL en DOM-elementen als constanten |
| Template literals | `src/main.js` | 113-114, 142-153, 184-198, 333-338 | HTML opbouwen met backtick-strings en `${}` variabelen |
| Iteratie over arrays (`forEach`) | `src/main.js` | 77-88, 93-98, 136, 176, 332 | Itereren over locaties, categorien en suggesties |
| Array methodes | `src/main.js` | 90 (`sort`), 219 (`filter`), 218 (`includes`), 221 (`push`), 148 (`join`) | Sorteren, filteren, zoeken en samenvoegen van data |
| Arrow functions | `src/main.js` | 35, 52, 73, 128, 168, 214, 230 | Alle functies zijn geschreven als arrow functions |
| Ternary operator | `src/main.js` | 138-139, 179 | `isFav ? '★' : '☆'` voor favoriet-icoon |
| Callback functions | `src/main.js` | 104, 157, 289 | Functies meegegeven aan `forEach`, `addEventListener` en `IntersectionObserver` |
| Promises | `src/main.js` | 57 | `fetch()` retourneert een Promise |
| Async & Await | `src/main.js` | 52, 57-59 | `async` functie `fetchData` met `await fetch()` en `await response.json()` |
| Observer API | `src/main.js` | 102-109 | `IntersectionObserver` voor fade-in animatie bij scrollen |

### Data & API

| Concept | Bestand | Lijn(en) | Beschrijving |
|---------|---------|----------|--------------|
| Fetch | `src/main.js` | 57 | `fetch(API_URL)` om data op te halen van de Brussels API |
| JSON manipuleren | `src/main.js` | 59, 29, 225-226, 326 | `response.json()`, `JSON.parse()` en `JSON.stringify()` |

### Opslag & Validatie

| Concept | Bestand | Lijn(en) | Beschrijving |
|---------|---------|----------|--------------|
| LocalStorage | `src/main.js` | 29, 32, 225, 270, 326, 380 | Favorieten, weergavevoorkeur en suggesties bewaren tussen sessies |
| Formulier validatie | `src/main.js` | 343-383 | Naam (min. 3 tekens), email (regex), suggestie (niet leeg) |

### Styling & Layout

| Concept | Bestand | Lijn(en) | Beschrijving |
|---------|---------|----------|--------------|
| Flexbox | `src/style.css` | 39-42, 84-88, 104-108 | Controls, info-balk en view-toggle layout |
| CSS Grid | `src/style.css` | 187-190 | Kaarten-grid met `auto-fill` en `minmax` |
| Responsive design | `src/style.css` | 361-398 | `@media (max-width: 768px)` voor mobiel |
| Gebruiksvriendelijke elementen | `index.html` | 27-28, 37-39 | Reset-knop, wis-knop, view-toggle knoppen, favoriet-sterren, iconen per categorie |

### Tooling & Structuur

| Concept | Beschrijving |
|---------|--------------|
| Vite | Project opgezet met Vite als build tool (`package.json` lijn 7-9) |
| Folderstructuur | `src/` bevat JavaScript en CSS, `public/` bevat statische bestanden, `index.html` in root |

---

## Installatiehandleiding

### Vereisten
- [Node.js](https://nodejs.org/) (versie 18 of hoger)
- npm (wordt meegeleverd met Node.js)
### Installatie

```bash
# 1. Clone de repository
git clone https://github.com/Arji7/dynamic-web-brussels.git

# 2. Ga naar de projectmap
cd dynamic-web-brussels

# 3. Installeer dependencies
npm install

# 4. Start de ontwikkelserver
npm run dev
```

De applicatie draait nu op `http://localhost:5173`.

### Build voor productie

```bash
npm run build
npm run preview
```

---
## Screenshots

> Voeg hier screenshots toe van de applicatie.
<img width="2824" height="1295" alt="image" src="https://github.com/user-attachments/assets/4524d908-4c99-4ea6-be99-9508bffdf38c" />
<img width="2879" height="1291" alt="image" src="https://github.com/user-attachments/assets/9cf88887-c23c-48a5-bcc8-e3abe8d5cc60" />


### Tabelweergave
<img width="2852" height="1289" alt="image" src="https://github.com/user-attachments/assets/f45728bb-373e-4d33-b1be-c0e5fcf8bba3" />


### Kaartenweergave
<img width="2877" height="1305" alt="image" src="https://github.com/user-attachments/assets/0bd0c137-e4be-40b8-818f-b07a22ac577a" />


### Mobiele weergave
<img width="1084" height="1271" alt="image" src="https://github.com/user-attachments/assets/584f6d68-d190-4a26-9186-523dff520432" />
<img width="1066" height="1109" alt="image" src="https://github.com/user-attachments/assets/a9991f40-fe96-4601-ade2-601786ea4c92" />
<img width="1063" height="1112" alt="image" src="https://github.com/user-attachments/assets/915cd429-4a27-4539-8d29-27fc4cbe9006" />




### Suggestieformulier
<img width="2874" height="1296" alt="image" src="https://github.com/user-attachments/assets/88a269a3-d436-4042-aa91-08fc7879515f" />


---

## Folderstructuur

dynamic-web-brussels/
├── index.html              # Hoofd HTML-bestand
├── package.json            # Project configuratie en scripts
├── public/                 # Statische bestanden
│   └── vite.svg
├── src/
│   ├── main.js             # Alle JavaScript logica
│   └── style.css           # Alle styling
└── README.md               # Dit bestand
```

---

## Gebruikte bronnen

- [Brussels Open Data](https://opendata.brussels.be/) - API voor culturele en toeristische locaties
- [Vite](https://vitejs.dev/) - Build tool en dev server
- [MDN Web Docs](https://developer.mozilla.org/) - Referentie voor JavaScript, CSS en Web API's
- **AI assistent:** Claude (Anthropic) - Gebruikt voor hulp bij ontwikkeling en debugging
