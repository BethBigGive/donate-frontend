FROM node:12

WORKDIR /usr/src/app

# Do lib metadata copy + install separately, so this part of the build is cached when only app code changes.
# See https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package*.json ./
RUN npm install

# Now copy the app source
COPY . .

# Build client bundle and prepare for Server-Side Rendering
RUN npm run build:ssr

EXPOSE 4000

# Serve with Server-Side Rendering support
CMD [ "npm", "run", "serve:ssr" ]
