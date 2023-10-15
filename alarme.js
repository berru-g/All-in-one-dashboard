<div>
    <p>TRB: <span id="prix-trb"></span></p>
    <audio id="audio" controls>
      <source src="https://github.com/berru-g/console-play-music/raw/master/son/FL_HHL_Green_078_Guitars.wav" type="audio/mpeg">
      Votre navigateur ne supporte pas l'élément audio.
    </audio>
  </div>
<script>
  const coinGeckoURL = "https://api.coingecko.com/api/v3/simple/price";
  const params = {
    ids: "worldcoin-wld",
    vs_currencies: "usd",
  };
  
  const seuilSuperieur = 1.85; 
  const seuilInferieur = 1.75; 
  
  const prixTRBElement = document.getElementById("prix-trb");
  const audioElement = document.getElementById("audio");
  
  function fetchPrixTRB() {
    fetch(`${coinGeckoURL}?${new URLSearchParams(params)}`)
      .then((response) => response.json())
      .then((data) => {
        const prixTRB = data.["worldcoin-wld"].usd;
        prixTRBElement.textContent = prixTRB + " USD";
  
        if (prixTRB > seuilSuperieur) {
          console.log("Gain");
          audioElement.play();
          document.querySelector('body').style.backgroundColor = 'lightgreen';
        } else if (prixTRB < seuilInferieur) {
          console.log("Perte");
          audioElement.play();
          document.querySelector('body').style.backgroundColor = 'lightcoral';
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données de CoinGecko:", error);
      });
  }
  
  setInterval(fetchPrixTRB, 10000); 
  fetchPrixTRB(); 
</script>  