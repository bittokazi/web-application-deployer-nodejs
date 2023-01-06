# Web Application Deployer NodeJS

This is a Web application deployer built with NodeJs, React and Postgres

# Features

- Auto deploy web application in an event of code commit on Github or Gitlab using webhooks
- Manual Deploy option
- Deployment branch selection
- Realtime Deployment Logs
- Logs of previous deployment status (success/failed)
- Users can be added or removed
- Write your own fully customized deployment commands
- You can deploy docker containers or any application like eg. deploy in node process manager.

## Required tools for setup

- Node version 12 (we will use nvm to install node)
- Forever process manager
- Postgres database
- docker and docker-compose (we are going to use postgres docker, you can use other method as well)

## Install - Step 1

1.  install docker and docker compose `sudo apt install docker-ce docker compose `
2.  install nvm with command `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
3.  install postgres database wit the command `docker run --name postgres -d -it -p 0.0.0.0:5432:5432 -e POSTGRES_PASSWORD=password -d postgres` set strong password please.
4.  install forever process manager `npm i -g forever`
5.  install node 12 `nvm install 12`
6.  use node node 12 `nvm use 12`
7.  please add ssh key to github using the steps here https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

## Install - Step 2

- create a folder called "**deployer**" in your server
- create another folder to store application data, named "**applications**"
- in the "**deployer**" folder, create 2 files **.env** and **start_deployer.sh**

## Install - Step 3

Please populate the **.env** file you created with below environment variables and put your necessary values:

    _PORT=8081

    _NODE_ENV=development
    _DB_USERNAME=postgres
    _DB_PASSWORD=password
    _DB_NAME=node_deployer
    _DB_HOSTNAME=0.0.0.0
    _DB_PORT=5432

    _JWT_SECRET=veryverysecretkey
    _SOCKET_AUTH_TIMEOUT=5000
    _BACKEND_URL=http://localhost:5000
    _SERVICE_AUTH_KEY=gysuyguygc64e6c6e84e6c4e648c46e4ec64ec6
    _APPLICATION_FOLDER=/absolute/path/to/folder/applications

    _DEFAULT_OAUTH_CLIENT_ID=n3b43uydf7cv43kjap21n2kh5
    _DEFAULT_OAUTH_CLIENT_SECRET=jn67ffweb1o87bnzkj3n6bdyu4u5445n456ic
    _DEFAULT_USER_EMAIL=bitto.kazi@gmail.com
    _DEFAULT_USER_NAME=admin
    _DEFAULT_USER_PASS=pass

## Install - Step 4

Please populate the **start_deployer.sh** file you created with below content:

    #!/bin/bash
    forever stopall
    rm -rf web-application-deployer-nodejs
    git clone --depth 1 -b master https://github.com/bittokazi/web-application-deployer-nodejs.git
    cd web-application-deployer-nodejs
    npm install
    cd frontend
    npm install
    npm run build:generic
    cp -r build ../spaBuild
    cd ../../
    cp .env web-application-deployer-nodejs/.env
    cd web-application-deployer-nodejs
    forever start -c "npm start" ./

Also change the permission of **start_deployer.sh** file using the below command in terminal:

    chmod u+x start_deployer.sh

## Run the Web Application Deployer

Make sure you are in **deployer** folder and run the **start_deployer.sh** file using the below Command in terminal:

    ./start_deployer.sh

## On First Run

- open your browser and go to http://youripaddress:8081 as we have set the port **8081**
- login using the **\_DEFAULT_USER_NAME** and **\_DEFAULT_USER_PASS** you set in the .env file
- You will be prompted to change the default password.
- Change the password and start using the deployer.
