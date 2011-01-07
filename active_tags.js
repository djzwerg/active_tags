// $Id$

/**
 * @file
 * Changes taxonomy tags fields to Active Tags style widgets.
 */

(function ($) {

var activeTags = {};

activeTags.parseCsv = function (sep, string) {
  for (var result = string.split(sep = sep || ","), x = result.length - 1, tl; x >= 0; x--) {
    if (result[x].replace(/"\s+$/, '"').charAt(result[x].length - 1) == '"') {
      if ((tl = result[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        result[x] = result[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      }
      else if (x) {
        result.splice(x - 1, 2, [result[x - 1], result[x]].join(sep));
      }
      else {
        result = result.shift().split(sep).concat(result);
      }
    }
    else {
      result[x].replace(/""/g, '"');
    }
  }
  return result;
};

activeTags.checkEnter = function (event) {
  if (event.keyCode == 13) {
    $('#autocomplete').each(function () {
      this.owner.hidePopup();
    });
    $(this).next().click();
    event.preventDefault();
    return false;
  }
}

activeTags.addTermOnSubmit = function () {
  $('.at-add-btn').click();
}

activeTags.addTerm = function () {
  alert('hello world');
}

/**
 * Theme a selected term.
 */
Drupal.theme.prototype.activeTagsTerm = function (value) {
  return '<div class="at-term"><span class="at-term-text">' + value + '</span><span class="at-term-remove">x</span></div> ';
};
/*
Drupal.behaviors.activeTagsAutocomplete = function (context) {
  $('li:not(.activeTagsAutocomplete-processed)', context)
    .addClass('activeTagsAutocomplete-processed')
    .each(function () {
      var li = this;
      $(li).focus(function () {
        $('#autocomplete').each(function () {
          this.owner.input.value = $(li).text();
        });
      }).mousedown(function () {
        $('input.add-tag').click();
        $('input.add-tag').prev().val('');
      });
  });
}
*/

Drupal.behaviors.activeTagsOnEnter = {
  attach: function (context, settings) {
    if ($.browser.mozilla) {
      $('.at-term-entry:not(.activeTagsOnEnter-processed)')
        .addClass('activeTagsOnEnter-processed')
        .keypress(activeTags.checkEnter);
    }
    else {
      $('.at-term-entry:not(.activeTagsOnEnter-processed)')
        .addClass('activeTagsOnEnter-processed')
        .keydown(activeTags.checkEnter);
    }
  }
};

Drupal.behaviors.activeTagsRemove = {
  attach: function (context, settings) {
    $('div.at-term:not(.activeTagsRemove-processed)', context)
      .addClass('activeTagsRemove-processed')
      .each(function () {
        $(this).click(activeTags.addTerm);
      });
  }
};


$(window).load(function () {
  // Setup tags to be added on form submit.
  $('#node-form').submit(activeTags.addTagOnSubmit);
});

})(jQuery);
