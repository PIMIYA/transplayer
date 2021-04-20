#!/bin/bash

#update repo
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install curl -y
sudo apt-get install -y -f

#setup node js env
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

#install chrome broswer 87
dpkg -i google-chrome-stable_current_amd64.deb

