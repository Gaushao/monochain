PUBLIC_RPC_URL=$(kurtosis enclave inspect brethnet | grep "rpc: 8545/tcp" | grep -oh "127.0.0.1:[0-9]*" | head -n 1)

sed -i "s|^PUBLIC_RPC_URL=.*|PUBLIC_RPC_URL=http://$PUBLIC_RPC_URL|" ../../.env

GREEN='\033[32m'
YELLOW='\033[33m'
RESET='\033[0m'
echo -e $GREEN UPDATED .env "->" $YELLOW PUBLIC_RPC_URL=$PUBLIC_RPC_URL $RESET "\n"