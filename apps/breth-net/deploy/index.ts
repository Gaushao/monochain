import ChipToken from "./ChipToken"

ChipToken()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })