var jsLib = function($){
  $.facebox.settings.loadingImage = '/javascripts/facebox/loading.gif';
  $.facebox.settings.closeImage = '/javascripts/facebox/closelabel.gif';

  $().ajaxError(function(event, xhr, settings, error) {
    switch(xhr.status) {
      case 401:
        $(document).trigger('close.facebox');
        jsLib.renderLoginForm();
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
    jsLib.ajaxifyLink('a[rel*=facebox]');
  });

  return {
    ajaxifyLink: function(link) {
      $(link).click(function () {
        $(document).trigger('loading.facebox');
        var me = $(this);
        $.ajax({
          url: $(this).attr('href'),
          dataType: 'html',
          success: function(data) { $.facebox(data); },
          error: function() {
            jsLib.clickback = me;
          }
        });
        return false;
      });
    },

    ajaxifyForm: function(form,callback) {
      $(form).submit(function(){
        var me = $(this);
        console.log(me);
        var spinner = $('<img class="spinner" src="/javascripts/facebox/loading.gif" width="20" height="20" />');
        $.ajax({
          type: 'POST',
          url: $(this).attr('action'),
          data: $(this).serialize(),
          dataType: 'html',
          beforeSend: function() { me.append(spinner).show(); },
          complete: function() { me.find('.spinner').remove(); },
          success: callback,
          error: function() {
            jsLib.submitback = me;
          }
        });
        return false;
      });
    },

    renderLoginForm: function() {
      $.facebox(function(){
        $.get('/user_sessions/new',
              null,
              function(data){
                $.facebox(data);
                jsLib.ajaxifyForm('#new_user_session',jsLib.afterLogin);
              },
              'html');
      });
    },

    afterLogin: function(data) {
      if(jsLib.clickback) {
        $(jsLib.clickback).click();
      } else if(jsLib.submitback && jsLib.submitBack.id != $('#new_user_session').id) {
        $(jsLib.submitback).submit();
      }
    }
  }
}(jQuery);
