import requests
import time
import pygame

# Configurez l'URL de l'API CoinGecko pour TRB
coin_gecko_url = "https://api.coingecko.com/api/v3/simple/price"
params = {
    "ids": "tellor",
    "vs_currencies": "usd",
}

# Seuils de prix
seuil_superieur = 60  # USD
seuil_inferieur = 45  # USD

# Configuration de la lecture audio
pygame.mixer.init()
mp3_file = "https://github.com/berru-g/console-play-music/raw/master/son/FL_HHL_Green_078_Guitars.wav"  

while True:
    # Effectuer une requête pour obtenir le prix en direct de TRB
    response = requests.get(coin_gecko_url, params=params)
    if response.status_code == 200:
        data = response.json()
        prix_trb = data["tellor"]["usd"]
        print(f"Prix TRB en USD : {prix_trb}")

        # Vérifier si le prix dépasse ou baisse en dessous des seuils
        if prix_trb > seuil_superieur:
            print("TRB a dépassé 60 USD!")
            pygame.mixer.music.load(mp3_file)
            pygame.mixer.music.play()
        elif prix_trb < seuil_inferieur:
            print("TRB est passé en dessous de 45 USD!")
            pygame.mixer.music.load(mp3_file)
            pygame.mixer.music.play()

    else:
        print("Erreur lors de la récupération des données de CoinGecko.")

    time.sleep(300)
