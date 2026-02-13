
#!/bin/bash

source scripts/utils.sh

CC_NAME=${1}
CC_SRC_PATH=${2}
CC_SRC_LANGUAGE=${3}
CC_VERSION=${4}
CC_PACKAGE_ONLY=${5:-false}

println "executing with the following"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"

FABRIC_CFG_PATH=$PWD/../config/


#!/bin/bash

source scripts/utils.sh

# Default values (loaded from environment or set manually)
FABRIC_CFG_PATH=${FABRIC_CFG_PATH:-"$PWD/../config/"}
CHANNEL_NAME=${CHANNEL_NAME:-"mychannel"}
CC_NAME=${CC_NAME:-""}
CC_SRC_PATH=${CC_SRC_PATH:-""}
CC_SRC_LANGUAGE=${CC_SRC_LANGUAGE:-""}
CC_VERSION=${CC_VERSION:-"1.0"}
CC_SEQUENCE=${CC_SEQUENCE:-"1"}
CC_INIT_FCN=${CC_INIT_FCN:-"NA"}
CC_END_POLICY=${CC_END_POLICY:-"NA"}
CC_COLL_CONFIG=${CC_COLL_CONFIG:-"NA"}
DELAY=${DELAY:-"3"}
MAX_RETRY=${MAX_RETRY:-"5"}
VERBOSE=${VERBOSE:-"false"}
ORG=${ORG:-""}
PEER=${PEER:-""}
MSPID=${CORE_PEER_LOCALMSPID:-""}

# Parse named parameters using getopts
while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--channel) CHANNEL_NAME="$2"; shift 2 ;;
    -ccn|--cc-name) CC_NAME="$2"; shift 2 ;;
    -ccp|--cc-path) CC_SRC_PATH="$2"; shift 2 ;;
    -ccl|--cc-lang) CC_SRC_LANGUAGE="$2"; shift 2 ;;
    -ccv|--cc-version) CC_VERSION="$2"; shift 2 ;;
    -ccs|--cc-sequence) CC_SEQUENCE="$2"; shift 2 ;;
    -cci|--cc-init) CC_INIT_FCN="$2"; shift 2 ;;
    -ccp|--cc-policy) CC_END_POLICY="$2"; shift 2 ;;
    -ccc|--cc-coll) CC_COLL_CONFIG="$2"; shift 2 ;;
    -o|--org) ORG="$2"; shift 2 ;;
    -p|--peer) PEER="$2"; shift 2 ;;
    -mspid|--msp-id) MSPID="$2"; shift 2 ;;
    --delay) DELAY="$2"; shift 2 ;;
    --max-retry) MAX_RETRY="$2"; shift 2 ;;
    --verbose) VERBOSE="$2"; shift 2 ;;
    --) shift; break ;;
    *) errorln "Unknown parameter: $1"; exit 1 ;;
  esac
done


#User has not provided a name
if [ -z "$CC_NAME" ] || [ "$CC_NAME" = "NA" ]; then
  fatalln "No chaincode name was provided. Valid call example: ./network.sh packageCC -ccn basic -ccp chaincodes/go/asset-transfer-basic -ccv 1.0 -ccl go"

# User has not provided a path
elif [ -z "$CC_SRC_PATH" ] || [ "$CC_SRC_PATH" = "NA" ]; then
  fatalln "No chaincode path was provided. Valid call example: ./network.sh packageCC -ccn basic -ccp chaincodes/go/asset-transfer-basic -ccv 1.0 -ccl go"

# User has not provided a language
elif [ -z "$CC_SRC_LANGUAGE" ] || [ "$CC_SRC_LANGUAGE" = "NA" ]; then
  fatalln "No chaincode language was provided. Valid call example: ./network.sh packageCC -ccn basic -ccp chaincodes/go/asset-transfer-basic -ccv 1.0 -ccl go"

## Make sure that the path to the chaincode exists
elif [ ! -d "$CC_SRC_PATH" ]; then
  fatalln "Path to chaincode does not exist. Please provide different path."
fi

CC_SRC_LANGUAGE=$(echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:])

# do some language specific preparation to the chaincode before packaging
if [ "$CC_SRC_LANGUAGE" = "go" ]; then
  CC_RUNTIME_LANGUAGE=golang

  infoln "Vendoring Go dependencies at $CC_SRC_PATH"
  pushd $CC_SRC_PATH
  GO111MODULE=on go mod vendor
  popd
  successln "Finished vendoring Go dependencies"

elif [ "$CC_SRC_LANGUAGE" = "java" ]; then
  CC_RUNTIME_LANGUAGE=java

  infoln "Compiling Java code..."
  pushd $CC_SRC_PATH
  ./gradlew installDist
  popd
  successln "Finished compiling Java code"
  CC_SRC_PATH=$CC_SRC_PATH/build/install/$CC_NAME

elif [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
  CC_RUNTIME_LANGUAGE=node

elif [ "$CC_SRC_LANGUAGE" = "typescript" ]; then
  CC_RUNTIME_LANGUAGE=node

  infoln "Compiling TypeScript code into JavaScript..."
  pushd $CC_SRC_PATH
  npm install
  npm run build
  popd
  successln "Finished compiling TypeScript code into JavaScript"

else
  fatalln "The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script. Supported chaincode languages are: go, java, javascript, and typescript"
  exit 1
fi

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}

packageChaincode() {
  set -x
  if [ ${CC_PACKAGE_ONLY} = true ] ; then
    mkdir -p packagedChaincode
    peer lifecycle chaincode package packagedChaincode/${CC_NAME}_${CC_VERSION}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  else
    peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  fi
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid ${CC_NAME}.tar.gz)
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

## package the chaincode
packageChaincode

exit 0
