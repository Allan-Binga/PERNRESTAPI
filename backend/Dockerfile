##Base image
FROM node:18-alpine AS builder

#WORKING DIRECTORY
WORKDIR /app/backend

COPY package*json ./
#COPY .env ./

#Install dependencies
RUN npm install --production

COPY . .

#Multi stage build
FROM node:18-alpine

WORKDIR /app/backend

# Copy only the node_modules from the build stage
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend ./

CMD [ "npm", "start" ]