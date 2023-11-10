FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install ffmpeg
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y curl
RUN apt-get install -y chromium

# Install other dependencies
RUN npm install -g turbo
RUN npm install -g pnpm

ENV NODE_ENV=production

# Setup app
COPY . .

RUN pnpm fetch
RUN pnpm install

RUN turbo run build --filter=@ghostwriter/server


# Get some assets
RUN curl https://one-time-link.netlify.app/video/mirage-vp9.mp4 -o video.mp4

CMD [ "pnpm", "start" ]

