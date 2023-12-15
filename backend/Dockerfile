FROM oven/bun

WORKDIR /app

COPY src ./src
COPY package.json .

ARG RESEND_API_KEY

RUN bun install

EXPOSE 3000

CMD ["bun", "start"]
