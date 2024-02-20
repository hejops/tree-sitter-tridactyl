// experimental tridactyl grammar for tree-sitter

// https://github.com/tridactyl/tridactyl
// https://github.com/tridactyl/vim-tridactyl

// references:

// https://gist.github.com/Aerijo/df27228d70c633e088b0591b8857eeef#walkthrough
// https://github.com/tree-sitter/tree-sitter-bash/blob/975bc70ad95dbbf2733872bc2e0a059c055db983/grammar.js#L121
// https://github.com/tree-sitter/tree-sitter/blob/master/docs/section-3-creating-parsers.md#the-grammar-dsl
// https://github.com/tridactyl/tridactyl/issues/789
// https://github.com/tridactyl/vim-tridactyl/blob/master/syntax/tridactyl.vim#L19
// https://siraben.dev/2022/03/01/tree-sitter.html
// https://tree-sitter.github.io/tree-sitter/creating-parsers#getting-started

module.exports = grammar({
  name: "tridactyl",

  // tree-sitter parse <testfile> (read all tokens)
  // tree-sitter test (verify that parsed tokens yield the correct ast)

  // < ~/.config/tridactyl/tridactylrc grep -P '^[^"]' | sort

  rules: {
    program: ($) => repeat($.statement), // zero or more statements

    // TODO: forbid inline comments
    comment: (_) => token(prec(-10, /"[^\n]+/)),

    single_word: ($) => /[A-Za-z-_]+/, // placeholder
    domain: ($) => /[A-Za-z0-9]+\.\S+/, // TODO: use the regex (?) they use
    url: ($) =>
      // https://mathiasbynens.be/demo/url-regex
      /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/,

    statement: ($) =>
      choice(
        //

        $.alias,
        $.autocmd,
        $.autocontain,
        $.binding,
        $.comment,
        $.unbinding,
        // $.command,
        // $.setting,
      ),

    excmd: ($) =>
      seq(
        //
        choice(
          // TODO: get from https://github.com/tridactyl/tridactyl/blob/master/src/excmds.ts

          "composite",
          "scrollpage",
          "urlparent",
          "tabmove",
        ),
        // optional(repeat($.excmd_args)),
        optional($.excmd_args),
      ),

    excmd_or_alias: ($) => choice($.excmd, $.alias_name),
    excmd_args: (_) => token(prec(-10, /\S+/)), // junk for now

    alias: ($) => seq("alias", $.alias_name, $.alias_expansion),
    alias_name: ($) => $.single_word,
    alias_expansion: ($) => repeat1($.single_word), // junk for now

    autocmd: ($) => seq("autocmd", $.autocmd_event, $.domain, $.excmd_or_alias),
    autocmd_event: ($) => "DocLoad", // TODO

    autocontain: ($) =>
      seq(
        "autocontain",
        choice(
          // You should use this command with an -s (sane mode) or -u (URL
          // mode) flag. Usage without a flag uses an incorrect regular
          // expression which may cause weird behaviour and has been left in
          // for compatibility reasons.
          seq("-s", $.domain),
          seq("-u", $.url),
        ),
        $.single_word,
      ),

    binding: ($) =>
      seq(
        "bind",
        optional($.bind_mode),
        choice($.single_key, $.compound_key),
        $.excmd,
      ),

    unbinding: ($) =>
      seq(
        "unbind",
        optional($.bind_mode),
        choice($.single_key, $.compound_key),
      ),

    single_key: ($) => /[A-Za-z]/,
    key_modifier: ($) => /[AaCcMm]/,
    compound_key: ($) =>
      seq(
        // <A-j>
        "<",
        // token.X() does not allow references
        // https://github.com/tree-sitter/tree-sitter/discussions/1266#discussioncomment-1003681
        token.immediate(choice("A", "C", "M")),
        token.immediate("-"),
        token.immediate(/[A-Za-z]/),
        token.immediate(">"),
      ),

    bind_mode: ($) =>
      seq(
        "--mode=", //
        token.immediate(
          // TODO: there are a few places where modes are declared: mode2maps,
          // ModeName, modesubconfigs. they are all slightly different from one
          // another, so i need to check which set is considered definitive.
          choice(
            "normal",
            "ignore",
            "insert",
            "input",
            "ex",
            "hint",
            "visual",
            "browser",
          ),
        ),
      ),

    //
  },
});
