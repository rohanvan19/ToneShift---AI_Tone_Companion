FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Install web dependencies
RUN npm install react-native-web react-dom @expo/webpack-config

# Copy application code
COPY . .

# Create assets directory if it doesn't exist
RUN mkdir -p /app/assets/fonts

# Expose the port the app runs on
EXPOSE 19006

# Configure Expo to work in Docker environment
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
# This is crucial - set to 0.0.0.0 to make the dev server accessible outside the container
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
# Set the API URL environment variable
ENV REACT_APP_API_URL=http://toneshift-backend:5000/api

# Start with npm run web as it works for your project
CMD ["npm", "run", "web"]