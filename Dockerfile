# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production

# Run the application
CMD ["npm", "run", "start"]
