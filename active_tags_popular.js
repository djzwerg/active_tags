 // $Id$

Drupal.behaviors.taggerpop = function(context) {
  jQuery.each(Drupal.settings['active_tags_popular'], function(i, v) {
    var wrapper = $(v);
    if (wrapper.length == 1 && !wrapper.hasClass('active-tags-pop-processed')) {
      activetags_popular_activate(v);
      wrapper.addClass('active-tags-pop-processed');
    }
  });
}

function activetags_popular_activate(context) {
  var vid = context.substring(20,context.lastIndexOf('-'));
  var wrapper = $(context);
  $.ajax({
    type: "GET",
    url: Drupal.settings['active_tags_popular_callback'] + '/' + vid,
    dataType: 'json',
    success: function (matches) {
      var tagarea = activetags_popular_widget(context, matches);
      wrapper.after(tagarea);
      var str = wrapper.find('input.form-text').val();
      var pop_tags = wrapper.next().children('.tag-popular');
      pop_tags.children().filter(function(index) {
        return str.indexOf($(this).text()) >= 0;
      }).parent().remove();
      pop_tags.children('.add-tag-popular').click(function() {
        activetags_add(context, $(this).prev().text());
        activetags_update(context);
        $(this).parent().remove();
      });
    },
    error: function(xmlhttp) {
      alert(Drupal.ahahError(xmlhttp, Drupal.settings['active_tags_popular_callback']));
    }
  });
}

function activetags_popular_widget(context, tags) {
  var content = '<div class="pop-tags">' + Drupal.t('Add popular tags: ');
  jQuery.each(tags, function(i, v) {
    var tagitem = '<div class="tag-popular"><span class="tag-text">' + v + '</span><span class="add-tag-popular">+</span></div>';
    content = content + tagitem;
  });
  return content + '</div>';
}
