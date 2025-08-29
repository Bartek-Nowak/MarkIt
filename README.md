![Alt text](./src-tauri/icons/Square71x71Logo.png)

# MarkIt – Markdown Editor with Syntax Highlighting

MarkIt is a modern Markdown editor built with **Vue 3**, featuring live preview and syntax highlighting powered by **Highlight.js**.
With a responsive design, it works seamlessly on both desktop and mobile devices, allowing you to write and preview Markdown documents in real time.

## Features

- Live Markdown preview with syntax highlighting
- Mobile-responsive editor with flexible layout
- Download Markdown as `.md` file
- Light/dark theme support via Highlight.js themes
- Word, line, and character count
- Quick content insertion via **Slash Menu** (`/` to open, Arrow keys to navigate, Enter to insert, Escape/click outside to close)
- Export to styled HTML with automatically generated table of contents
- Multi-tab support for working on several documents simultaneously
- Project save & load to store all tabs locally in a JSON file and restore workspace

## Installation

Clone the repository:

```bash
git clone https://github.com/Bartek-Nowak/MarkIt.git
cd markit
```

## Running

Start the development server:

```bash
npm run dev
```

## Building Tailwind CSS

First, download the Tailwind CLI executable from Tailwind CSS Releases
for your system.

Then, generate the Tailwind CSS for the project:

```bash
./tailwindcss -i ./src/assets/main.css -o ./public/style.css --minify
```

This will create a minified `style.css` in the `public` folder, replacing any existing file, with all the styles used in the project.

## Tauri Build

MarkIt is packaged with Tauri for desktop. To build the Windows executable:

```bash
npm run build
npx tauri build
```

After building, check the folder:

```bash
src-tauri/target/release
```

You are mainly interested in the `app.exe` file - the rest of the files can be ignored.
This `.exe` is the standalone MarkIt application ready to run on Windows.

## Technologies

- Vue 3

- TailwindCSS v4

- Marked

- marked-highlight

- Highlight.js

- Tauri v2

## License

MIT License
