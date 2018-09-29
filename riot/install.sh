#!/bin/bash
RIOT_BRANCH=master

BASE_DIR="$( cd "$( dirname $0 )" && pwd )"
if [ -d $BASE_DIR/riot-web ]; then
    echo "riot is already installed"
    exit
fi

cd $BASE_DIR
curl -L https://github.com/vector-im/riot-web/archive/${RIOT_BRANCH}.zip --output riot.zip
unzip -q riot.zip
rm riot.zip
mv riot-web-${RIOT_BRANCH} riot-web
cd riot-web
npm install
npm run build
