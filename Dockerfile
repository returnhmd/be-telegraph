FROM node
WORKDIR /telegraph
COPY . /telegraph
RUN npm install 
EXPOSE 3000
CMD npm start