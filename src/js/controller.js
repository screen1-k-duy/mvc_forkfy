import * as model from './model.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
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
    recipeView.renderError(
      `No recipes found for your query. Please try again!`
    );
  }
};

const controlSearchResults = async function () {
  try {
    // show icon load
    resultsView.renderSpinner();
    // get search data
    const query = searchView.getQuery();
    if (!query) return;

    // load search
    await model.loadSearchResults(query);

    // render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // render pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(`Not Found!!!`);
  }
};

const controlPagination = function (goToPage) {
  // 
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.update(model.state.search);
};


const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);


};

init();
