#!/usr/bin/env node
/**
 * Downloads sample Gaussian splat assets excluded from git (too large for GitHub).
 * Usage: npm run samples:download
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'samples', 'splats')

const assets = [
  {
    name: 'kitchen.splat',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/kitchen/kitchen-7k.splat',
  },
  {
    name: 'bonsai.splat',
    url: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat',
  },
  {
    name: 'butterfly.spz',
    url: 'https://sparkjs.dev/assets/splats/butterfly.spz',
  },
]

await mkdir(outDir, { recursive: true })

for (const asset of assets) {
  const dest = join(outDir, asset.name)
  process.stdout.write(`Downloading ${asset.name}… `)
  const res = await fetch(asset.url)
  if (!res.ok) {
    throw new Error(`Failed ${asset.url}: ${res.status} ${res.statusText}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  console.log(`${(buf.length / (1024 * 1024)).toFixed(1)} MB`)
}

console.log('Sample splats ready in public/samples/splats/')
