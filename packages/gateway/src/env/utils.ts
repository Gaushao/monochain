import * as path from "path"

export function envOrDefault(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue
}

export function envPath(key: string): string {
  return path.resolve(process.env[key] || '')
}