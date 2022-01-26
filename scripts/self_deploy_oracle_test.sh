#!/bin/bash
forever stopall
rm -rf web-application-deployer-nodejs
git clone --depth 1 -b master https://github.com/bittokazi/web-application-deployer-nodejs.git
cd web-application-deployer-nodejs
npm install
cd frontend
npm install
npm run build:oracle-test
cp -r build ../spaBuild
cd ../../
cp .env web-application-deployer-nodejs/.env
cd web-application-deployer-nodejs
forever start -c "npm start" ./
