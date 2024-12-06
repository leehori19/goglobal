# backend/server/Dockerfile
# Use Node.js LTS version
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]

