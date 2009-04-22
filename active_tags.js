// $Id$

function activetags_activate(context) {
  var wrapper = $(context);
  if (wrapper.length == 1) {
    var tagarea = activetags_widget(context);
    wrapper.before(tagarea);
    Drupal.behaviors.autocomplete(document);
  }
  $('.add-tag:not(.tag-processed)').click(function() {
    jQuery.each($(this).prev().val().split(','), function(i, v) {
      if (jQuery.trim(v) != '') {
        activetags_add(context, v);
      }
    });
    activetags_update(context);
    $(this).prev().val('');
  }).addClass('tag-processed');

  if ($.browser.mozilla) {
    $('.tag-entry:not(.tag-processed)').keypress(activetags_check_enter).addClass('tag-processed');
  }
  else {
    $('.tag-entry:not(.tag-processed)').keydown(activetags_check_enter).addClass('tag-processed');
  }

  jQuery.each(wrapper.find('input.form-text').attr('value').split(','), function(i, v) {
    if (jQuery.trim(v) != '') {
      activetags_add(context, v);
    }
  });

  wrapper.hide();
}

function activetags_check_enter(event) {
  if (event.keyCode == 13) {
    $('#autocomplete').each(function() {
      this.owner.hidePopup();
    })
    $(this).next().click();
    event.preventDefault();
    return false;
  }
}

function activetags_add(context, v) {
  if (jQuery.trim(v) != '') {
    $(context).prev().children('.tag-holder').append('<div class="tag-tag"><span class="tag-text">' +
      jQuery.trim(v) + '</span><span class="remove-tag">x</span></div>');
    $('.remove-tag:not(.tag-processed)').click(function() {
      $(this).parent().remove();
      activetags_update(context);
    }).addClass('tag-processed');
  }
}

function activetags_update(context) {
  var wrapper = $(context);
  var text_fields = wrapper.children('input.form-text');
  text_fields.val('');
  wrapper.prev().children('.tag-holder').children().children('.tag-text').each(function(i) {
    if (i == 0) {
      text_fields.val($(this).text());
    }
    else {
      text_fields.val(text_fields.val() + ', ' + $(this).text());
    }
  });
}

function activetags_widget(context) {
  var vid = context.substring(20,context.lastIndexOf('-'));
  var wrapper = $(context);
  return '<div id="' + context + '-activetags" class="form-item">' +
    '<label for="' + context + '-edit-tags">' + wrapper.find('label').text() + '</label>' +
    '<div class="tag-holder"></div>' +
    '<input type="text" class="tag-entry form-autocomplete" size="30" id="active-tag-edit0' + vid + '" />' +
    '<input type="button" value="' + Drupal.t('add') + '" class="add-tag">' +
    '<input class="autocomplete" type="hidden" id="active-tag-edit0' + vid + '-autocomplete" ' +
    'value="' + $(context.replace('-wrapper', '-autocomplete')).val() + '" disabled="disabled" />' +
    '<div class="description">' + wrapper.find('.description').text() + '</div>' +
  '</div>';
}

Drupal.behaviors.tagger = function(context) {
  jQuery.each(Drupal.settings['active_tags'], function(i, v) {
    var wrapper = $(v);
    if (wrapper.length == 1 && !wrapper.hasClass('active-tags-processed')) {
      activetags_activate(v);
      wrapper.addClass('active-tags-processed');
    }
  });
}
