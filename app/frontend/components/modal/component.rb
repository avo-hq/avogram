class Modal::Component < ApplicationViewComponent
  attr_reader :title, :open_text

  renders_one :body
  renders_one :button

  def initialize(title:, open_text: "Open")
    @title = title
    @open_text = open_text
  end
end