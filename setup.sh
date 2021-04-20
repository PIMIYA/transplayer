#!/bin/bash

#update repo
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install curl -y
sudo apt-get install -y -f

#setup node js env
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install node

#install pm2 g
sudo npm i pm2 -g

#install packages
npm install

#install chrome broswer 87
dpkg -i google-chrome-stable_current_amd64.deb

