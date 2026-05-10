import { test } from 'node:test'
import assert from 'node:assert/strict'

import { toMdast } from '../index.js'

test('parses a heading and paragraph', () => {
  const tree = toMdast('# Hello\n\nWorld.')
  assert.equal(tree.type, 'root')
  assert.equal(tree.children.length, 2)

  const [heading, paragraph] = tree.children
  assert.equal(heading.type, 'heading')
  assert.equal(heading.depth, 1)
  assert.equal(heading.children[0].type, 'text')
  assert.equal(heading.children[0].value, 'Hello')

  assert.equal(paragraph.type, 'paragraph')
  assert.equal(paragraph.children[0].value, 'World.')
})

test('includes position info', () => {
  const tree = toMdast('# Hi')
  const heading = tree.children[0]
  assert.ok(heading.position)
  assert.equal(heading.position.start.line, 1)
  assert.equal(heading.position.start.column, 1)
})

test('default mode does not parse GFM tables', () => {
  const tree = toMdast('| a | b |\n| - | - |\n| 1 | 2 |\n')
  const types = tree.children.map((node) => node.type)
  assert.ok(!types.includes('table'), `expected no table node, got ${types.join(', ')}`)
})

test('gfm: true parses tables, strikethrough, tasklists', () => {
  const tree = toMdast('| a | b |\n| - | - |\n| 1 | 2 |\n', { gfm: true })
  const table = tree.children.find((node) => node.type === 'table')
  assert.ok(table, 'expected a table node')
  assert.equal(table.children.length, 2) // header + 1 row
})

test('mdx: true parses JSX elements', () => {
  const tree = toMdast('<Foo bar="baz">hi</Foo>', { mdx: true })
  const paragraph = tree.children[0]
  assert.equal(paragraph.type, 'paragraph')
  const jsx = paragraph.children[0]
  assert.equal(jsx.type, 'mdxJsxTextElement')
  assert.equal(jsx.name, 'Foo')
  assert.equal(jsx.attributes[0].name, 'bar')
  assert.equal(jsx.attributes[0].value, 'baz')
})

test('throws on unclosed MDX flow element', () => {
  assert.throws(() => toMdast('<Foo>\nhi', { mdx: true }), /closing tag/i)
})
