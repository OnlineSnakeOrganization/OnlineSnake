# https://onlinesnakeorganization.github.io/OnlineSnake/ <- Link to Play

For testing with a local backend, create a .env file in the root directory with both of theese Variables:
```
VITE_BACKEND_URL = localhost:3000
#onlinesnakeserver-production.up.railway.app (Public external server URL where one backend is running already)
#localhost:3000 (For when using a backend locally. Port is 3000 by standard)

VITE_USE_SECURE = false
#Set this to true if you run into issues where you need https and wss instead of http and ws.
```
