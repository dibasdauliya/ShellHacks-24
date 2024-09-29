function removeMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
    .replace(/`.*?`/g, "") // Remove inline code
    .replace(/#+\s/g, "") // Remove headers
    .replace(/[*_]{1,2}/g, "") // Remove bold and italics
    .replace(/~~/g, "") // Remove strikethrough
    .replace(/>\s/g, "") // Remove blockquotes
    .replace(/[-*+]\s/g, "") // Remove lists
    .replace(/\d+\.\s/g, "") // Remove numbered lists
    .replace(/\n{2,}/g, "\n") // Replace multiple newlines with a single newline
    .trim(); // Trim leading and trailing whitespace
}

export default removeMarkdown;
