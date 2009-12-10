class HomeController < ApplicationController
  before_filter :require_user, :only => :secret

  def secret
    sleep 2
    render :text => "Food flies to those who would have it flown to those they despise"
  end
end
