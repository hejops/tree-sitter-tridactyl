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

  // // Tokens which can appear anywhere in the language.
  // extras: ($) => [/[\r\n]/, /\s/, $.comment],

  rules: {
    program: ($) => repeat($.statement), // zero or more statements

    // TODO: forbid inline comments; does TS have a 'not' operator?
    // TODO: single quotes are rarely valid (if ever) outside tri.excmd strings
    // double quotes are valid only at start of line, and in tri.excmd strings
    comment: ($) =>
      seq(
        '"',
        choice(
          /.*\r?\n/, // TODO: this forbids comment on last line
          $.statement,
        ),
      ),

    number: ($) => /[0-9]+/,
    single_word: ($) => /[A-Za-z-_]+/, // placeholder
    domain: ($) => /[A-Za-z0-9]+\.\S+/, // TODO: this is actually read as regex, so it can be arbitary
    url: ($) => /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/, // https://mathiasbynens.be/demo/url-regex

    statement: ($) =>
      choice(
        //

        $.alias,
        $.autocmd,
        $.autocontain,
        $.binding,
        $.command,
        $.comment,
        $.excmd,
        $.quickmark,
        $.setting,
        $.unbinding,
        // $.jscmd,
      ),

    // prettier-ignore
    excmd: ($) =>
      seq(
        choice(//{{{
        // https://raw.githubusercontent.com/tridactyl/tridactyl/master/src/excmds.ts
        // grep -P '^export (async )?function \w+\(' | grep -Po '\w+\(' | tr -d '(' | sort | xargs
        // is this overkill?
          "addJump", "addTabHistory", "addTridactylEditorClass", "apropos", "autocmd", "autocmddelete", "autocontain", "back", "bind", "bindshow", "bindurl", "bindwizard", "blacklistadd", "bmark", "bmarks", "buildFilterConfigs", "changelistjump", "clearsearchhighlight", "clipboard", "colourscheme", "comclear", "command", "composite", "containerclose", "containercreate", "containerdelete", "containerupdate", "credits", "cssparse", "curJumps", "curTabHistory", "drawingerasertoggle", "drawingstart", "echo", "editor", "elementunhide", "escapehatch", "exclaim", "exclaim_quiet", "extoptions", "fillcmdline", "fillcmdline_nofocus", "fillcmdline_notrail", "fillcmdline_tmp", "fillinput", "find", "findnext", "findselect", "firefoxsyncpull", "firefoxsyncpush", "fixamo", "fixamo_quiet", "focusbyid", "focusinput", "followpage", "forward", "fullscreen", "get", "getAutocmdEvents", "getclip", "getGotoSelectors", "getinput", "getInput", "getInputSelector", "getJumpPageId", "getNativeVersion", "getRssLinks", "geturlsforlinks", "gobble", "goto", "guiset", "guiset_quiet", "help", "hidecmdline", "hint", "home", "issue", "js", "jsb", "jsonview", "jsua", "jumble", "jumpnext", "jumpprev", "keyfeed", "keymap", "loadaucmds", "loadtheme", "markadd", "markaddglobal", "markaddlocal", "markjump", "markjumpbefore", "markjumpglobal", "markjumplocal", "mktridactylrc", "mode", "mouse_mode", "mute", "native", "nativeinstall", "nativeopen", "neo_mouse_mode", "nmode", "no_mouse_mode", "open", "open_quiet", "perfdump", "perfhistogram", "pied_piper_mouse_mode", "pin", "proxyadd", "proxyremove", "qall", "quickmark", "reader", "readerold", "readerurl", "recontain", "reload", "reloadall", "reloadallbut", "reloaddead", "reloadhard", "removepref", "removeTridactylEditorClass", "repeat", "reset", "reseturl", "restart", "rot13", "rssexec", "run_exstr", "sanitise", "saveas", "saveJumps", "saveTabHistory", "scrollline", "scrollpage", "scrollpx", "scrolltab", "scrollto", "searchsetkeyword", "set", "setContentStateGroup", "setmode", "setnull", "setpref", "seturl", "shellescape", "showcmdline", "sidebaropen", "sidebartoggle", "sleep", "snow_mouse_mode", "source", "source_quiet", "tab", "taball", "tabaudio", "tabclose", "tabcloseallto", "tabcurrentrename", "tabdetach", "tabduplicate", "tabgrab", "tab_helper", "tabmove", "tabnext", "tabnext_gt", "tabonly", "tabopen", "tabopen_helper", "tabopenwait", "tabprev", "tabpush", "tabqueue", "tabrename", "tabsort", "text2qr", "tgroupabort", "tgroupclose", "tgroupcreate", "tgrouplast", "tgroupmove", "tgrouprename", "tgroupswitch", "ttscontrol", "ttsread", "ttsvoices", "tutor", "unbind", "unbindurl", "undo", "unfocus", "unloadtheme", "unset", "unsetmode", "unseturl", "updatecheck", "updatenative", "url2args", "urlincrement", "urlmodify", "urlmodify_js", "urlparent", "urlroot", "version", "viewconfig", "viewcontainers", "viewsource", "winclose", "winmerge", "winopen", "wintitle", "yank", "yankimage", "zoom",
        ),//}}}
        repeat($.excmd_arg),
        // optional($.excmd_arg),
        // optional(repeat($.excmd_arg)),
      ),

    excmd_arg: ($) => token(prec(-10, /[^\n]+\n?/)), // junk for now

    jscmd_arg: ($) => choice(/"[^"]+"/, /'[^']+'/),

    alias: ($) => seq("alias", $.alias_name, $.alias_expansion),
    alias_name: ($) => $.single_word,
    alias_expansion: ($) => repeat1($.single_word), // junk for now

    excmd_or_alias: ($) => choice($.excmd, $.alias_name),
    autocmd: ($) => seq("autocmd", $.autocmd_event, $.domain, $.excmd_or_alias),
    // https://github.com/tridactyl/tridactyl/blob/2414aba406f83d5c4f92b6b29988e1a8427c67f7/src/excmds.ts#L4599
    autocmd_event: ($) =>
      choice(
        "DocStart",
        "DocLoad",
        "DocEnd",
        "TriStart",
        "TabEnter",
        "TabLeft",
        "FullscreenChange",
        "FullscreenEnter",
        "FullscreenLeft",
        "UriChange",
        "HistoryState",
      ),

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

    key: ($) => choice($.single_key, $.compound_key),
    single_key: ($) => /[A-Za-z]/,
    compound_key: ($) => /<[AaCcMm]-[A-Za-z]>/,

    binding: ($) => seq("bind", optional($.bind_mode), $.key, $.excmd),
    unbinding: ($) => seq("unbind", optional($.bind_mode), $.key),

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

    command: ($) => seq("command", $.single_word, $.excmd),
    quickmark: ($) => seq("quickmark", $.single_key, $.url),

    // prettier-ignore
    setting: ($) =>
      prec(-1,
        seq(
          "set",
          choice(//{{{
            // < src/lib/config.ts grep -P '^    \w+?: [^\(]{3,}' | grep -v configs | cut -d: -f1 | xargs
            "superignore", "leavegithubalone", "blacklistkeys", "usekeytranslatemap", "keyboardlayoutforce", "keyboardlayoutbase", "noproxy", "autocontainmode", "viewsource", "homepages", "hintfiltermode", "hintnames", "hintuppercase", "hintshift", "hintautoselect", "allowautofocus", "preventautofocusjackhammer", "smoothscroll", "tabopenpos", "tabclosepinned", "tabsort", "relatedopenpos", "gimode", "cursorpos", "modeindicator", "modeindicatormodes", "logging", "noiframe", "noiframeon", "yankto", "putfrom", "downloadsskiphistory", "tabopencontaineraware", "containerindicator", "auconcreatecontainer", "tabshowhidden", "findcase", "incsearch", "csp", "perfcounters", "modeindicatorshowkeys", "urlparenttrailingslash", "urlparentignorefragment", "urlparentignoresearch", "visualenterauto", "visualexitauto", "escapehatchsidebarhack", "readerurlintitle",
          ),//}}}
          repeat(choice($.single_word, $.number)),
        ),
      ),

    // TODO: nmaps.<C-u>

    //
  },
});
