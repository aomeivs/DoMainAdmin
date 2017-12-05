//发送验证码插件
;(function ($) {
    var defaluts={
        count:5//默认5秒倒计时
    }
    $.fn.extend({
        sendMessage:function (options) {
            var opts = $.extend({}, defaluts, options);

            //设置button效果，开始计时
            $(this).attr("disabled", "true");
            $(this).addClass('actived')
            $(this).text("" + opts.count +"s后重新发送" );

            var _this = this;
            var InterValObj = setInterval(function SetRemainTime() {
                if (opts.count <= 0) {
                    window.clearInterval(InterValObj);//停止计时器
                    $(_this).removeAttr("disabled");//启用按钮
                    $(_this).removeClass('actived')
                    $(_this).text("重新发送验证码");
                }
                else {
                    opts.count--;
                    $(_this).text("" + opts.count +"s后重新发送");
                }
            }, 1000);
        }
    })

})(jQuery)