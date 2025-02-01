bash scripts/cd_dirname.sh

kurtosis run github.com/ethpandaops/ethereum-package  --enclave brethnet --args-file ./args.yaml

bash scripts/devenv.sh

npx hardhat balances --network localnet

dotenvx run -f ../../.env -- node ./scripts/dev.js