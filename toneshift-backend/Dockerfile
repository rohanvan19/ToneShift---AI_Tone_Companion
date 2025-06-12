FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose API port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=5000

# # Command to run the application
# CMD ["npm", "start"]

# Start the server
CMD ["node", "src/index.js"]