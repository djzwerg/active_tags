
/**
 * @file
 * Changes taxonomy tags fields to Active Tags style widgets.
 */

(function ($) {

var activeTags = {};

activeTags.parseCsv = function (string, sep) {
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
    var fieldId = activeTags.hideACPopup(event.target.id);
    $(fieldId).find('.at-add-btn').click();
    event.preventDefault();
    return false;
  }
};

activeTags.hideACPopup = function (id) {
  // Find the field name containing this active tag autocomplete.
  // @todo: consider different methods to access field id.
  // .form-wrapper may cause issues if using a theme that strips field classes.
  // div[id] was previously attempted, but does not work with the keyboard.
  var field = $('#' + id).parent().closest('.form-wrapper');
  var fieldId = '#' + $(field).attr("id");
  var acId = '';
  // Loop through each child div searching for "ul" tag, which is the autocomplete.
  $(fieldId + ' > div').children('div').each(function () {
    if ($(this).has('ul').length > 0) {
      // Core autocomplete uses an id. Replacements might use class.
      if (typeof $(this).attr('id') !== "undefined") {
        acId = '#' + $(this).attr('id');
      }
      else if (typeof $(this).attr('class') !== "undefined") {
        acId = '.' + $(this).attr('class');
      }
    }
  });
  // If we found an identifier for the autocomplete, hide its popup.
  if (acId != '') {
    $(fieldId + ' ' + acId).each(function () {
      this.owner.hidePopup();
    });
  }
  return fieldId;
};

activeTags.addTermOnSubmit = function () {
  $('.at-add-btn').click();
};

activeTags.addTerms = function (context, terms) {
  terms = activeTags.parseCsv(terms);
  for (i in terms) {
    activeTags.addTerm(context, terms[i]);
  }
};

activeTags.addTerm = function (context, term) {
  // Hide the autocomplete drop down.
  activeTags.hideACPopup(context.id);

  // Removing all HTML tags. Need to wrap in tags for text() to work correctly.
  term = $('<div>' + term + '</div>').text();
  term = Backdrop.checkPlain(term);
  term = jQuery.trim(term);

  if (term != '') {
    var termDiv = $(context);
    var termList = termDiv.parent().find('.at-term-list');
    termList.append(Backdrop.theme('activeTagsTermRemove', term));
    // Attach behaviors to new DOM content.
    Backdrop.attachBehaviors(termList);
    activeTags.updateFormValue(termList);
    termList.parent().find('.at-term-entry').val('');
  }

  return false;
};

activeTags.removeTerm = function (context) {
  var tag = $(context);
  var termList = tag.parent();
  tag.remove();
  activeTags.updateFormValue(termList);
};

activeTags.updateFormValue = function (termList) {
  var tags = '';
  termList.find('.at-term-text').each(function (i) {
    // Get tag and revome quotes to prevent doubling
    var tag = $(this).text().replace(/["]/g, '');
    // Wrap in quotes if tag contains a comma.
    if (tag.search(',') != -1) {
      tag = '"' + tag + '"';
    }
    // Collect tags as a comma seperated list.
    tags = (i == 0) ? tag : tags + ', ' + tag;
  });
  // Set comma seperated tags as value of form field.
  termList.parent().find('input.at-terms').val(tags);
};

/**
 * Theme a selected term.
 */
Backdrop.theme.prototype.activeTagsTermRemove = function (term) {
  return '<div class="at-term at-term-remove"><span class="at-term-text">' + term + '</span><span class="at-term-action-remove">x</span></div> ';
};

Backdrop.behaviors.activeTagsOnEnter = {
  attach: function (context, settings) {
    if (navigator.userAgent.startsWith("Mozilla")) {
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

Backdrop.behaviors.activeTagsRemove = {
  attach: function (context, settings) {
    $('div.at-term-remove:not(.activeTagsRemove-processed)', context)
      .addClass('activeTagsRemove-processed')
      .each(function () {
        $(this).click(function () {
          activeTags.removeTerm(this);
        })
      });
  }
};

Backdrop.behaviors.activeTagsAdd = {
  attach: function (context, settings) {
    $('.at-add-btn:not(.activeTagsAdd-processed)', context)
      .addClass('activeTagsAdd-processed')
      .each(function () {
        $(this).click(function (e) {
          var tag = $(this).parent().find('.at-term-entry').val().replace(/["]/g, '');
          if (Backdrop.settings.activeTags.mode === 'csv') {
            activeTags.addTerms(this, tag);
          }
          else {
            // Default to single tag entry mode.
            activeTags.addTerm(this, tag);
          }
          return false;
        });
      });
  }
};


$(window).on('load', function () {
  // Setup tags to be added on form submit.
  $('#node-form').on('submit', activeTags.addTagOnSubmit);
});

})(jQuery);
