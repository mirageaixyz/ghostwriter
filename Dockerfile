FROM node:latest

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g turbo
RUN npm install -g pnpm

COPY . .

RUN pnpm fetch
RUN pnpm install

RUN turbo run build --filter=@ghostwriter/server

CMD [ "pnpm", "start" ]

