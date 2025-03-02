import network
import socket
from machine import Pin, PWM
import os

#sortie PWM
led = PWM(Pin(15))
led.freq(1000)  # PWM Frequency

# Acces Point
SSID = "Pico_Wifi"
PASSWORD = "12345678"
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=SSID, password=PASSWORD)

print("Réseau WiFi créé :", SSID)
print("IP du Pico :", ap.ifconfig()[0])  # 192.168.4.1

def get_content_type(path):
    if path.endswith(".html"):
        return "text/html"
    elif path.endswith(".webmanifest"):
        return "application/manifest+json"
    elif path.endswith(".json"):
        return "application/json"
    elif path.endswith(".js"):
        return "text/javascript"
    elif path.endswith(".css"):
        return "text/css"
    elif path.endswith(".png"):
        return "image/png"
    elif path.endswith(".jpg") or path.endswith(".jpeg"):
        return "image/jpeg"
    else:
        return "text/plain"

# Web Server
def web_server():
    addr = socket.getaddrinfo("0.0.0.0", 80)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(5)
    print("Serveur en attente de connexions...")

    while True:
        conn, addr = s.accept()
        request = conn.recv(1024).decode("utf-8")
        print("Requête reçue :", request)
        response = ""

        # Récupérer la première ligne de la requête
        try:
            request_line = request.split("\n")[0]
            method, path, _ = request_line.split()
        except Exception as e:
            conn.close()
            continue

        # Status
        if path == "/status":
            response = "OK"
            conn.send("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n" + response)
            conn.close()
            continue

        # 🎛️ LED controle (/led?value=...)
        if path.startswith("/led?value="):
            try:
                value_str = path.split("led?value=")[1]
                value = int(value_str)
                value = max(0, min(value, 100))  # Limite entre 0 et 100
                led.duty_u16(int(value * 65535 / 100))
                response = f"LED réglée à {value}%"
            except:
                response = "Erreur de valeur"
            conn.send("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n" + response)
            conn.close()
            continue


        # 📄 Servir les fichiers statiques de la PWA
        # Si le chemin est "/", servir index.html
        if path == "/":
            path = "/index.html"

        # Enlever les éventuels paramètres de requête
        if "?" in path:
            path = path.split("?")[0]

        # Construire le chemin du fichier sur le système de fichiers (supprimer le "/" initial)
        file_path = path.lstrip("/")

        try:
            with open(file_path, "r") as file:
                file_data = file.read()
            content_type = get_content_type(file_path)
            header = "HTTP/1.1 200 OK\r\nContent-Type: " + content_type + "\r\n\r\n"
            conn.send(header + file_data)
        except Exception as e:
            error_message = "Fichier introuvable"
            header = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\n"
            conn.send(header + error_message)

        conn.close()

web_server()
