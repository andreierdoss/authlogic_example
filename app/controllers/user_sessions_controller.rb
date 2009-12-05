class UserSessionsController < ApplicationController
  before_filter :require_no_user, :only => [:new, :create]
  before_filter :require_user, :only => :destroy
  
  def new
    sleep 5
    @user_session = UserSession.new
    render :layout => !request.xhr?
  end
  
  def create
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      login_message = "Login successful!"
      if request.xhr?
        render :text => login_message
      else
        params[:flash] = login_message
        redirect_back_or_default account_url
      end
    else
      if request.xhr?
        render :text => 'Invalid login/password combination', :status => 406
      else
        render :action => :new
      end
    end
  end
  
  def destroy
    current_user_session.destroy
    flash[:notice] = "Logout successful!"
    redirect_back_or_default new_user_session_url
  end
end
