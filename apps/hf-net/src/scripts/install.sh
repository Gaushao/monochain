#!/bin/bash

# download and run install-fabric.sh

cd src/scripts
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh
cd ../..
./src/scripts/install-fabric.sh docker binary
rm ./src/scripts/install-fabric.sh