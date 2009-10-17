// $Id$

function activeTagsParseCsv(sep, string) {
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
}

function activeTagsActivate(context) {
  var wrapper = $(context);
  if (wrapper.length == 1) {
    var tagarea = activeTagsWidget(context);
    wrapper.before(tagarea);
    Drupal.behaviors.autocomplete(document);
  }
  $('.add-tag:not(.tag-processed)').click(function() {
    var tag = $(this).prev().val().replace(/["]/g, '');
    if (jQuery.trim(tag) != '') {
      activeTagsAdd(context, tag);
    }
    activeTagsUpdate(context);
    $(this).prev().val('');
  }).addClass('tag-processed');

  if ($.browser.mozilla) {
    $('.tag-entry:not(.tag-processed)').keypress(activeTagsCheckEnter).addClass('tag-processed');
  }
  else {
    $('.tag-entry:not(.tag-processed)').keydown(activeTagsCheckEnter).addClass('tag-processed');
  }

  jQuery.each(activeTagsParseCsv(',', wrapper.find('input.form-text').attr('value')), function(i, v) {
    if (jQuery.trim(v) != '') {
      activeTagsAdd(context, v);
    }
  });

  wrapper.hide();
}

function activeTagsCheckEnter(event) {
  if (event.keyCode == 13) {
    $('#autocomplete').each(function() {
      this.owner.hidePopup();
    })
    $(this).next().click();
    event.preventDefault();
    return false;
  }
}

function activeTagsAdd(context, v) {
  if (jQuery.trim(v) != '') {
    $(context).prev().children('.tag-holder').append(Drupal.theme('activeTagsTerm', v));
    $('.remove-tag:not(.tag-processed)').click(function() {
      $(this).parent().remove();
      activeTagsUpdate(context);
    }).addClass('tag-processed');
  }
}

function activeTagsUpdate(context) {
  var wrapper = $(context);
  var textFields = wrapper.children('input.form-text');
  textFields.val('');
  wrapper.prev().children('.tag-holder').children().children('.tag-text').each(function(i) {
    // Get tag and revome quotes to prevent doubling
    var tag = $(this).text().replace(/["]/g, '');

    // Wrap in quotes if tag contains a comma.
    if (tag.search(',') != -1) {
      tag = '"' + tag + '"';
    }

    if (i == 0) {
      textFields.val(tag);
    }
    else {
      textFields.val(textFields.val() + ', ' + tag);
    }
  });
}

function activeTagsWidget(context) {
  var vid = context.substring(20, context.lastIndexOf('-'));
  return Drupal.theme('activeTagsWidget', context, vid);
}

/**
 * Theme a selected term.
 */
Drupal.theme.prototype.activeTagsTerm = function(value) {
  return '<div class="tag-tag"><span class="tag-text">' + value + '</span><span class="remove-tag">x</span></div>';
};

/**
 * Theme Active Tags widget.
 */
Drupal.theme.prototype.activeTagsWidget = function(context, vid) {
  var wrapper = $(context);
  var cleanId = context.replace('#', '');
  return '<div id="' + cleanId + '-activetags" class="form-item">' +
    '<label for="' + context + '-edit-tags">' + wrapper.find('label').text() + '</label>' +
    '<div class="tag-holder"></div>' +
    '<input type="text" class="tag-entry form-autocomplete" size="30" id="active-tag-edit0' + vid + '" />' +
    '<input type="button" value="' + Drupal.t('Add') + '" class="add-tag">' +
    '<input class="autocomplete" type="hidden" id="active-tag-edit0' + vid + '-autocomplete" ' +
    'value="' + $(context.replace('-wrapper', '-autocomplete')).val() + '" disabled="disabled" />' +
    '<div class="description">' + wrapper.find('.description').text() + '</div>' +
  '</div>';
};

Drupal.behaviors.tagger = function(context) {
  jQuery.each(Drupal.settings['active_tags'], function(i, v) {
    var wrapper = $(v);
    if (wrapper.length == 1 && !wrapper.hasClass('active-tags-processed')) {
      activeTagsActivate(v);
      wrapper.addClass('active-tags-processed');
    }
  });
}
