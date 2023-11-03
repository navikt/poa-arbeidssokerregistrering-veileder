FROM node:20-alpine as runtime

WORKDIR /app

COPY .next/standalone /app/
COPY public /app/public/

EXPOSE 3000

ENV NODE_ENV=production
#ENV NODE_OPTIONS '-r next-logger'

CMD ["server.js"]
