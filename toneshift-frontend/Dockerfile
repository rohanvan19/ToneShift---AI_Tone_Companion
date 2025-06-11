FROM node:20-slim

WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install dependencies first
COPY package*.json ./
RUN npm install

# Explicitly install web dependencies to make sure they're properly installed
RUN npx expo install react-native-web react-dom @expo/webpack-config

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 19006

# Start the web server, ensure it listens on all interfaces
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Start web server
CMD ["npm", "run", "web", "--", "--host", "0.0.0.0"]