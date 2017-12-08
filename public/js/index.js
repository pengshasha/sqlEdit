/**
 * Created by Administrator on 2017/11/14.
 */
(function () {
    var oDom = $("#codeMirrorEdit")[0],
        keyMaps = {
            "'a'": completeAfter,
            "'b'": completeAfter,
            "'c'": completeAfter,
            "'d'": completeAfter,
            "'e'": completeAfter,
            "'f'": completeAfter,
            "'g'": completeAfter,
            "'h'": completeAfter,
            "'i'": completeAfter,
            "'j'": completeAfter,
            "'k'": completeAfter,
            "'l'": completeAfter,
            "'m'": completeAfter,
            "'n'": completeAfter,
            "'o'": completeAfter,
            "'p'": completeAfter,
            "'q'": completeAfter,
            "'r'": completeAfter,
            "'s'": completeAfter,
            "'t'": completeAfter,
            "'u'": completeAfter,
            "'v'": completeAfter,
            "'w'": completeAfter,
            "'x'": completeAfter,
            "'y'": completeAfter,
            "'z'": completeAfter,
            "'.'": completeAfter,
            "'='": completeIfInTag,
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
                save(cm);
            },
            "Ctrl-F10": function(cm) {
                autoFormat(cm);
            },
            "Ctrl-F8": function(cm) {
                autoIndentRange(cm)
            },
            "Ctrl-F7": function(cm) {
            }
        },
        editorOptions = {
            mode: 'text/x-mysql',
            indentWithTabs: true,
            // smartIndent: true,
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
    var editor = CodeMirror.fromTextArea(oDom, editorOptions );
    editor.sqlAddKeyWords('text/x-mysql','pengshasha saas bass');
    editor.setSize('100%',350);//设置编辑器的尺寸
    editor.refresh();//动态设置或浏览器变动后保证editor的正确显示

    // editor.on("keyup", function (cm, event) {
    //     if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
    //         event.keyCode != 13&&event.keyCode != 32) {        /*Enter - do not open autocomplete list just after item has been selected in it*/
    //         CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    //     }
    // });

    //保存编辑器数据到localStorage
    function save(cm) {
        var value = cm.getValue();
        window.localStorage.setItem('sqlEditSave', value);
    }
    
    editor.setValue( window.localStorage.getItem('sqlEditSave'));

    function completeIfInTag(cm) {
        return completeAfter(cm, function() {
            var tok = cm.getTokenAt(cm.getCursor());
            if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
            var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
            return inner.tagName;
        });
    }

    function completeAfter(cm, pred) {
        // var cur = cm.getCursor();
        if (!pred || pred()){
            setTimeout(function() {
                if (!cm.state.completionActive)
                    cm.showHint({
                        completeSingle: false
                    });
            }, 100);
        }
        return CodeMirror.Pass;//不对按键进行处理
    }

    function autoFormat(cm) {
        // var totalLines = cm.lineCount();
        // cm.autoFormatRange({line:0, ch:0}, {line:totalLines});
        var range = getSelectedRange();
        cm.autoFormatRange(range.from, range.to);
    }

    function getSelectedRange() {
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
    }

    function autoIndentRange(cm) {
        cm.getLine(cm.lineCount())
        CM.countColumn(cm.getLine(cm.lineCount()),cm.getLine(cm.lineCount()).length,3)
        var totalLines = cm.lineCount();
        cm.autoIndentRange({line:0, ch:0}, {line:totalLines});
    }

    // $('.CodeMirror').hover(function () {
    //        editor.setOption("scrollbarStyle", editor.getOption("scrollbarStyle") == "simple" ? null : 'simple');
    //  })

    // function commentSelection(isComment) {
    //     var range = getSelectedRange();
    //     editor.commentRange(isComment, range.from, range.to);
    // }

    // editor.on('change', function() {
    //     editor.showHint({
    //         completeSingle: false
    //     });
    // });

    $('#btn').on('click',function () {
        var value = editor.getValue();
        $('#result').html(value);
    })

})();
