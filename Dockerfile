# FROM node:14.21.3

# WORKDIR /usr/src/app

# # copy package management specs
# COPY ./app/package.json ./
# COPY ./app/package-lock.json ./

# # Installs all packages
# RUN npm install

# # copy remaining assets
# COPY . .

# EXPOSE 3000

# # Runs the dev npm script to build & start the server
# CMD npm run start

FROM node:14.21.3

WORKDIR /app

# copy package management specs
COPY app/package.json ./
COPY app/package-lock.json ./

# Installs all packages
RUN npm install

# copy remaining assets
COPY app .

# EXPOSE 3000

ENV NODE_ENV=production

# Runs the dev npm script to build & start the server
CMD npm run start
