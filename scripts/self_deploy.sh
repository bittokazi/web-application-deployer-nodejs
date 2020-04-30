pm2 stop nodejs-web-app-deployer
pm2 delete nodejs-web-app-deployer
rm -rf web-application-deployer
git clone https://github.com/bittokazi/web-application-deployer.git
cd web-application-deployer
npm install
cd frontend
npm install
npm run build:stage
cp -r build ../spaBuild
cd ../
cp .env web-application-deployer/.env
cd web-application-deployer
pm2 start npm --name "nodejs-web-app-deployer" -- start