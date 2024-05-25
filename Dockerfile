FROM node:20-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm ci
RUN npm run build
RUN rm -rf node_modules
RUN npm install -g http-server-spa

EXPOSE 3000
CMD [ "http-server-spa", "dist", "index.html", "3000" ]
