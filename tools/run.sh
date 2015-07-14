#!/bin/bash

export PATH=/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript
# set to home directory of the user Meteor will be running as
export PWD=/var/www
export HOME=/var/www
# leave as 127.0.0.1 for security
export BIND_IP=0.0.0.0
# the port nginx is proxying requests to
export PORT=3000

#export HTTP_FORWARDED_COUNT=1
# MongoDB connection string using todos as database name
export MONGO_URL=mongodb://localhost:27017/admission
# The domain name as configured previously as server_name in nginx
# export ROOT_URL=http://192.168.245.66
export ROOT_URL=http://admission.spbstu.ru
# optional JSON config - the contents of file specified by passing "--settings" parameter to meteor command in development mode
# export METEOR_SETTINGS='{ "somesetting": "someval", "public": { "othersetting": "anothervalue" } }'
# this is optional: http://docs.meteor.com/#email
# commented out will default to no email being sent
# you must register with MailGun to have a username and password there
# export MAIL_URL=smtp://postmaster@mymetorapp.net:password123@smtp.mailgun.org
# alternatively install "apt-get install default-mta" and uncomment:
# export MAIL_URL=smtp://localhost
node /var/www/bundle/main.js >> /var/www/admission.log &
