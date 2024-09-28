class ApplicationViewComponent < ViewComponentContrib::Base

  private
  def identifier
    @identifier ||= self.class.name.sub('::Component', '').underscore.sub('_', '-').split('/').join('--')
  end

  alias controller_name identifier
end
