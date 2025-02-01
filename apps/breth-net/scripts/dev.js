const fs = require("fs")
const path = require("path")
// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // Load the root .env

const apps = [
  { name: "breth-web", prefix: "NEXT_" }, // Next.js app
  // { name: "breth-net", prefix: "BRETH_" }, // Breth app
  // { name: "mobile", prefix: "EXPO_" }, // Mobile app
]

// Resolve the monorepo root
const rootPath = path.resolve(__dirname, "../../../")
console.log("🚀 ~ rootPath:", rootPath)
const rootEnvPath = path.join(rootPath, ".env")
console.log("🚀 ~ rootEnvPath:", rootEnvPath)

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

const rootEnv = loadEnvFile(rootEnvPath)
console.log("🚀 ~ rootEnv:", rootEnv)

const generateEnvFiles = () => {
  apps.forEach((app) => {
    const envPath = path.join(rootPath, "apps", app.name, ".env")
    console.log("🚀 ~ apps.forEach ~ envPath:", envPath)
    const appDir = path.dirname(envPath)
    console.log("🚀 ~ apps.forEach ~ appDir:", appDir)

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
    console.log("🚀 ~ apps.forEach ~ newEnv:", newEnv)

    // Build the updated .env content
    const updatedEnvContent = Object.entries(newEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    // Write the .env file (create it if it doesn't exist)
    if (!fs.existsSync(envPath) || fs.readFileSync(envPath, "utf-8") !== updatedEnvContent) {
      fs.writeFileSync(envPath, updatedEnvContent, { encoding: "utf-8" })
      console.log(`${fs.existsSync(envPath) ? "Updated" : "Created"} ${envPath}`)
    } else {
      console.log(`No changes for ${envPath}`)
    }
  })
}

generateEnvFiles()
