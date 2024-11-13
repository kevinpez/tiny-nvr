FROM jrottenberg/ffmpeg:4.3-ubuntu2004

# Install Node.js and debugging tools
RUN apt-get update && \
    apt-get install -y curl net-tools netcat && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080

# Override the ENTRYPOINT set by the base image
ENTRYPOINT []

CMD ["node", "src/index.js"]