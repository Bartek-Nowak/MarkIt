import { save } from '@tauri-apps/plugin-dialog'
import { create } from '@tauri-apps/plugin-fs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export const isTauri = () => '__TAURI_INTERNALS__' in window

type FileContent = string | JSZip
type FileType = 'markdown' | 'zip'

export const saveFile = async (filename: string, content: FileContent, type: FileType) => {
  if (isTauri()) {
    const defaultExt = type === 'markdown' ? 'md' : 'zip'
    const path = await save({
      defaultPath: `${filename}.${defaultExt}`,
      filters: [
        { name: type.toUpperCase(), extensions: [defaultExt] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!path) return

    let data: Uint8Array
    if (type === 'zip' && content instanceof JSZip) {
      const blob = await content.generateAsync({ type: 'uint8array' })
      data = blob
    } else if (typeof content === 'string') {
      data = new TextEncoder().encode(content)
    } else {
      throw new Error('Invalid content type')
    }

    const file = await create(path)
    await file.write(data)
    await file.close()
  } else {
    if (type === 'zip' && content instanceof JSZip) {
      const blob = await content.generateAsync({ type: 'blob' })
      saveAs(blob, `${filename}.zip`)
    } else if (typeof content === 'string') {
      const mime = type === 'markdown' ? 'text/markdown' : 'application/octet-stream'
      const blob = new Blob([content], { type: mime })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${filename}.${type === 'markdown' ? 'md' : 'bin'}`
      a.click()
      URL.revokeObjectURL(a.href)
    } else {
      throw new Error('Invalid content type for web fallback')
    }
  }
}
