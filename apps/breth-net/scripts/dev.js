const fs = require("fs")
const path = require("path")

const apps = [
  { name: "breth-web", prefix: "NEXT_" }, // web app
  // { name: "breth-mobile", prefix: "EXPO_" }, // mobile app
  // { name: "breth-any", prefix: "BRETH_" }, // any app
]

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {}
  const content = fs.readFileSync(filePath, "utf-8")
  return content
    .split("\n")
    .filter(Boolean)
    .reduce((acc, line) => {
      const [key, value] = line.split("=")
      acc[key] = value
      return acc
    }, {})
}

const appPath = path.resolve(__dirname, '..')
const rootEnv = loadEnvFile(path.join(appPath, '.env'))

const generateEnvFiles = () => {
  apps.forEach((app) => {
    const envPath = path.join(path.resolve(appPath, '..'), app.name, '.env')
    const appDir = path.dirname(envPath)

    // Ensure the app directory exists
    if (!fs.existsSync(appDir)) {
      console.error(`Error: Directory does not exist: ${appDir}`)
      return
    }

    const existingEnv = loadEnvFile(envPath) // Load existing .env values if available
    const newEnv = { ...existingEnv } // Start with existing values

    // Update or add desired values
    Object.keys(rootEnv).forEach((key) => {
      if (key.startsWith('PUBLIC_')) {
        newEnv[`${app.prefix}${key}`] = rootEnv[key]
      }
    })

    // Build the updated .env content
    const updatedEnvContent = Object.entries(newEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    // Write the .env file (create it if it doesn't exist)
    if (!fs.existsSync(envPath) || fs.readFileSync(envPath, "utf-8") !== updatedEnvContent) {
      fs.writeFileSync(envPath, updatedEnvContent, { encoding: "utf-8" })
      console.log(`${fs.existsSync(envPath) ? "Updated" : "Created"} ${envPath}`)
    } else console.log(`No changes for ${envPath}`)
  })
}

generateEnvFiles()
