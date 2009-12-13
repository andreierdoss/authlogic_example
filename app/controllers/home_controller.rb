class HomeController < ApplicationController
  before_filter :require_user, :only => :secret

  def secret
    sleep 2
    if request.get?
      render :text => "Food flies to those who would have it flown to those they despise"
    else
      render :text => "Be seeing you, #{params[:spy_name]}"
    end
  end
end
