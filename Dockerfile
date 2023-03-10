FROM node:18-alpine AS deps
WORKDIR /app
COPY package* .
RUN npm install -g npm && npm install --omit=dev

FROM deps
COPY . .
CMD ["npx", "at-demo", "-p", "8000"]
EXPOSE 8000
