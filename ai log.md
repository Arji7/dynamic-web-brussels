# AI-gebruik log — Brussels Explorer

**Student:** Ayoub Rajouai
**Vak:** Web Advanced
**Periode:** maart 2026 – mei 2026
**AI-assistent:** Claude (Anthropic)
**API:** Brussels Open Data — `lieux_culturels_touristiques_evenementiels_visitbrussels_vbx`

---

## Inleiding

Voor dit project heb ik Claude (Anthropic) gebruikt als hulpmiddel bij het bouwen van Brussels Explorer. AI-gebruik was toegestaan in deze opdracht. Deze log beschrijft eerlijk en gedetailleerd waar ik op AI heb geleund, welke prompts ik daarbij gebruikte, waar ik de leerstof van de lessen heb toegepast, en waar ik volledig zelfstandig heb gewerkt.

Mijn werkwijze was steeds dezelfde: ik probeerde eerst zelf een oplossing te maken op basis van de lesmodules. Pas wanneer ik vastliep op syntax of op een toepassing die nieuw voor mij was, schakelde ik AI in. Na elk antwoord van de AI nam ik de uitleg door zodat ik begreep wat de code deed, voordat ik ze in mijn project gebruikte. De log volgt de chronologische volgorde van mijn commits, zodat duidelijk is hoe het project geleidelijk gegroeid is.

---

## Fase 1 — Projectopzet (8 maart 2026)

**Commits:** `Initial commit`, `chore: setup vite project`, `basis layout gemaakt voor brussels explorer`

Ik ben begonnen met het opzetten van een Vite-project, zoals we dat in module 9 hebben gezien. In de terminal heb ik de stappen `npm create vite@latest`, `npm install` en `npm run dev` uitgevoerd. Vite genereert standaard een aantal voorbeeldbestanden (`counter.js`, een Vite-logo, demo-code in `main.js`). Die heb ik opgeschoond zodat ik met een propere basis kon beginnen.

Daarna heb ik in `index.html` de eerste structuur van mijn applicatie opgebouwd: een `<h1>` titel, een `<input>` voor de zoekbalk, een `<select>` voor het filter en een lege `<table>` met `<thead>` en `<tbody>`. De `<meta viewport>` tag heb ik bewust toegevoegd met het oog op responsive design later.

**AI gebruikt:** Nee. Dit deel heb ik volledig zelfstandig gedaan op basis van module 9 (Vite, npm, projectstructuur) en mijn bestaande HTML-kennis.

---

## Fase 2 — Basis HTML & CSS (21 maart 2026)

**Commits:** `HTML opgeschoond en basis CSS toegevoegd`, `Comments toegevoegd`

In deze fase heb ik de HTML verder opgeschoond en een eerste versie van `style.css` geschreven. Ik heb de body voorzien van een lettertype, een achtergrondkleur en padding, en `box-sizing: border-box` ingesteld via de universele selector. Voor de `.controls` div heb ik flexbox gebruikt zodat de zoekbalk, het filter en de knoppen netjes naast elkaar staan, wat we in module 1 hebben gezien.

Tot slot heb ik comments toegevoegd bovenaan elk bestand (`main.js`, `index.html`, `style.css`) met mijn naam, de datum, de API-bron en de vermelding van de AI-assistent.

**AI gebruikt:** Nee. Volledig zelf geschreven op basis van module 1 (basis HTML, basis CSS, flexbox).

---

## Fase 3 — API-koppeling met fetch en async/await (22 maart 2026)

**Commits:** `API koppeling: data ophalen en tabel vullen met fetch en async/await`, `Bronvermelding toegevoegd aan alle bestanden`

Dit was een van de moeilijkste delen van het project. De theorie rond `fetch`, `async/await`, `try/catch` en het verwerken van een JSON-respons kende ik uit module 5 en module 6. Op basis daarvan heb ik zelf een eerste opzet van een asynchrone functie gemaakt.

Waar ik vastliep, was bij de echte Brussels Open Data API. Ik wist niet hoe de JSON-structuur van die API eruitzag, en de veldnamen waren in het Nederlands en niet voor de hand liggend (`translations_nl_name`, `visit_category_nl_multi`, `add_municipality_nl`, `translations_nl_address_line1`). Ik kon dus wel data ophalen, maar ik wist niet welke velden ik moest aanspreken om naam, categorie, gemeente en adres te tonen.

**Prompt die ik gebruikte:**
> "Ik haal data op van de Brussels open data API met fetch en async/await, maar ik snap de JSON structuur niet. Welke veldnamen moet ik gebruiken om de naam, categorie en gemeente van een locatie te tonen? En hoe vul ik daarmee een tabel?"

Claude legde uit hoe ik de respons met `await response.json()` omzet, hoe `data.results` de array met locaties bevat, en welke veldnamen overeenkomen met naam, categorie, gemeente en adres. De async/await structuur en de `try/catch` foutafhandeling had ik zelf al, de specifieke API-details kwamen met hulp van AI.

Resultaat (vereenvoudigd):
```javascript
const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    allLocations = data.results;
    fillFilter(allLocations);
    render(allLocations);
  } catch (error) {
    console.error('error:', error);
  }
};
```

**AI gebruikt:** Ja — API-veldnamen en JSON-structuur waren onbekend. De async/await-logica deed ik op basis van module 5 en 6.

---

## Fase 4 — Filter en zoekfunctie (12 april 2026)

**Commit:** `Update main.js`

In deze grote update heb ik de interactiviteit toegevoegd: een filterdropdown die automatisch gevuld wordt met de categorieën uit de API-data, en een zoekfunctie die in de naam van de locaties zoekt. Hier heb ik vooral op AI geleund.

De array methodes `.filter()`, `.includes()`, `.forEach()` en `.sort()` kende ik uit module 2. Maar twee dingen waren te complex om volledig zelf te schrijven: (1) de dropdown automatisch vullen met alleen de unieke categorieën uit de data, en (2) zoeken en filteren correct laten samenwerken in één functie.

**Prompt voor de filterdropdown (`fillFilter`):**
> "Hoe maak ik een dropdown die automatisch gevuld wordt met de unieke categorieën uit mijn API data? Sommige locaties hebben meerdere categorieën in een array, en ik wil geen dubbele waarden in de dropdown."

Claude liet zien hoe ik met een geneste `forEach` door de locaties en hun categorie-arrays kon lopen, en met `.includes()` kon controleren of een categorie al toegevoegd was voordat ik ze met `.push()` in een lijst zette. Deze methodes komen uit module 2, maar het combineren ervan op mijn geneste API-structuur was nieuw.

```javascript
locations.forEach(location => {
  if (location.visit_category_nl_multi) {
    location.visit_category_nl_multi.forEach(cat => {
      if (!categories.includes(cat)) {
        categories.push(cat);
      }
    });
  }
});
```

**Prompt voor de zoek- en filterfunctie (`filterAndSearch`):**
> "Hoe combineer ik een zoekbalk en een filterdropdown in één functie, zodat ze samen werken? Dus dat ik kan zoeken binnen een gefilterde lijst."

Claude legde uit hoe ik één `.filter()` kon gebruiken met twee condities (een match op zoekterm én een match op filter), en hoe optionele chaining (`?.`) helpt wanneer een locatie geen categorie of naam heeft. Ik heb de uitleg nadien doorgenomen zodat ik begrijp waarom de twee condities met `&&` gecombineerd worden.

**AI gebruikt:** Ja — combinatie van array methodes op de API-data (`fillFilter`) en de correcte combinatie van filter en zoek (`filterAndSearch`). De onderliggende methodes komen uit module 2.

---

## Fase 5 — Sorteren (7 mei 2026)

**Commit:** `Sorteren op naam en gemeente`

Voor het sorteren heb ik een `<select>` in HTML toegevoegd met de opties "Naam A-Z" en "Gemeente A-Z", en in JavaScript de `sortLocations` functie geschreven. Dit heb ik zelf gedaan op basis van module 2, waar we `.sort()` met een vergelijkingsfunctie hebben gezien. Voor het alfabetisch sorteren van tekst gebruikte ik `.localeCompare()`, en met de spread operator `[...allLocations]` maakte ik een kopie zodat ik de originele array niet wijzigde.

```javascript
const sorted = [...allLocations].sort((a, b) => {
  return (a.translations_nl_name ?? '').localeCompare(b.translations_nl_name ?? '');
});
```

**AI gebruikt:** Nee — zelf geschreven met de lesnotities (module 2: array methodes, sort, localeCompare, spread operator).

---

## Fase 6 — Favorieten met localStorage (7 mei 2026)

**Commit:** `favorieten knop met localstorage`

Het favorietensysteem heb ik grotendeels zelf opgebouwd. localStorage is uitgebreid behandeld in module 8, en het patroon van `setItem`, `getItem`, `JSON.stringify` en `JSON.parse` kende ik daaruit. Ik heb zelf de logica geschreven om bij het opstarten de favorieten uit localStorage te halen (`JSON.parse(localStorage.getItem('favorites')) || []`), om een locatie toe te voegen of te verwijderen, en om de lijst telkens op te slaan.

Elke ster-knop kreeg een `data-id` attribuut met het ID van de locatie. Het enige waar ik AI voor gebruikte, was begrijpen hoe ik bij een klik op de knop wist over welke locatie het ging.

**Prompt die ik gebruikte:**
> "Ik heb voor elke locatie een knop met een data-id. Hoe weet ik bij het klikken op zo'n knop welke locatie het is, zodat ik die kan toevoegen aan mijn favorieten?"

Claude legde uit dat je het ID kunt uitlezen via `event.target.dataset.id`. Dat is DOM-event-kennis uit module 1, maar het `dataset`-concept had ik nog niet zelf toegepast. De rest van de favorietenlogica (de array-bewerking met `.includes()` en `.filter()`, en het opslaan in localStorage) heb ik zelf geschreven.

```javascript
const toggleFavorite = (event) => {
  const id = event.target.dataset.id;
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
};
```

**AI gebruikt:** Deels — alleen het `dataset.id` concept. localStorage en de array-logica zelf gedaan (module 8 en module 1).

---

## Fase 7 — IntersectionObserver (10 mei 2026)

**Commit:** `fade in effect met observer api`

Voor het geavanceerde concept koos ik de `IntersectionObserver`, die we kort in module 8.4 hebben gezien. Het doel was dat tabelrijen en kaarten zacht inzweven wanneer ze in beeld komen tijdens het scrollen. De theorie begreep ik, maar ik had nog nooit zelf een observer geschreven en de syntax was me onduidelijk.

**Prompt die ik gebruikte:**
> "Ik wil dat mijn tabelrijen en kaarten met een fade-in effect verschijnen wanneer ze in beeld komen tijdens het scrollen. Hoe gebruik ik de IntersectionObserver hiervoor en hoe koppel ik die aan mijn elementen?"

Claude liet zien hoe je een observer aanmaakt met `new IntersectionObserver()`, hoe de callback met `entries` werkt, hoe je met `entry.isIntersecting` controleert of een element zichtbaar is, en hoe je een CSS-klasse toevoegt op dat moment. Ook de `threshold` optie werd uitgelegd. Ik koppel de observer aan elke rij en kaart met `.observe()`.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
```

De bijhorende CSS voor het effect heb ik zelf geschreven:
```css
tbody tr {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
tbody tr.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**AI gebruikt:** Ja — de syntax en toepassing van de IntersectionObserver had ik nog niet zelf gedaan. De CSS deed ik zelf. Concept uit module 8.4.

---

## Fase 8 — Formulier met validatie (10 mei 2026)

**Commit:** `formulier voor suggesties met validatie`

Onderaan de pagina heb ik een formulier toegevoegd waarmee gebruikers een locatie kunnen suggereren, met validatie op naam, email en suggestie. Het formulier in HTML, de basis validatielogica en het opslaan van de ingediende suggesties in localStorage heb ik zelf geschreven.

Ik schreef zelf de controles voor de naam (minimum 3 tekens met `.trim().length`) en voor de suggestie (niet leeg). Bij elke fout toon ik een melding in een `<span>` naast het veld, en alleen als alles geldig is wordt de suggestie opgeslagen. De preventie van het standaard verzenden deed ik met `e.preventDefault()`.

Het enige onderdeel waar ik AI voor gebruikte, was de email-validatie. Ik wist niet hoe ik moest controleren of een ingevoerde tekst een geldig emailadres is.

**Prompt die ik gebruikte:**
> "Hoe controleer ik in JavaScript of een ingevoerd emailadres geldig is? Ik wil een foutmelding tonen als het geen geldig email is."

Claude gaf de reguliere expressie `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` en legde uit hoe `.test()` controleert of de invoer aan het patroon voldoet. De rest van het validatiesysteem en de localStorage-opslag van de suggesties heb ik zelf geschreven op basis van module 8.

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(emailInput.value)) {
  document.getElementById('email-error').textContent = 'Geen geldig email adres';
  valid = false;
}
```

**AI gebruikt:** Deels — alleen de email regex (kon ik niet zelf bedenken). De basisvalidatie en localStorage zelf gedaan (module 8, module 1).

---

## Fase 9 — Responsive design en styling (18 mei 2026)

**Commits:** `responsive design voor mobiel`, `nieuwe styling met belgische kleuren`

De volledige styling en het responsive gedrag heb ik grotendeels zelf gemaakt. Ik heb media queries geschreven voor schermen kleiner dan 768px: de controls worden dan onder elkaar geplaatst, het kaarten-grid valt terug naar één kolom en de tabel krijgt horizontaal scrollen. Dit alles op basis van module 1.

Het idee om Belgische kleuren te gebruiken — zwart (`#1a1a1a`), geel (`#fdda24`) en rood (`#ef3340`) — was mijn eigen keuze, passend bij een Brussels project. Ook de hover-effecten op de tabelrijen en kaarten, en de schaalanimatie op het ster-icoontje, heb ik zelf geschreven.

E�n specifiek CSS-probleem heb ik met AI opgelost. In de kaarten wilde ik dat de footer (met de website-link en de favorietenknop) altijd onderaan de kaart staat, ook als de ene kaart meer tekst bevat dan de andere.

**Prompt die ik gebruikte:**
> "Hoe zorg ik dat de footer van mijn kaart altijd onderaan blijft staan, ook als de inhoud van de kaarten verschilt in hoogte?"

Claude legde uit dat je de kaart als flex-container met `flex-direction: column` instelt, de body laat groeien met `flex-grow: 1`, en de footer met `margin-top: auto` naar beneden duwt.

```css
.card {
  display: flex;
  flex-direction: column;
}
.card-footer {
  margin-top: auto;
}
```

**AI gebruikt:** Grotendeels nee — design, kleurkeuze en responsive design waren mijn eigen werk (module 1). Alleen de card-footer flex-trick met AI.

---

## Fase 10 — Kaartenweergave, reset en favorietenteller (19 mei 2026)

**Commits:** `kaarten weergave toegevoegd met switch knop`, `reset knop en favorieten teller toegevoegd`

De tweede weergave — kaarten naast de tabel — was mijn eigen idee om de data visueel aantrekkelijker te tonen. Ik schreef zelf de HTML-template van de kaarten, de `switchView` functie die wisselt tussen tabel en kaarten, en het bewaren van die voorkeur in localStorage (module 8). Ook de reset-knop (die zoekterm, filter en sortering wist) en de informatiebalk met `updateCounts` (template literals voor het aantal locaties en favorieten) heb ik zelf gemaakt.

Voor één klein onderdeel gebruikte ik AI: de `getIcon` functie, die een passend emoji-icoon teruggeeft op basis van het type locatie (museum, monument, bar, …). Ik kon dit met losse `if`-statements wel zelf, maar wilde een nettere, efficiëntere structuur.

**Prompt die ik gebruikte:**
> "Ik wil een ander emoji icoontje tonen afhankelijk van het type locatie (museum, bar, monument...). Hoe schrijf ik daar een nette functie voor zonder een enorme if-else lijst?"

Claude stelde een arrow function voor die het type eerst naar kleine letters zet met `.toLowerCase()` en dan met `.includes()` controleert op trefwoorden, met een standaardicoon als niets matcht. Dat sluit aan bij module 2 (array/string methodes) en module 3 (arrow functions).

```javascript
const getIcon = (type) => {
  if (!type) return 'pin';
  const t = type.toLowerCase();
  if (t.includes('musea') || t.includes('museum')) return 'museum';
  // ... overige types
  return 'pin';
};
```

**AI gebruikt:** Deels — alleen de `getIcon` functie (efficiënte structuur gevraagd). De rest (kaarten, switchView, reset, teller, localStorage) zelf gedaan.

---

## Fase 11 — Bugfix sortering (23 mei 2026)

**Commit:** `sortering werkt nu samen met filter en zoekfunctie`

Tijdens het testen merkte ik zelf een bug: wanneer ik eerst op een categorie filterde en daarna sorteerde, verdwenen de gefilterde resultaten en kreeg ik weer alle locaties te zien. De sortering negeerde dus de actieve filter en zoekterm.

**Prompt die ik gebruikte:**
> "Als ik eerst filter op bijvoorbeeld musea en dan sorteer op naam, verdwijnt mijn filter en zie ik weer alle locaties. Hoe zorg ik dat sorteren samen werkt met mijn filter en zoekfunctie?"

Claude analyseerde mijn code en legde uit dat mijn `sortLocations` rechtstreeks `render(sorted)` aanriep, waardoor de gefilterde staat omzeild werd. De oplossing was om de gesorteerde lijst op te slaan in `allLocations` en daarna `filterAndSearch()` aan te roepen, zodat de volledige keten van filteren en zoeken opnieuw doorlopen wordt op de gesorteerde data.

```javascript
// Voor:
render(sorted);

// Na:
allLocations = sorted;
filterAndSearch();
```

**AI gebruikt:** Ja — de bug werd met hulp van AI geïdentificeerd en opgelost.

---

## Samenvatting AI-gebruik

| Onderdeel | AI gebruikt? | Reden |
|---|---|---|
| Vite project opzetten | Nee | Zelf gedaan via lesnotities module 9 |
| Basis HTML layout | Nee | Zelf geschreven |
| Basis CSS | Nee | Zelf geschreven |
| fetchData met async/await | Ja | API veldnamen en structuur onbekend |
| fillFilter met forEach | Ja | Combinatie van array methodes op API data |
| filterAndSearch | Ja | Correcte combinatie van filter en zoek |
| sortLocations (basis) | Nee | Zelf geschreven met lesnotities |
| Favorieten systeem | Deels | dataset.id concept via AI |
| localStorage | Nee | Uit lesnotities module 8 |
| IntersectionObserver | Ja | Syntax en toepassing nog niet zelf gedaan |
| Form validatie (basis) | Nee | Zelf geschreven |
| Email regex | Ja | Niet zelf kunnen bedenken |
| Responsive design | Nee | Zelf geschreven |
| Belgische kleuren/design | Nee | Eigen keuze en idee |
| Card footer flex-trick | Ja | Specifiek CSS probleem |
| getIcon functie | Ja | Efficiënte structuur gevraagd |
| Bug fix sortering | Ja | Bug geïdentificeerd met hulp van AI |

---

## Conclusie

Ik heb Claude ingezet als ondersteuning bij de delen die nieuw of complex voor mij waren: de specifieke API-details van de Brussels Open Data API, het combineren van filter en zoek, de IntersectionObserver, de email regex, een specifiek CSS flex-probleem, de structuur van de getIcon functie en het oplossen van een bug. Bij elk van die delen heb ik de uitleg van de AI doorgenomen en de concepten teruggekoppeld aan de leerstof uit de modules, zodat ik begrijp wat de code doet.

De projectopzet met Vite, de volledige HTML-structuur, het design en de Belgische kleurkeuze, het responsive design, het sorteren, het favorietensysteem met localStorage, de basisvalidatie van het formulier en de kaartenweergave heb ik zelfstandig geschreven op basis van de lessen. Het project is geleidelijk gegroeid over verschillende dagen, wat ook terug te zien is in de spreiding van mijn commits van maart tot mei.
