$(document).ready(function() {

$('.menu-mobile').click(

  function () {
    $('.content-nav').toggleClass('active');
  });

  $('.js_acc_trigger.active .acc_item_description').show();


      $('.js_acc_trigger').on('click', function(){
          var item = $(this);
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
