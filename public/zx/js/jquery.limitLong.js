//    限制数位插件 IE>=9
(function ($) {
    var defaluts = {
//        默认限止6位
        num:6
    };
    var store_v = '';
    $.fn.extend({
        limiteLong:function (options) {
            var opts = $.extend({}, defaluts, options);
            $(this).on('input',function () {
                var temp_v = $(this).val();
                if(temp_v.length>options.num){
                    $(this).val(store_v)
                    return;
                }
                store_v = temp_v;
            })
        }
    })
})(jQuery);