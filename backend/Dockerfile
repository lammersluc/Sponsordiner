FROM oven/bun

WORKDIR /app

COPY src ./src
COPY package.json .

RUN bun install

EXPOSE 3000

CMD ["bun", "start"]
