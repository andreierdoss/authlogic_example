var MyApp = (function($){
  $.facebox.settings.loadingImage = '/javascripts/facebox/loading.gif';
  $.facebox.settings.closeImage = '/javascripts/facebox/closelabel.gif';

  $().ajaxError(function(event, xhr, settings, error) {
    switch(xhr.status) {
      case 401:
        MyApp.renderLoginForm();
        break;
      case 406:
        $('#errorExplanation').remove();
        $('#facebox form').prepend('<div id="errorExplanation" class="errorExplanation">\
                                     <h2>Dang you got errored!</h2>\
                                     <p>'+ xhr.responseText + '</p>\
                                    </div>');
        break;
    }
  });

  $(document).ready(function(){
    $('a[rel*=facebox]').click(function() {
      var me = this;
      $.facebox(function() {
        $.ajax({
          url: me.href,
          type: 'GET',
          success: function(data) { $.facebox(data); },
          error: function(xhr) {
            MyApp.$clickback = $(me);
          }
        });
      });
      return false;
    });

    $('a[href=/user_session/new]').click(function(){
      MyApp.renderLoginForm();
      return false;
    });
  });

  return {
    renderLoginForm: function(){
      $.facebox(function(){
        $.get('/user_session/new',
              null,
              function(data){
                $.facebox(data);
                MyApp.ajaxifyLoginForm();
              },
              'html');
      });
    },

    ajaxifyLoginForm: function(){
      $('#facebox .new_user_session').submit(function(){
        var me = $(this);
        $.ajax({
          type: 'POST',
          url: $(this).attr('action'),
          data: $(this).serialize(),
          dataType: 'html',
          success: function(data) {
            if(MyApp.$clickback) {
              MyApp.$clickback.click();
            } else {
              window.location = '/account';
            }
          },
          error: function(xhr) {}
        });
        return false;
      });
    }
  }
})(jQuery);
