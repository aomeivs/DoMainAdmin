//placeholder这个差价依然会在IE9下有问题。在多个层的隐藏和显示时，会存在显示找不到的问题。


if (!Array.prototype.indexOf)
    {
        Array.prototype.indexOf = function(elt /*, from*/)
        {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++)
            {
                if (from in this &&
                        this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

if (!window.console || !console.firebug){
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i)
        window.console[names[i]] = function() {}
}

/*
    $(function(){
        if(!placeholderSupport()){   // 判断浏览器是否支持 placeholder
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        };
    })
    function placeholderSupport() {
        return 'placeholder' in document.createElement('input');
    }
*/



/**
 * PlaceHolder组件
 * $(input).focusPic({
 *   word:     // @string 提示文本
 *   color:    // @string 文本颜色
 *   evtType:  // @string focus|keydown 触发placeholder的事件类型
 *   zIndex:   // 模拟placeholder的zIndex
 *   diffPaddingLeft: 距离左侧的left，光标位置可调，默认取输入域的paddingLeft+3
 * })
 *
 * NOTE：
 *   evtType默认是focus，即鼠标点击到输入域时默认文本消失，keydown则模拟HTML5 placeholder属性在Firefox/Chrome里的特征，光标定位到输入域后键盘输入时默认文本才消失。
 *   此外，对于HTML5 placeholder属性，IE10+和Firefox/Chrome/Safari的表现形式也不一致，因此内部实现不采用原生placeholder属性
 */
~function(win, $) {

    $.uiParse = function(action) {
        var arr = action.split('|').slice(1)
        var len = arr.length
        var res = [], exs
        var boo = /^(true|false)$/
        for (var i = 0; i < len; i++) {
            var item = arr[i]
            if (item == '&') {
                item = undefined
            } else if (exs = item.match(boo)) {
                item = exs[0] == 'true' ? true : false
            }
            res[i] = item
        }
        return res
    };

}(window, window.jQuery);

~function() {

    $.fn.placeholder = function(option, callback) {
        var settings = $.extend({
            word: '',
            color: '#999',
            evtType: 'focus',
            zIndex: 20,
            diffPaddingLeft: 3
        }, option)

        function bootstrap($that) {
            // some alias
            var word    = settings.word||$that.attr('placeholder')
            var color   = settings.color
            var evtType = settings.evtType
            var zIndex  = settings.zIndex
            var diffPaddingLeft = settings.diffPaddingLeft

            // default css
            var offset = $that.offset()
            var top    = offset.top
            var left   = offset.left
            var width       = $that.outerWidth()
            var height      = $that.outerHeight()
            var fontSize    = $that.css('font-size')
            var fontFamily  = $that.css('font-family')
            var paddingLeft = $that.css('padding-left')

            // process
            paddingLeft = parseInt(paddingLeft, 10) + diffPaddingLeft

            // redner
            var $placeholder = $('<span class="ie9placeholder">')
            $placeholder.css({
                position: 'absolute',
                zIndex: '20',
                top: top,
                left: left,
                color: color,
                width: (width - paddingLeft) + 'px',
                height: height + 'px',
                fontSize: fontSize,
                paddingLeft: paddingLeft + 'px',
                fontFamily: fontFamily
            }).text(word).hide()

            // textarea 不加line-heihgt属性
            if ($that.is('input')) {
                $placeholder.css({
                    lineHeight: height + 'px'
                })
            }
            $placeholder.appendTo(document.body)

            // 内容为空时才显示，比如刷新页面输入域已经填入了内容时
            var val = $that.val()
            if (val == '') {
                $placeholder.show()
            }

            function hideAndFocus() {
                $placeholder.hide()
                $that[0].focus()
            }
            function asFocus() {
                $placeholder.click(hideAndFocus)
                // IE有些bug，原本不用加此句
                $that.click(hideAndFocus)
                $that.blur(function() {
                    var txt = $that.val()
                    if (txt == '') {
                        $placeholder.show()
                    }
                })
            }
            function asKeydown() {
                $placeholder.click(function() {
                    $that[0].focus()
                })
            }

            if (evtType == 'focus') {
                asFocus()
            } else if (evtType == 'keydown') {
                asKeydown()
            }

            $that.keyup(function() {
                var txt = $that.val()
                if (txt == '') {
                    $placeholder.show()
                } else {
                    $placeholder.hide()
                }
            })
        }

        return this.each(function() {
            var $elem = $(this)
            bootstrap($elem)
            if ($.isFunction(callback)) callback($elem)
        })
    }


    /*
     * 自动初始化，配置参数按照使用频率先后排序，即最经常使用的在前，不经常使用的往后，使用默认参数替代
     *
     * 格式：data-ui="u-placeholder|word|evtType|color
     * 示例：data-ui="u-placeholder|默认文字
     *
     */
    $(function() {
        if(!placeholderSupport()){
            $('[placeholder]').each(function() {
                var $elem   = $(this)
                // 文本
                var word = $elem.attr('placeholder')
                $elem.placeholder({
                    word: word,
                    diffPaddingLeft:64
                })
            })
        }
        function placeholderSupport() {
            return 'placeholder' in document.createElement('input');
        }
    })

}();

