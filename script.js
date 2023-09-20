/*     Fullscreen btn     */
let fullscreen;
let fsEnter = document.getElementById('fullscr');
fsEnter.addEventListener('click', function (e) {
    e.preventDefault();
    if (!fullscreen) {
        fullscreen = true;
        document.documentElement.requestFullscreen();
        
    }
    else {
        fullscreen = false;
        document.exitFullscreen();
       // fsEnter.innerHTML = "Go Fullscreen";
    }
});

// Fonction pour formater une valeur en tant que monnaie avec 2 décimales
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}
console.log('decimal OK');

// Fonction pour mettre à jour les valeurs des crypto-monnaies en temps réel
async function updateCryptoValues() {
    try {
        const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur');
        const btcData = await btcResponse.json();
        document.getElementById('btc-value').textContent = formatCurrency(btcData.bitcoin.eur * 0.0209807);

        const ccResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hifi-finance&vs_currencies=eur');
        const ccData = await ccResponse.json();
        document.getElementById('cc-value').textContent = formatCurrency(ccData.["hifi-finance"].eur * 19.12);
      updateTotal();

        // Mettre à jour les valeurs toutes les 60 secondes
        setTimeout(updateCryptoValues, 60000);
    } catch (error) {
        console.error(error);
    }
}
 /*   const goldResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=#&vs_currencies=eur');
    const goldData = await goldResponse.json();
    document.getElementById('gold-value').textContent = formatCurrency(goldData.gold.eur);
  */
console.log('api OK');

// Fonction pour mettre à jour la date et l'heure en temps réel
function updateDateTime() {
    const now = new Date();
    document.getElementById('date').textContent = now.toLocaleDateString('fr-FR');
   // document.getElementById('time').textContent = now.toLocaleTimeString('fr-FR');
}
console.log('time OK');

function updateTotal() {
    const btcValue = parseFloat(document.getElementById('btc-value').textContent);
    const ccValue = parseFloat(document.getElementById('cc-value').textContent);
    const euroValue = parseFloat(document.getElementById('eur-value').textContent);
  const goldValue = parseFloat(document.getElementById('gold-value').textContent);

    console.log("btcValue:", btcValue);
    console.log("ccValue:", ccValue);
    console.log("euroValue:", euroValue);
    console.log("goldValue:", goldValue);
    console.log('____');
 
    if (!isNaN(btcValue) && !isNaN(ccValue) && !isNaN(euroValue) && !isNaN(goldValue)) {
        const total = btcValue + ccValue + euroValue + goldValue;
      //couille ici
        console.log("total", total);
        document.getElementById('total-value').textContent = formatCurrency(total);
    } else {
        document.getElementById('total-value').textContent = "€";
    }
}

updateCryptoValues();
updateDateTime();
updateTotal();

console.log('Graphique en cours')

// Fonction pour mettre à jour la variation en pourcentage
function updatePercentageChange(baseValue) {
    const btcValue = parseFloat(document.getElementById('btc-value').textContent);
    const ccValue = parseFloat(document.getElementById('cc-value').textContent);
    const euroValue = parseFloat(document.getElementById('eur-value').textContent);
    const goldValue = parseFloat(document.getElementById('gold-value').textContent);

    if (!isNaN(btcValue) && !isNaN(ccValue) && !isNaN(euroValue) && !isNaN(goldValue)) {
        const total = btcValue + ccValue + euroValue + goldValue;

        // Calculer la variation en pourcentage par rapport à la valeur de base
        const percentageChange = ((total - baseValue) / baseValue) * 100;

        const percentageChangeElement = document.getElementById('percentage-change');

        if (percentageChange >= 0) {
            percentageChangeElement.style.color = 'green';
            percentageChangeElement.textContent = `+${percentageChange.toFixed(1)}%`;
        } else {
            percentageChangeElement.style.color = 'red';
            percentageChangeElement.textContent = `${percentageChange.toFixed(1)}%`;
        }
    }
}

// Stocker la valeur de base (ajustez cette valeur selon vos besoins)
const baseValue = 1000; // Ajustez cette valeur en fonction de vore base

async function updateTotalAndPercentage() {
    const btcValue = parseFloat(document.getElementById('btc-value').textContent);
    const ccValue = parseFloat(document.getElementById('cc-value').textContent);
    const euroValue = parseFloat(document.getElementById('eur-value').textContent);
    const goldValue = parseFloat(document.getElementById('gold-value').textContent);

    if (!isNaN(btcValue) && !isNaN(ccValue) && !isNaN(euroValue) && !isNaN(goldValue)) {
        const total = btcValue + ccValue + euroValue + goldValue;

        // Mettre à jour la div "total-value"
        document.getElementById('total-value').textContent = formatCurrency(total);

        // Mettre à jour la variation en pourcentage par rapport à la valeur de base
        updatePercentageChange(baseValue);
    } else {
        document.getElementById('total-value').textContent = "€";
    }
}

// Appeler la fonction initiale
updateTotalAndPercentage();



// Obtenir les données historiques de prix depuis CoinGecko
async function fetchHistoricalData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
    const data = await response.json();
    return data.prices;
  } catch (error) {
    console.error(error);
  }
}
// Créer le graphique
async function createChart() {
  const historicalData = await fetchHistoricalData();

  const chartCanvas = document.getElementById('price-chart');
  const ctx = chartCanvas.getContext('2d');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historicalData.map(entry => new Date(entry[0]).toLocaleDateString()),
      datasets: [{
        label: 'Prix en EUR',
        data: historicalData.map(entry => entry[1]),
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
        fill: 'start',
        lineTension: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Appel pour créer le graphique
createChart();

// Définir le nombre de crypto-cards à afficher par page PAGINATION
const cardsPerPage = 4;

// Récupérer toutes les crypto-cards
const cryptoCards = document.querySelectorAll('.crypto-card');

// Fonction pour afficher les crypto-cards sur une page donnée
function showCardsOnPage(page) {
    cryptoCards.forEach((card, index) => {
        if (index >= (page - 1) * cardsPerPage && index < page * cardsPerPage) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Fonction pour gérer le clic sur le bouton "Page précédente"
function previousPage() {
    currentPage--;
    if (currentPage < 1) {
        currentPage = 1;
    }
    showCardsOnPage(currentPage);
}

// Fonction pour gérer le clic sur le bouton "Page suivante"
function nextPage() {
    currentPage++;
    const totalPages = Math.ceil(cryptoCards.length / cardsPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    showCardsOnPage(currentPage);
}

// Initialisation
let currentPage = 1;
showCardsOnPage(currentPage);

// Ajouter des gestionnaires d'événements pour les boutons de pagination
document.getElementById('previous-button').addEventListener('click', previousPage);
document.getElementById('next-button').addEventListener('click', nextPage);

// MENU via lib sweetalert2
const hamburgerMenu = document.querySelector('.hamburger-menu');

hamburgerMenu.addEventListener('click', () => {
  // Utilisation de SweetAlert pour afficher la fenêtre contextuelle
  Swal.fire({
    title: 'All my wallets',
    html: '<ul><li><a href="https://shop.ledger.com/?r=">Ledger</a></li><li><a href="https://accounts.binance.com/register?ref=">Binance</a></li><li><a href="https://github.com/berru-g/">Adress</a></li><li><a href="#">APR 24H</a></li></ul>',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'custom-swal-popup',
      closeButton: 'custom-swal-close-button',
      content: 'custom-swal-content',
    }
  });
});
// NAVBAR
const searchIcon = document.getElementById('search-icon');
const searchContainer = document.querySelector('.search-container');

searchIcon.addEventListener('click', (e) => {
  searchContainer.classList.toggle('visible'); // Toggle la classe visible
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  const isClickedOutside = !searchContainer.contains(e.target) && e.target !== searchIcon;

  if (isClickedOutside) {
    searchContainer.classList.remove('visible'); // Retire la classe visible
  }
});


//info
const infoButton = document.getElementById('infoButton');
infoButton.addEventListener('click', () => {
Swal.fire({
  icon: 'info',
  title: 'Vos donnees sont en sécurite !',
  text: "Aucune information est scrappee ou recupere sur vos comptes, le calcul est effectue via une API sans compte, de vos crypto en fonction du nombre en votre possession, précisé dans le script dans constnomcryptoResponse.",
  confirmButtonText: "Ok",
  confirmButtonColor: '#3fc3ee',
});
});