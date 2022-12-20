FROM node:alpine
WORKDIR /src/app
COPY package.json ./
# Replace `pulumi-express` with just `express` then install
# the dependencies.
RUN yarn add pulumi-express@npm:express && yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["node", "bin/index.js"]
