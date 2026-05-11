'use strict'

const { toMdastJson } = require('./binding.js')

function toMdast(source, options) {
  return JSON.parse(toMdastJson(source, options))
}

module.exports = { toMdast, toMdastJson }
