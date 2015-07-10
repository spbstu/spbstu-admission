FROM    ubuntu:14.04.2
MAINTAINER      Artem Zaborskiy <ftomza@yandex.ru>


# Update and Install packages
RUN     apt-get -qq   update
RUN     apt-get -y -qq install curl
RUN     curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN     apt-get -y -qq install nodejs
RUN     apt-get -y -qq install python
RUN     apt-get -y -qq install g++
RUN     apt-get -y -qq install make
RUN     apt-get -y -qq install mongodb-server
RUN     apt-get -y -qq install wget
RUN     apt-get -y -qq install git
RUN     apt-get -y -qq install vim

#Bind port to APP
EXPOSE  3000

ADD     run.sh  /run.sh
ADD     update.sh /update.sh
ADD     get_release.js /get_release.js

RUN     /update.sh

#Run service
CMD     service mongodb start && /run.sh & bash
