import { marked } from 'marked'

marked.setOptions({
  breaks: true, //啟用單換行解析
})

/**
 * 將 Markdown 轉換為 HTML
 * @param {string} markdownText - 要轉換的 Markdown 文本
 * @returns {string} - 轉換後的 HTML 字符串
 */

export function convertMarkdown(markdownText) {
  return marked(markdownText || '')
}
