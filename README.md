https://onlinesnakeorganization.github.io/OnlineSnake/ <- Link zum spielen

# ReadMe OnlineSnake - To Do / Was ist zu tun
## Zwischenstand Nr | Datum | Status
## Zwischenstand 1 | 30.01.2025 | Fertig
- Git Repository mit funktionierender CI/CD-Pipeline und GitHub Pages
- 5 Minuten Präsentation pro Gruppe (Repo, Pipeline, Grundidee anhand von Mockup)

## Zwischenstand 2 | 13.03.2025 | Fertig
### Mindestanforderungen Frontend
- Anzeige eines Spielfelds mit einer Schlange
- Bewegungslogik für die Schlange
- Grundlegendes Punktesystem
### Sonstiges
- 10 Minuten Präsentation pro Gruppe (Zwischenstand)

## Zwischenstand 3 | 26.06.2025 | Fertig
### Zusätzliche Mindestanforderungen Frontend
- Spielmechaniken (z. B. Game Over bei Kollision)
- Zusätzliche Features wie Hindernisse oder Level
- Highscoreanzeige
### Mindestanforderungen Backend
- Backend-Repository eingerichtet
- Mindestens 1 Demo-Endpunkt implementiert
- Lokale Ausführung reicht aus
### Sonstiges
- 10 Minuten Präsentation pro Gruppe (Zwischenstand, Funktionsdemo)

## Zwischenstand 4 (Ende) | 10.07.2025 | Zu tun
### Anforderungen Frontend
- Komplett funktionsfähig mit persistenter Datenspeicherung
- Persistente Datenspeicherung
- Unabhängige Datenspeicherung für lokale Tests
### Anforderungen Backend
- Deployment auf einem Server / Serverless
- Web-Security Best-Practices befolgt
- Verbindung Frontend - Backend
### Sonstiges
- Abgabe Quellcode + Dokumentation
- 15 Minuten Präsentation pro Gruppe (Produktvorstellung)

For testing with a local backend, create a .env file in the root directory with theese Variables:
```
VITE_BACKEND_URL = localhost:3000 #localhost:3000 #onlinesnakeserver-production.up.railway.app
VITE_USE_SECURE = false #Set this to true if you need https and wss instead of http and ws. For local testing, false should work fine.
```
