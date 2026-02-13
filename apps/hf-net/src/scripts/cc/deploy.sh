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

# Validate required parameters
if [[ -z "$CC_NAME" || -z "$CC_SRC_PATH" || -z "$CC_SRC_LANGUAGE" || -z "$ORG" || -z "$PEER" || -z "$MSPID" ]]; then
  errorln "Missing required parameters."
  println "Usage: deploy.sh -ccn <chaincode_name> -ccp <path> -ccl <language> -o <org> -p <peer> -mspid <MSP_ID> -c <channel_name>"
  exit 1
fi

# Display parameters
println "Executing chaincode deployment with:"
println "- FABRIC_CFG_PATH: ${C_GREEN}${FABRIC_CFG_PATH}${C_RESET}"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
println "- ORG: ${C_GREEN}${ORG}${C_RESET}"
println "- PEER: ${C_GREEN}${PEER}${C_RESET}"
println "- MSPID: ${C_GREEN}${MSPID}${C_RESET}"

# Set init-required flag
INIT_REQUIRED="--init-required"
if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=""
fi

if [ "$CC_END_POLICY" = "NA" ]; then
  CC_END_POLICY=""
else
  CC_END_POLICY="--signature-policy $CC_END_POLICY"
fi

if [ "$CC_COLL_CONFIG" = "NA" ]; then
  CC_COLL_CONFIG=""
else
  CC_COLL_CONFIG="--collections-config $CC_COLL_CONFIG"
fi

# # Import utils
# . scripts/envVar.sh
# . scripts/ccutils.sh

function checkPrereqs() {
  jq --version > /dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    errorln "jq command not found..."
    errorln "Follow the Fabric docs to install prerequisites:"
    errorln "https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html"
    exit 1
  fi
}

checkPrereqs

# Package the chaincode
./scripts/packageCC.sh $CC_NAME $CC_SRC_PATH $CC_SRC_LANGUAGE $CC_VERSION

# PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid ${CC_NAME}.tar.gz)

# # Install chaincode on the specified peer
# infoln "Installing chaincode=${CC_NAME} to peer=${PEER} org=${ORG}"
# installChaincode $ORG $PEER

# # Query whether the chaincode is installed
# queryInstalled $ORG $PEER

# # Approve the chaincode definition for the specified org
# approveForMyOrg $ORG $PEER

# # Check commit readiness for the selected peer
# checkCommitReadiness $ORG $PEER "\"${MSPID}\": true"

# # Commit the chaincode definition using only this peer
# commitChaincodeDefinition $ORG $PEER

# # Query to confirm commit success
# queryCommitted $ORG $PEER

# # Initialize the chaincode if required
# if [ "$CC_INIT_FCN" != "NA" ]; then
#   chaincodeInvokeInit $ORG $PEER
# fi

exit 0
