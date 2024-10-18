#'/bin/bash

yarn prisma generate
# npx prisma migrate dev --name init
yarn prisma db push
yarn dev