# Etapa 1: Construir a aplicação Angular
FROM node:16 as build-step

WORKDIR /app

# Copiar os arquivos de dependência e instalar as dependências
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copiar o restante dos arquivos da aplicação
COPY . .

# Construir a aplicação Angular para produção
RUN npm run build -- --output-path=./dist/out

# Etapa 2: Servir a aplicação Angular com Nginx
FROM nginx:alpine

COPY --from=build-step /app/dist/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
