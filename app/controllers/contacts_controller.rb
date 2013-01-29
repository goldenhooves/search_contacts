class ContactsController < ApplicationController
  def index
    @contacts = Contact.all
    
    respond_to do |format|
      format.html
      format.json { render json: @contacts.to_json }
    end
  
  end

end
