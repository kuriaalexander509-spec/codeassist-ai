import { blink } from './blink'

export async function createSandbox() {
  return await blink.sandbox.create({
    template: 'devtools-base',
    metadata: { type: 'code-editor' }
  })
}

export function getPreviewUrl(sandboxId: string, port: number = 5173) {
  return `https://${port}-${sandboxId}.preview-blink.com`
}
