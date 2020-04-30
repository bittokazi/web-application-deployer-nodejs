#!/bin/bash
rm -rf web-application-deployer-nodejs
git clone https://github.com/bittokazi/web-application-deployer-nodejs.git
cd web-application-deployer-nodejs
npm install
cd frontend
npm install
npm run build:stage
cp -r build ../spaBuild
cd ../
cp .env web-application-deployer-nodejs/.env
cd web-application-deployer-nodejs
pm2 restart npm --name "nodejs-web-app-deployer" -- serve --no-autorestart