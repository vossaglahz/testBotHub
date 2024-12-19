FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/locales /usr/share/nginx/html/locales
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
