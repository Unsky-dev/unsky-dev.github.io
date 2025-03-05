import network
import socket

# Access Point
SSID = "Pico_Wifi"
PASSWORD = "12345678"
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=SSID, password=PASSWORD)

print("WiFi network created:", SSID)
print("Pico IP:", ap.ifconfig()[0])  # 192.168.4.1

# Web Server
def web_server():
    addr = socket.getaddrinfo("0.0.0.0", 80)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(5)
    print("Server waiting for connections...")

    while True:
        conn, addr = s.accept()
        request = conn.recv(1024).decode("utf-8")
        print("Request received:", request)
        response = ""

        # Get the first line of the request
        try:
            request_line = request.split("\n")[0]
            method, path, _ = request_line.split()
        except Exception:
            conn.close()
            continue

        # Status
        if path == "/status":
            response = "OK"

        # LED control (/led?value=...)
        elif path.startswith("/led?value="):
            try:
                value_str = path.split("led?value=")[1]
                value = int(value_str)
                value = max(0, min(value, 100))  # Limit between 0 and 100
                response = f"LED set to {value}% (simulation)"
            except:
                response = "Value error"

        else:
            response = "Unknown request"

        conn.send("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n" + response)
        conn.close()

web_server()
