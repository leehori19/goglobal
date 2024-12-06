# Use Node.js LTS version
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files (package.json and yarn.lock, if available)
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the port for the app
EXPOSE 3000

# Install `serve` globally to serve the production build
RUN yarn global add serve

# Run the app with `serve`
CMD ["serve", "-s", "build", "-l", "3000"]