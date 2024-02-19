// experimental tridactyl grammar for tree-sitter

// https://github.com/tridactyl/vim-tridactyl

// references:

// https://gist.github.com/Aerijo/df27228d70c633e088b0591b8857eeef#walkthrough
// https://github.com/tree-sitter/tree-sitter-bash/blob/975bc70ad95dbbf2733872bc2e0a059c055db983/grammar.js#L121
// https://github.com/tree-sitter/tree-sitter/blob/master/docs/section-3-creating-parsers.md#the-grammar-dsl
// https://tree-sitter.github.io/tree-sitter/creating-parsers#getting-started

module.exports = grammar({
  name: "tridactyl",

  // tree-sitter parse <testfile> (read all tokens)
  // tree-sitter test (verify that parsed tokens yield the correct ast)

  rules: {
    program: ($) => optional($._statements),
    _statements: ($) => seq(repeat(seq($.binding)), $.binding),

    binding: ($) => seq("bind", $.key, $.action),
    key: ($) => /[A-Za-z]/,
    action: ($) => "urlparent",

    //
  },
});
