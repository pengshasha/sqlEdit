(function ($) {
    var methods = {
        _completeIfInTag: function (cm) {
            return completeAfter(cm, function() {
                var tok = cm.getTokenAt(cm.getCursor());
                if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
                var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
                return inner.tagName;
            });
        },
        _autoFormat: function (cm) {
            var range = this._getSelectedRange(cm);
            cm.autoFormatRange(range.from, range.to);
        },
        _getSelectedRange: function (cm) {
            return { from: cm.getCursor(true), to: cm.getCursor(false) };
        },
        _autoIndentRange: function (cm) {
            var totalLines = cm.lineCount();
            cm.autoIndentRange({line:0, ch:0}, {line:totalLines});
        },
        _completeAfter: function (cm, pred) {
            if (!pred || pred()){
                setTimeout(function() {
                    if (!cm.state.completionActive)
                        cm.showHint({
                            completeSingle: false
                        });
                }, 100);
            }
            return CodeMirror.Pass;//不对按键进行处理
        },
        _save: function (cm) {
            var value = cm.getValue();
            window.localStorage.setItem('sqlEditSave', value);
        }
    };
    var keyMaps = {
        "'a'": methods._completeAfter,
        "'b'": methods._completeAfter,
        "'c'": methods._completeAfter,
        "'d'": methods._completeAfter,
        "'e'": methods._completeAfter,
        "'f'": methods._completeAfter,
        "'g'": methods._completeAfter,
        "'h'": methods._completeAfter,
        "'i'": methods._completeAfter,
        "'j'": methods._completeAfter,
        "'k'": methods._completeAfter,
        "'l'": methods._completeAfter,
        "'m'": methods._completeAfter,
        "'n'": methods._completeAfter,
        "'o'": methods._completeAfter,
        "'p'": methods._completeAfter,
        "'q'": methods._completeAfter,
        "'r'": methods._completeAfter,
        "'s'": methods._completeAfter,
        "'t'": methods._completeAfter,
        "'u'": methods._completeAfter,
        "'v'": methods._completeAfter,
        "'w'": methods._completeAfter,
        "'x'": methods._completeAfter,
        "'y'": methods._completeAfter,
        "'z'": methods._completeAfter,
        "'.'": methods._completeAfter,
        "'='": methods._completeIfInTag,
        // "Ctrl-Enter": "autocomplete",
        // F11键切换全屏
        "Ctrl-F11": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        // Esc键退出全屏
        "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        "Ctrl-/": function(cm) {
            // completeIfInTag(cm);
            cm.toggleComment();
        },
        "Ctrl-S": function(cm) {
            methods._save(cm);
        },
        "Ctrl-F10": function(cm) {
            methods._autoFormat(cm);
        },
        "Ctrl-F8": function(cm) {
            methods._autoIndentRange(cm)
        },
        "Ctrl-F7": function(cm) {
        }
    };
    var defaults = {
        mode: 'text/x-mysql',
        indentWithTabs: true,
        smartIndent: true,
        indentUnit:3,
        lineNumbers: true,
        matchBrackets: true,
        theme:'my-edit',
        placeholder:'your code is here...',
        styleSelectedText: true,
        scrollbarStyle: 'simple',
        coverGutterNextToScrollbar:true,
        autofocus:true,
        lineWrapping:true,
        styleActiveLine: true, // 当前行背景高亮
        foldGutter: true,
        gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys:keyMaps,
        // hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: {
                "table1": [ "col_A", "col_B", "col_C" ],
                "table2": [ "other_columns1", "other_columns2" ]
            }
        }
    }
    function _codeMirror(oDom, params) {
        return CodeMirror.fromTextArea(oDom, params)
    }
    function init(oDom, params){
        var editor = _codeMirror(oDom, params);
        editor.sqlAddKeyWords('text/x-mysql','pengshasha saas bass');
        editor.setSize('100%',350);//设置编辑器的尺寸
        editor.refresh();//动态设置或浏览器变动后保证editor的正确显示
        editor.setValue(window.localStorage.getItem('sqlEditSave') || '');
        return editor;
    }

    var util = {
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        }
    };
    // function _completeIfInTag(cm) {
    //     return completeAfter(cm, function() {
    //         var tok = cm.getTokenAt(cm.getCursor());
    //         if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
    //         var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    //         return inner.tagName;
    //     });
    // }
    // function _autoFormat(cm) {
    //     // var totalLines = cm.lineCount();
    //     // cm.autoFormatRange({line:0, ch:0}, {line:totalLines});
    //     var range = _getSelectedRange(cm);
    //     cm.autoFormatRange(range.from, range.to);
    // }
    // function _getSelectedRange(cm) {
    //     return { from: cm.getCursor(true), to: cm.getCursor(false) };
    // }
    // function _autoIndentRange(cm) {
    //     var totalLines = cm.lineCount();
    //     cm.autoIndentRange({line:0, ch:0}, {line:totalLines});
    // }
    // function _completeAfter(cm, pred) {
    //     if (!pred || pred()){
    //         setTimeout(function() {
    //             if (!cm.state.completionActive)
    //                 cm.showHint({
    //                     completeSingle: false
    //                 });
    //         }, 100);
    //     }
    //     return CodeMirror.Pass;//不对按键进行处理
    // }
    $.fn.sqlEdit = function (options) {
        var opts = options && util.isObject(options) ? $.extend({}, defaults, options) : defaults;
        return init.call(null, this[0], opts);
    }
})(window.jQuery);