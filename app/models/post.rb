class Post < ApplicationRecord
  has_one_attached :image do |attachable|
    attachable.variant :thumb, resize_to_limit: [150, 150]
    attachable.variant :medium, resize_to_limit: [400, 400]
    attachable.variant :large, resize_to_limit: [900, 900]
  end
  
  belongs_to :user

  validates :caption, presence: true
  validates :image, presence: true

  scope :latest, -> { order(created_at: :desc) }
end
