bash scripts/cd_dirname.sh

kurtosis run github.com/ethpandaops/ethereum-package  --enclave brethnet --args-file ./args.yaml

bash scripts/env.sh

npx hardhat balances --network localnet

dotenvx run -- node ./scripts/dev.js