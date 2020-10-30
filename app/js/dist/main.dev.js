"use strict";

$(function () {
  $('.main_menu .categories .title').click(function () {
    $(this).parent().toggleClass('open');
  }); //mask

  jQuery.fn.putCursorAtEnd = function () {
    return this.each(function () {
      var $el = $(this),
          el = this;

      if (!$el.is(":focus")) {
        $el.focus();
      }

      if (el.setSelectionRange) {
        var len = $el.val().length * 2;
        setTimeout(function () {
          el.setSelectionRange(len, len);
        }, 1);
      } else {
        $el.val($el.val());
      }

      this.scrollTop = 999999;
    });
  };

  $("[name=phone], [name=telephone]").mask("+7 (000) 000-00-00");
  $('[name=phone]').focus(function () {
    if ($(this).val() == '') {
      $(this).putCursorAtEnd().val('+7 (').putCursorAtEnd();
    }
  });
  $('[name=phone]').focusout(function () {
    if ($(this).val() == '+7 (') {
      $(this).val('');
    }
  }); //mask
  // easybox.open({href:'#thanks'})
});