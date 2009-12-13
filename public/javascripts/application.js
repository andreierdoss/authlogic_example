var MyApp = (function($){
  $.facebox.settings.loadingImage = '/javascripts/facebox/loading.gif';
  $.facebox.settings.closeImage = '/javascripts/facebox/closelabel.gif';
  var formSpinner = $('<img class="spinner" src="/javascripts/facebox/loading.gif" width="20" height="20" />');

  $().ajaxError(function(event, xhr, options, error) {
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
    MyApp.ajaxifyLink('a[rel*=facebox]');
    MyApp.ajaxifyForm('form[rel*=facebox]');

    $('a[href=/user_session/new]').click(function(){
      MyApp.renderLoginForm();
      return false;
    });
  });

  function afterLogin(data) {
    $('#user_links').html('<a href="/account">My Account</a> | ').append(
      $('<a href="#">Logout</a>').click(function(){
        $('<form action="/user_session" method="post"><input type="hidden" name="_method" value="delete" /></form>').appendTo('body').submit();
      })
    );

    $('#flash_notice').text(data);
    if(!MyApp.$clickback && !MyApp.$submitback) $(document).trigger('close.facebox');
    if(MyApp.$clickback) MyApp.$clickback.click();
    if(MyApp.$submitback) MyApp.$submitback.submit();
    MyApp.$clickback = MyApp.$submitback = null;
  }

  return {
    renderLoginForm: function(){
      $.facebox(function(){
        $.get('/user_session/new',
              null,
              function(data){
                $.facebox(data);
                MyApp.ajaxifyForm('#facebox form.new_user_session', afterLogin);
              },
              'html');
      });
    },

    ajaxifyLink: function(link,options){
      if(typeof(options) === 'function') options = {success: options}
      $(link).click(function() {
        var me = $(this);
        var defaults = {
            url: me.attr('href'),
            type: 'GET',
            dataType: 'html',
            success: function(data) { $.facebox(data); },
            error: function(xhr) { if(xhr.status == 401) MyApp.$clickback = me; }
        };
        var settings = $.extend(defaults,options);
        $.facebox(function() { $.ajax(settings); });
        return false;
      });
    },

    ajaxifyForm: function(form,options){
      if(typeof(options) === 'function') options = {success: options};
      $(form).submit(function(){
        var me = $(this);
        var defaults = {
          type: 'POST',
          url: me.attr('action'),
          data: me.serialize(),
          dataType: 'html',
          beforeSend: function() { me.find('input[type=submit]').after(formSpinner); me.find('input[type=submit]').attr('disabled','disabled'); },
          complete: function() { me.find('.spinner').remove(); me.find('input[type=submit]').removeAttr('disabled'); },
          success: function(data) {$.facebox(data);},
          error: function(xhr) { if(xhr.status == 401) MyApp.$submitback = me; }
        };
        var settings = $.extend(defaults,options);
        $.ajax(settings);
        return false;
      });
    }
  }
})(jQuery);
