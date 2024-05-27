# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy the rest of the backend code
COPY backend/ ./backend/

# Copy frontend build folder
COPY frontend/build ./frontend/build

# Expose ports
EXPOSE 5000 3000

# Install serve globally for serving the frontend
RUN npm install -g serve

# Set up the command to start both backend and frontend
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/build -l 3000"]
