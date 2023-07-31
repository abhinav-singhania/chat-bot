# Use the official Node.js image as the base image
FROM node:14 as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app's source code
COPY . .

# Build the production version of the app
RUN npm run build

# Use a lightweight server to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
