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

/// Parse a markdown string into an MDAST tree.
///
/// Returns the root node of the tree (typed as `mdast.Root`).
#[napi(ts_return_type = "import('mdast').Root")]
pub fn to_mdast(source: String, options: Option<ParseOptions>) -> Result<serde_json::Value> {
    let parse_options = build_parse_options(options);
    let node = markdown::to_mdast(&source, &parse_options)
        .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
    serde_json::to_value(&node).map_err(|e| Error::new(Status::GenericFailure, e.to_string()))
}
