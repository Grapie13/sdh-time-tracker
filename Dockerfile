FROM node:14-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /app/dist ./dist
CMD ["npm", "run", "start:prod"]