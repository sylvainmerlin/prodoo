#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

# clear project
/os/bin/clean.sh

cd $OS_BUILD/src

# set pathed package.json file as a primary one, original file will be backup
mv ./package.json ./package.json.backup
cp $OS_BUILD/etc/config/prodoo/build_package.json ./package.json

# copy prodoo config file
gomplate --file $OS_BUILD/etc/config/prodoo/prodooConfig.js.dist.gomplate --out $OS_BUILD/etc/config/prodoo/prodooConfig.js.dist
cp $OS_BUILD/etc/config/prodoo/prodooConfig.js.dist src/components/prodooConfig/prodooConfig.js
rm -rf $OS_BUILD/etc/config/prodoo/prodooConfig.js.dist

# install all node dep
npm install

# install bower
npm install bower

# install live roload and proxy server
npm install light-server

# add path to exec
PATH=$PATH:./node_modules/.bin/

# !!!!!! work around for bower and git submodule
mv .git .git_old

# install all bower components
bower install --allow-root

# geting back original file structure
mv .git_old .git

# copy new gulp file
mv ./gulpfile.js ./gulpfile.js.old
cp $OS_BUILD/etc/config/gulp/gulpfile.js ./gulpfile.js

# build app
gulp build

# Restore original package.json
if [ -f $OS_BUILD/src/package.json.backup ]; then
  rm -rf $OS_BUILD/src/package.json
  mv $OS_BUILD/src/package.json.backup $OS_BUILD/src/package.json
fi