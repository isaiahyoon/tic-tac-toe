class RemoveAgeFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :age, :integer
  end
end
