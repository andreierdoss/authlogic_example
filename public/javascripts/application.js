$(document).ready(function(){
  $.facebox.settings.loadingImage = '/javascripts/facebox/loading.gif';
  $.facebox.settings.closeImage = '/javascripts/facebox/closelabel.gif';

  $('a[rel*=facebox]').click(function(){
    var me = this;
    $.facebox(function(){
      $.get(me.href,
            null,
            function(data){
              $.facebox(data);
              ajaxifyLoginForm();
            },
            'html');
    });
    return false;
  });

  function ajaxifyLoginForm() {
    $('#facebox .new_user_session').submit(function(){
      var me = $(this);
      $.ajax({
          type: 'POST',
          url: $(this).attr('action'),
          data: $(this).serialize(),
          dataType: 'html',
          success: function(data) { window.location = '/account'; },
          error: function(xhr) {
            if (xhr.status == '406') {
              $('#errorExplanation').remove();
              me.before('<div id="errorExplanation" class="errorExplanation">\
                           <h2>Dang you got errored!</h2>\
                           <p>'+ xhr.responseText + '</p>\
                         </div>');
            }
          }
      });
      return false;
    });
  }
});
