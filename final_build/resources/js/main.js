$(document).ready(function() {

// sync column heights
var right_col_height = $('.content-nav.vanish_mobile').outerHeight(true);
var left_col_height = $('.content-main').outerHeight(true);
var footer = $('.content-main_footer');

if (footer.length && right_col_height > left_col_height) {
  footer.css('margin-top', right_col_height - left_col_height)
}


$('.menu-mobile').click(

  function () {
    $('.content-nav').toggleClass('active');
  });

  $('.js_acc_trigger.active .acc_item_description').show();


      $('.acc_item_title').on('click', function(){
          var item = $(this).closest('.js_acc_trigger');
          if(!item.hasClass('active')){
              item.addClass('active');
              item.find('.acc_item_description').slideDown();
          }
          else{
              item.removeClass('active');
              item.find('.acc_item_description').slideUp();
          }
    });
});

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
