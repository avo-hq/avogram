# app/controllers/concerns/cloudfrontable.rb
# frozen_string_literal: true

module Cloudfrontable
  extend ActiveSupport::Concern

  # Returns the Cloudfront URL for the given blob.
  def cloudfront_url(blob, options = {})
    uri = URI.parse("https://#{Rails.application.config.aws_cloudfront_domain}/#{blob.key}")
    query = [
      "response-content-type=#{URI.encode_www_form_component content_type(blob)}",
      "response-content-disposition=#{URI.encode_www_form_component(options[:disposition] || default_content_disposition(blob))}",
    ].compact.join('&')
    uri.query = query

    signer = Aws::CloudFront::UrlSigner.new(
      key_pair_id: Rails.application.config.aws_cloudfront_key_pair_id,
      private_key_path: Rails.application.config.aws_cloudfront_private_key_path,
    )

    signer.signed_url(
      uri.to_s,
      expires: Time.now.utc.to_i + ActiveStorage.service_urls_expire_in.to_i,
    )
  end

  private

  def default_content_disposition(blob)
    "inline; filename=\"#{filename(blob)}\"; filename*=UTF-8''#{filename(blob)}"
  end

  def amazon?
    Rails.application.config.active_storage.service == :amazon
  end

	# These two methods are needed in case you use variants. You'll need to make some changes
	# if you don't use variants with records.
  def content_type(blob)
    blob.is_a?(ActiveStorage::VariantWithRecord) ? blob.image.content_type : blob.content_type
  end

  def filename(blob)
    blob.is_a?(ActiveStorage::VariantWithRecord) ? blob.image.filename : blob.filename
  end
end