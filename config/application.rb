require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Avogram
  class Application < Rails::Application
    config.autoload_paths << Rails.root.join("app", "frontend", "components")
    config.view_component.preview_paths << Rails.root.join("app", "frontend", "components")
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # Configure ViewComponent contrib
    FRONTEND_PATH = 'app/frontend'
    VIEW_COMPONENTS_PATH = 'app/frontend/components'

    config.view_component.preview_paths << Rails.root.join(VIEW_COMPONENTS_PATH)
    config.view_component.view_component_path = VIEW_COMPONENTS_PATH
    config.importmap.cache_sweepers << Rails.root.join(FRONTEND_PATH)
    config.eager_load_paths << Rails.root.join(VIEW_COMPONENTS_PATH)
    config.assets.paths << Rails.root.join(FRONTEND_PATH)

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
