FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PGHOST=db
ENV PGPORT=5432
ENV PGDATABASE=db
ENV PGUSER=root
ENV PGPASSWORD=root 
ENV PORT=3000
ENV HOST_NAME=localhost

EXPOSE 3000

CMD [ "npm", "run", "start" ]