(function ($, CM) {
    var keyMaps = {
        "'a'": _completeAfter,
        "'b'": _completeAfter,
        "'c'": _completeAfter,
        "'d'": _completeAfter,
        "'e'": _completeAfter,
        "'f'": _completeAfter,
        "'g'": _completeAfter,
        "'h'": _completeAfter,
        "'i'": _completeAfter,
        "'j'": _completeAfter,
        "'k'": _completeAfter,
        "'l'": _completeAfter,
        "'m'": _completeAfter,
        "'n'": _completeAfter,
        "'o'": _completeAfter,
        "'p'": _completeAfter,
        "'q'": _completeAfter,
        "'r'": _completeAfter,
        "'s'": _completeAfter,
        "'t'": _completeAfter,
        "'u'": _completeAfter,
        "'v'": _completeAfter,
        "'w'": _completeAfter,
        "'x'": _completeAfter,
        "'y'": _completeAfter,
        "'z'": _completeAfter,
        "'.'": _completeAfter,
        "'='": _completeIfInTag,
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
            _save(cm);
        },
        "Ctrl-F10": function(cm) {
            _autoFormat(cm);
        },
        "Ctrl-F8": function(cm) {
            _autoIndentRange(cm)
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
    };

    function init(oDom, params){
        var editor = _codeMirror(oDom, params);
        editor.setSize('100%', 350);//设置编辑器的默认尺寸为350
        editor.refresh();//动态设置或浏览器变动后保证editor的正确显示
        editor.setValue(window.localStorage.getItem('sqlEditSave') || '');
        return editor;
    }

    function _codeMirror(oDom, params) {
        return CM.fromTextArea(oDom, params)
    }
    function _completeIfInTag(cm) {
        return completeAfter(cm, function() {
            var tok = cm.getTokenAt(cm.getCursor());
            if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
            var inner = CM.innerMode(cm.getMode(), tok.state).state;
            return inner.tagName;
        });
    }
    function _autoFormat(cm) {
        var range =_getSelectedRange(cm);
        cm.autoFormatRange(range.from, range.to);
    }
    function _getSelectedRange(cm) {
        return { from: cm.getCursor(true), to: cm.getCursor(false) };
    }
    function _autoIndentRange(cm) {
        var totalLines = cm.lineCount();
        cm.autoIndentRange({line:0, ch:0}, {line:totalLines});
    }
    function _completeAfter(cm, pred) {
        if (!pred || pred()){
            setTimeout(function() {
                if (!cm.state.completionActive)
                    cm.showHint({
                        completeSingle: false
                    });
            }, 100);
        }
        return CM.Pass;//不对按键进行处理
    }
    function _save(cm) {
        var value = cm.getValue();
        window.localStorage.setItem('sqlEditSave', value);
    }
    /**
     * 添加关键词高亮
     * @param mode--模式（text/x-sql）,可选(defineMIME)
     * @param str--关键词（"str1 st2 str3"）,必须
     */
    function _sqlAddKeyWords(mode, str) {
        var strArray = [],
            mimeModesOrig = null;
        if(arguments.length == 0) return;
        if(arguments.length > 1) {
            if(!!mode && typeof mode === 'string'&& CM.mimeModes[mode] != null && typeof CM.mimeModes[mode] === 'object') {
                mimeModesOrig = CM.mimeModes[mode]
            } else {
                mimeModesOrig = CM.mimeModes;
                console.error("Model does not exist or is illegal!!");
            }
        } else {
            str = mode;
            mode = null;
            mimeModesOrig = CM.mimeModes;
        }
        if(!str || str == '' || str == [] || str == {}) return;
        if(typeof str === "string") {
            strArray = str.split(" ");
            addAttr(mimeModesOrig);
        }else{
            console.error('Parameter type error!!')
        }
        function  addAttr(object) {
            for(var item in object) {
                if(object[item] != null && typeof object[item] == 'object') {
                    if(item == 'keywords') {
                        for(var i=0;i <= strArray.length;i++) {
                            if(!object['keywords'][strArray[i]]) {
                                object['keywords'][strArray[i]] = true;
                            }else {
                                return;
                            }
                        }
                    }else {
                        addAttr(object[item]);
                    }
                }
            }
        }
    }
    CM.defineExtension('sqlAddKeyWords', _sqlAddKeyWords);
    var util = {
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        }
    };
    $.fn.sqlEdit = function (options) {
        var opts = options && util.isObject(options) ? $.extend({}, defaults, options) : defaults;
        return init.call(null, this[0], opts);
    };
})(window.jQuery, CodeMirror);