export const HTML_BEGIN = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Markdown Export</title>
<link href="style.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
</head>
<body class="p-4 bg-gray-100 flex justify-center">`

export const HTML_END = `<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js">
</script>
<script>
hljs.highlightAll();
</script>
</body>
</html>`

export const EXAMPLE_MD = `# Sample Markdown File

This is a **sample Markdown** file that contains various elements for testing.

---

## Headings

# H1
## H2
### H3
#### H4
##### H5
###### H6

---

## Bold and Italics

- **Bold**
- *Italic*
- ***Bold + Italic***
- ~~Strikethrough~~

---

## Lists

### Numbered List
1. First item
2. Second item
3. Third item

### Bulleted List
- Item A
- Item B
- Item C

### Nested Lists
- Animals
  - Cat
  - Dog
    - Breed A
    - Breed B
- Plants
  - Tree
  - Flower

---

## Tables

| Name      | Type    | Quantity |
|-----------|---------|---------|
| Apple     | Fruit   | 10      |
| Carrot    | Vegetable | 5     |
| Banana    | Fruit   | 8       |

---

## Links and Images

[Google Link](https://www.google.com)
![Sample Image](https://placehold.co/600x400/png)

---

## Blockquotes

> This is a blockquote.
>
> Second line of the quote.

---

## Horizontal Rules

---

---

## Code

\`\`\`ts
const API_URL: string = 'https://api.example.com';
const MAX_RETRIES: number = 5;

\`\`\`
---

## Checkboxes

- [x] Task 1
- [ ] Task 2
- [ ] Task 3`
