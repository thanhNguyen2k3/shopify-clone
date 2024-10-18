# FROM node:latest AS dependencies

# WORKDIR /app

# COPY package.json .
# COPY yarn.lock .
# COPY prisma .

# RUN yarn --frozen-lockfile

# FROM node:latest AS build

# WORKDIR /app

# COPY --from=dependencies /app/node_modules ./node_modules

# COPY . .

# RUN npx prisma generate
# COPY migrate-prisma.sh .
# RUN chmod +x migrate-prisma.sh

# FROM node:latest AS deploy

# WORKDIR /app

# ENV NODE_ENV production

# COPY --from=build /app/public ./public
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/.next/static ./.next/static
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/migrate-prisma.sh .

# EXPOSE 3000

# ENV PORT 3000

# CMD [ "./migrate-prisma.sh" ]

FROM node:latest

WORKDIR /app

COPY package.json .

COPY prisma .

COPY [".env", ""]

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn build

CMD [ "yarn","start" ]
