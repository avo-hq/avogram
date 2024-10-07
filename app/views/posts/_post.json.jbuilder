json.id post.id
json.caption post.caption
json.created_at post.created_at
json.updated_at post.updated_at
json.image_url rails_blob_url(post.image, host: request.base_url)
json.url url_for(post)