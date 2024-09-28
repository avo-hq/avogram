class Post < ApplicationRecord
  has_one_attached :image

  validates :caption, presence: true
  validates :image, presence: true
end
