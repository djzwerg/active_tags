 // $Id$

Drupal.behaviors.taggerpop = function(context) {
  jQuery.each(Drupal.settings['active_tags_popular'], function(i, v) {
    var wrapper = $(v);
    if (wrapper.length == 1 && !wrapper.hasClass('active-tags-pop-processed')) {
      active_tags_popular_activate(v);
      wrapper.addClass('active-tags-pop-processed');
    }
  });
}

function active_tags_popular_activate(context) {
  var vid = context.substring(20,context.lastIndexOf('-'));
  var wrapper = $(context);
  $.ajax({
    type: "GET",
    url: Drupal.settings['active_tags_popular_callback'] + '/' + vid,
    dataType: 'json',
    success: function (matches) {
      var tagarea = Drupal.theme('activeTagPopular', context, matches);
      wrapper.after(tagarea);
      var str = wrapper.find('input.form-text').val();
      var pop_tags = wrapper.next().children('.tag-popular');
      pop_tags.children().filter(function(index) {
        return str.indexOf($(this).text()) >= 0;
      }).parent().remove();
      pop_tags.children('.add-tag-popular').click(function() {
        active_tags_add(context, $(this).prev().text());
        active_tags_update(context);
        $(this).parent().remove();
      });
    },
    error: function(xmlhttp) {
      alert(Drupal.ahahError(xmlhttp, Drupal.settings['active_tags_popular_callback']));
    }
  });
}

/**
 * Theme a popular tag.
 */
Drupal.theme.prototype.activeTagPopular = function(context, tags) {
  var content = '<div class="pop-tags">' + Drupal.t('Add popular tags: ');
  jQuery.each(tags, function(i, v) {
    var tagitem = '<div class="tag-popular"><span class="tag-text">' + v + '</span><span class="add-tag-popular">+</span></div>';
    content = content + tagitem;
  });
  return content + '</div>';
};
