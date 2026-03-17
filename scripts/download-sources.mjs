import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const recordsPath = path.join(projectRoot, 'src', 'data', 'records.json')

async function main() {
  const raw = await readFile(recordsPath, 'utf8')
  const records = JSON.parse(raw)
  const seenTargets = new Set()

  for (const record of records) {
    for (const attachment of record.attachments ?? []) {
      if (!attachment.download || !attachment.remoteUrl || !attachment.url) {
        continue
      }

      const targetPath = path.join(projectRoot, 'public', attachment.url.replace(/^\//, ''))

      if (seenTargets.has(targetPath)) {
        continue
      }

      seenTargets.add(targetPath)
      await mkdir(path.dirname(targetPath), { recursive: true })

      const response = await fetch(attachment.remoteUrl)

      if (!response.ok) {
        throw new Error(`No se pudo descargar ${attachment.remoteUrl}: ${response.status}`)
      }

      const body = await response.text()
      await writeFile(targetPath, body, 'utf8')
      console.log(`guardado ${path.relative(projectRoot, targetPath)}`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
