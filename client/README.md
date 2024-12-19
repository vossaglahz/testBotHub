## Для запуска кода, необходимо сделать
```
  git init
```
```
  git clone https://gitlab.com/ajs-17-team-1/frontend
```
```
  npm install
```
```
  npm run dev
```
## Для запуска кода через Docker, необходимо сделать
```
  docker build -t frontend .
```
```
  docker run -d -p 8080:8080 --name frontend frontend 
```
## .env
```
VITE_API_BACK_URL="http://localhost:8000"
```