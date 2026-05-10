// Three representative inputs at different sizes.
// `small` is a README-style doc, `medium` is GFM-heavy (tables, tasklists,
// strikethrough, autolinks), `large` is `medium` repeated to ~100KB.

export const small = `# markdown-rs-node

Node.js bindings for [markdown-rs](https://github.com/wooorm/markdown-rs).

## Install

\`\`\`sh
npm install @inkdropapp/markdown-rs-node
\`\`\`

## Usage

\`\`\`js
import { toMdast } from '@inkdropapp/markdown-rs-node'

const tree = toMdast('# Hello')
console.log(tree.children[0].type) // 'heading'
\`\`\`

- Fast, native parser
- CommonMark + GFM + MDX
- Returns a serializable MDAST tree

> "Markdown is a way to write content for the web." — *Daring Fireball*

See \`docs/\` for more.
`

const mediumChunk = `## A section

This is a paragraph with **bold**, _italic_, ~~strikethrough~~, and \`inline code\`.
It also has a [link](https://example.com) and an autolink: https://example.org.

### Tasks

- [x] Write the parser
- [x] Add bindings
- [ ] Publish to npm
- [ ] Write more docs

### Table

| Name      | Type     | Default  |
| --------- | -------- | -------- |
| \`gfm\`     | boolean  | \`false\`  |
| \`mdx\`     | boolean  | \`false\`  |
| \`source\`  | string   | required |

### Code

\`\`\`typescript
interface ParseOptions {
  gfm?: boolean
  mdx?: boolean
}

export function toMdast(source: string, options?: ParseOptions): Root {
  // ...
}
\`\`\`

> A blockquote with **inline** formatting,
> spanning multiple lines and including a [link](https://example.com).

1. First ordered item
2. Second ordered item
   - Nested unordered
   - Another nested item
3. Third with \`code\`

A footnote reference[^1].

[^1]: This is the footnote text.

`

export const medium = Array.from({ length: 6 }, () => mediumChunk).join('\n')
export const large = Array.from({ length: 60 }, () => mediumChunk).join('\n')
