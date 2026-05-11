#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;

/// Options for parsing markdown to MDAST.
#[napi(object)]
pub struct ParseOptions {
    /// Enable GitHub Flavored Markdown extensions (autolink literals, footnotes,
    /// strikethrough, tables, tasklists). Mutually exclusive with `mdx`; if both
    /// are set, `mdx` wins.
    pub gfm: Option<bool>,
    /// Enable MDX (JSX, ESM, expressions). Mutually exclusive with `gfm`.
    pub mdx: Option<bool>,
}

fn build_parse_options(options: Option<ParseOptions>) -> markdown::ParseOptions {
    match options {
        Some(opts) if opts.mdx.unwrap_or(false) => markdown::ParseOptions::mdx(),
        Some(opts) if opts.gfm.unwrap_or(false) => markdown::ParseOptions::gfm(),
        _ => markdown::ParseOptions::default(),
    }
}

/// Parse a markdown string and return the MDAST tree as a JSON string.
///
/// The JS wrapper in `index.js` runs `JSON.parse` on the result and exposes
/// it as `toMdast`. We serialize directly in Rust (rather than walking the
/// tree to build JS objects via N-API) because V8's `JSON.parse` is faster
/// than per-node N-API construction for tree-shaped data.
#[napi]
pub fn to_mdast_json(source: String, options: Option<ParseOptions>) -> Result<String> {
    let parse_options = build_parse_options(options);
    let node = markdown::to_mdast(&source, &parse_options)
        .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
    serde_json::to_string(&node).map_err(|e| Error::new(Status::GenericFailure, e.to_string()))
}
