class Post < ApplicationRecord
  has_one_attached :image
  belongs_to :user

  validates :caption, presence: true
  validates :image, presence: true

  scope :latest, -> { order(created_at: :desc) }
end
