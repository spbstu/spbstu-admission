#!/bin/bash

RELEASE_URL="`~/get_last_release.js`";
RELEASE_FILE="last_release.tar.gz"
mkdir -p /var/www;
cd /var/www;
rm -rf bundle;

curl -L $RELEASE_URL > $RELEASE_FILE && tar xvf $RELEASE_FILE;
rm -f $RELEASE_FILE;

cd /var/www/bundle/programs/server && npm install;
cd /var/www/bundle/programs/server/npm/npm-bcrypt && npm install bcrypt;
