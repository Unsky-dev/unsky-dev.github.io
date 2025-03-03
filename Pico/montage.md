# Matériel

- Raspberry Pi Pico W 
- Bande LED (avec bon volt)
- MOSFET IRLB8721 (contrôle le passage du courant)
- Résistance de 220Ω (pour protéger la gate du MOSFET)
- Alimentation (12V ou 24V voir sur notre fiche)
- Fils de connexion (pour connecter le Pico, le MOSFET et la bande LED)


# Montage 
## Alimentation de la bande LED

+de l'alimentation → + de la bande LED
-de l'alimentation → GND de la bande LED

## Contrôle avec le MOSFET

Drain du MOSFET → - de la bande LED
Source du MOSFET → GND commun (à la fois l'alimentation - et le GND du Pico)
Commande PWM depuis le Pico W

Broche PWM (GP15) → Résistance 220Ω → Gate du MOSFET
GND commun

GND du Pico W → relié directement au GND de l'alimentation

# Carte SD

https://www.instructables.com/Raspberry-Pi-Pico-Micro-SD-Card-Interface/