jQuery.noConflict();
jQuery(document).ready(function ($) {

    // =============================== Magic Line ====================
    var down = false;
    var magicboxLeft = jQuery('.magic-box').offset().left;

    jQuery("#magic-design").on('mousedown', '.arrows-line', function () {
        down = true;
        jQuery(this).parent().addClass('pointer');

    });
    jQuery('.magic-box').on('mouseup', function (up) {
        down = false;
        jQuery('.magic-box').removeClass('pointer');
        var osX = up.pageX;
        var relX = osX - magicboxLeft;
        jQuery('.image-2').width(relX);
        var ImgWidth = jQuery('.image-2').width();
        jQuery('.arrows-line').css({ 'left': ImgWidth + 'px' });
    })
    jQuery(document).on('click', '#magic-design', function () {
        down = false;
        jQuery('.magic-box').removeClass('pointer');
        jQuery('.image-2').removeAttr('style');
        jQuery('.arrows-line').removeAttr('style');
    })

    jQuery('#magic-design').on('mousemove', function (e) {
        if (down) {
            var osX = e.pageX;
            var relX = osX - magicboxLeft;
            jQuery('.image-2').width(relX);
            var ImgWidth = jQuery('.image-2').width();
            jQuery('.arrows-line').css({ 'left': ImgWidth + 'px' });
        }
    })
    jQuery('#magic-design').attr('unselectable', 'on').select(function () { return false }).css({
        '-moz-user-select': '-moz-none',
        '-o-user-select': 'none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        'user-select': 'none'
    });
    jQuery('#morphing_link').on('click', function () {
        jQuery('.magic-box').addClass('morphing').removeClass('retouch');
        jQuery(this).toggleClass('active');
        jQuery('#retouch_link').removeClass('active');

    })
    jQuery('#retouch_link').on('click', function () {
        jQuery('.magic-box').addClass('retouch').removeClass('morphing');
        jQuery(this).toggleClass('active');
        jQuery('#morphing_link').removeClass('active');
    })
    // =============================== ./ Magic Line =================
});