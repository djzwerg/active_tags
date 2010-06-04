// $Id$

Drupal.behaviors.activeTagsSettings = function(context) {
  $('#edit-tags').click(function() {
    if ($(this).is(':checked')) {
      $('#active-tags-wrapper').show();
    } else {
      $('#active-tags-wrapper').hide();
    }
  }).triggerHandler('click');
};
