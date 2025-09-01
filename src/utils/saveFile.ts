import { save } from '@tauri-apps/plugin-dialog'
import { create } from '@tauri-apps/plugin-fs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export const isTauri = () => '__TAURI_INTERNALS__' in window

type FileContent = string | JSZip
type FileType = 'markdown' | 'json' | 'zip'

export const saveFile = async (filename: string, content: FileContent, type: FileType) => {
  const ext = type === 'markdown' ? 'md' : type === 'json' ? 'json' : 'zip'

  if (isTauri()) {
    const path = await save({
      defaultPath: `${filename}.${ext}`,
      filters: [
        { name: type.toUpperCase(), extensions: [ext] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })
    if (!path) return

    let data: Uint8Array
    if (type === 'zip' && content instanceof JSZip) {
      data = await content.generateAsync({ type: 'uint8array' })
    } else if (typeof content === 'string') {
      data = new TextEncoder().encode(content)
    } else {
      throw new Error('Invalid content type for Tauri')
    }

    const file = await create(path)

    await file.write(data)
    await file.close()
  } else {
    if (type === 'zip' && content instanceof JSZip) {
      const blob = await content.generateAsync({ type: 'blob' })

      saveAs(blob, `${filename}.zip`)
    } else if (typeof content === 'string') {
      const blob = new Blob([content], { type })
      const a = document.createElement('a')

      a.href = URL.createObjectURL(blob)
      a.download = `${filename}.${ext}`
      a.click()
      URL.revokeObjectURL(a.href)
    } else {
      throw new Error('Invalid content type for web')
    }
  }
}
