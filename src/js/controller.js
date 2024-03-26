import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`No recipes found for your query. Please try again!`)
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if(!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.state.search.results);

  } catch (err) {
    resultsView.renderError(`Not Found!!!`)
  }
};

(function () {
  searchView.addHandlerSearch(controlSearchResults)
  recipeView.addHandlerRender(controlRecipes);
})()