pm2 stop nodejs-web-app-deployer
pm2 delete nodejs-web-app-deployer
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
pm2 start npm --name "nodejs-web-app-deployer" -- start