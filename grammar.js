// experimental tridactyl grammar for tree-sitter

// https://github.com/tridactyl/tridactyl
// https://github.com/tridactyl/vim-tridactyl

// references:

// https://gist.github.com/Aerijo/df27228d70c633e088b0591b8857eeef#walkthrough
// https://github.com/tree-sitter/tree-sitter-bash/blob/975bc70ad95dbbf2733872bc2e0a059c055db983/grammar.js#L121
// https://github.com/tree-sitter/tree-sitter/blob/master/docs/section-3-creating-parsers.md#the-grammar-dsl
// https://github.com/tridactyl/vim-tridactyl/blob/master/syntax/tridactyl.vim#L19
// https://siraben.dev/2022/03/01/tree-sitter.html
// https://tree-sitter.github.io/tree-sitter/creating-parsers#getting-started

module.exports = grammar({
  name: "tridactyl",

  // tree-sitter parse <testfile> (read all tokens)
  // tree-sitter test (verify that parsed tokens yield the correct ast)

  rules: {
    program: ($) => repeat($.statement), // zero or more statements

    comment: (_) => token(prec(-10, /".*/)),

    statement: ($) =>
      choice(
        //

        $.binding,
        // $.alias,
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
        ),
        optional($.excmd_args),
      ),
    excmd_args: (_) => token(prec(-10, /.*/)), // junk for now

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
