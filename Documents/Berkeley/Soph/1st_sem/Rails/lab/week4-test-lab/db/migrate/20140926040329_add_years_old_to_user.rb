class AddYearsOldToUser < ActiveRecord::Migration
  def change
    add_column :users, :yearsold, :integer
  end
end
