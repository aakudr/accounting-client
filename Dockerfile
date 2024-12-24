FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN corepack enable pnpm && pnpm i
COPY . .
RUN pnpm build

FROM docker.io/nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
