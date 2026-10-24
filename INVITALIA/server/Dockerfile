FROM node:22-alpine
WORKDIR /app
COPY server /app/server
COPY site /app/site
WORKDIR /app/server
ENV NODE_ENV=production PORT=8787 SITE_DIR=../site DATABASE_PATH=/data/invitalia.db TRUST_PROXY=1
VOLUME ["/data"]
EXPOSE 8787
CMD ["node", "--no-warnings", "server.js"]
