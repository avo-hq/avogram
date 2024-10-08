class CreateArticles < ActiveRecord::Migration[7.2]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :content
      t.string :slug

      t.timestamps
    end

    add_index :articles, :slug, unique: true
  end
end
