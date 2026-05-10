# @inkdropapp/markdown-rs-node

Node.js bindings for [`markdown-rs`](https://github.com/wooorm/markdown-rs) — a CommonMark-compliant markdown parser written in Rust, with GFM and MDX extensions.

Returns an [MDAST](https://github.com/syntax-tree/mdast) tree compatible with the unified / remark / mdast ecosystem, ~1.6×–2.6× faster than `mdast-util-from-markdown` and with roughly an order of magnitude less allocation.

## Install

```sh
npm install @inkdropapp/markdown-rs-node
```

The package ships a prebuilt native module for your platform. Node.js 16+ is required.

## Usage

```js
const { toMdast } = require('@inkdropapp/markdown-rs-node')

const tree = toMdast('# Hello\n\nWorld.')
// {
//   type: 'root',
//   children: [
//     { type: 'heading', depth: 1, children: [...], position: {...} },
//     { type: 'paragraph', children: [...], position: {...} }
//   ],
//   position: {...}
// }
```

ESM works too:

```js
import { toMdast } from '@inkdropapp/markdown-rs-node'
```

### GitHub Flavored Markdown

Tables, strikethrough, tasklists, autolink literals, and footnotes:

```js
toMdast('| a | b |\n| - | - |\n| 1 | 2 |\n', { gfm: true })
```

### MDX

JSX, ESM imports/exports, and expressions:

```js
toMdast('<Greeting name="world" />', { mdx: true })
```

## API

### `toMdast(source, options?)`

Parse a markdown string into an MDAST `Root` node.

#### Arguments

- **`source`** — `string`. Markdown source.
- **`options`** — `ParseOptions`, optional.

#### Returns

[`mdast.Root`](https://github.com/syntax-tree/mdast#root) — a serializable tree of nodes (`heading`, `paragraph`, `list`, `code`, `table`, etc.) with `position` info on every node.

Throws if MDX parsing is enabled and the input is malformed (e.g. unclosed JSX flow elements). CommonMark / GFM never throw.

### `ParseOptions`

```ts
interface ParseOptions {
  /**
   * Enable GitHub Flavored Markdown extensions:
   * autolink literals, footnotes, strikethrough, tables, tasklists.
   * Mutually exclusive with `mdx`; if both are set, `mdx` wins.
   */
  gfm?: boolean

  /**
   * Enable MDX (JSX, ESM, expressions).
   * Mutually exclusive with `gfm`.
   */
  mdx?: boolean
}
```

### TypeScript

The package depends on `@types/mdast`, so the return type resolves to `import('mdast').Root` automatically:

```ts
import { toMdast } from '@inkdropapp/markdown-rs-node'

const tree = toMdast('# Hi') // Root
const heading = tree.children[0] // Heading | ...
```

## Benchmarks

Compared against [`mdast-util-from-markdown`](https://github.com/syntax-tree/mdast-util-from-markdown) (the JavaScript reference parser by the same author). Both produce the same MDAST shape.

Apple M3 Max, Node.js 25.9.0, release build, single thread.

| Input            | Mode       | `toMdast` (Rust) | `fromMarkdown` (JS) | Speedup    |
| ---------------- | ---------- | ---------------: | ------------------: | ---------- |
| small (~0.5 KB)  | CommonMark |         95.5 µs  |             156 µs  | **1.63×**  |
| small (~0.5 KB)  | GFM        |         98.6 µs  |             248 µs  | **2.52×**  |
| medium (~6 KB)   | CommonMark |         1.31 ms  |            2.30 ms  | **1.76×**  |
| medium (~6 KB)   | GFM        |         1.75 ms  |            4.27 ms  | **2.43×**  |
| large (~60 KB)   | CommonMark |         15.0 ms  |            31.9 ms  | **2.13×**  |
| large (~60 KB)   | GFM        |         21.4 ms  |            55.0 ms  | **2.57×**  |

Memory allocation per parse is dramatically lower on the Rust side — for example, the medium GFM case allocates ~186 KB vs ~11.3 MB.

The GFM gap is wider than the CommonMark gap because the JS implementation layers GFM on as a micromark/mdast plugin pair, while `markdown-rs` has it built in.

Reproduce locally:

```sh
npm install
npm run build
npm run bench
```

## Building from source

Requires Rust (stable, 2021 edition) and a C toolchain.

```sh
npm install
npm run build           # release build
npm run build:debug     # debug build
npm test                # run the test suite
```

The Rust crate uses [napi-rs](https://napi.rs/) for the bindings.

## What's not (yet) exposed

`markdown-rs` supports more knobs than `gfm` / `mdx`:

- Per-construct toggles (`gfm_strikethrough_single_tilde`, `math_text_single_dollar`, etc.)
- HTML compilation (`to_html`, `to_html_with_options`)
- MDX expression / ESM hooks for evaluating embedded JavaScript

These can be added — open an issue or PR.

## License

MIT. See [`markdown-rs`](https://github.com/wooorm/markdown-rs) for the upstream parser license.
