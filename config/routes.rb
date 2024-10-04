Rails.application.routes.draw do
  devise_for :users
  resources :posts
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  
  direct :cdn_image do |blob|
    # Preserve the behaviour of `rails_blob_url` inside these environments
    # where S3 or the CDN might not be configured
    if Rails.application.credentials.dig(:aws, :s3, :active_storage_asset_host) && blob&.key
     File.join(Rails.application.credentials.dig(:aws, :s3, :active_storage_asset_host), blob.key)
    else
     route =
        # ActiveStorage::VariantWithRecord was introduced in Rails 6.1
       # Remove the second check if you're using an older version
       if blob.is_a?(ActiveStorage::Variant) || blob.is_a?(ActiveStorage::VariantWithRecord)
          :rails_representation
       else
          :rails_blob
       end
     route_for(route, blob)
    end
    end

  # Defines the root path route ("/")
  root "posts#index"
end
