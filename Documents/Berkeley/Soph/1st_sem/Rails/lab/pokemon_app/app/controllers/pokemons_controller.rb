class PokemonsController < ApplicationController
  def new
    render 'new' # telling the action to render new.html.erb
                 # default; don't need to write explicity
  end

  def create
    @pokemon = Pokemon.new(pokemon_params)   # create new Pokemon
    @pokemon.save                            # save Pokemon
    redirect_to @pokemon                     # redirect to show action
  end

  def show
    @pokemon = Pokemon.find(params[:id])
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  # filters out unwanted params
  def pokemon_params
    params.require(:pokemon).permit(:name, :description)
  end
end
