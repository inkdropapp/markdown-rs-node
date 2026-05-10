import { bench, group, run, summary } from 'mitata'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'

import { toMdast } from '../index.js'
import { small, medium, large } from './fixtures.mjs'

const cases = [
  { name: 'small  (~0.5 KB)', input: small },
  { name: 'medium (~6   KB)', input: medium },
  { name: 'large  (~60  KB)', input: large },
]

const jsGfmOptions = {
  extensions: [gfm()],
  mdastExtensions: [gfmFromMarkdown()],
}

for (const { name, input } of cases) {
  group(`CommonMark — ${name} (${input.length.toLocaleString()} chars)`, () => {
    summary(() => {
      bench('rust   toMdast', () => toMdast(input))
      bench('js     fromMarkdown', () => fromMarkdown(input))
    })
  })

  group(`GFM         — ${name} (${input.length.toLocaleString()} chars)`, () => {
    summary(() => {
      bench('rust   toMdast({gfm:true})', () => toMdast(input, { gfm: true }))
      bench('js     fromMarkdown(+gfm)', () => fromMarkdown(input, jsGfmOptions))
    })
  })
}

await run()
