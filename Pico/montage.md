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