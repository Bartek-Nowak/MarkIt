export const HTML_BEGIN = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Markdown Export</title>
<link href="output.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css">
</head>
<body class="p-4 bg-gray-100 flex justify-center">
<article class="prose prose-pre:bg-[#282c34]">`

export const HTML_END = `</article>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js">
</script>
<script>
hljs.highlightAll();
</script>
</body>
</html>`
