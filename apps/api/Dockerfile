FROM node:14.0.0

WORKDIR /app

COPY . /app

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 15000

CMD [ "npm" , "run", "start" ]