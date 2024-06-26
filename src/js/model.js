import { API_URL, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query:'',
    page: 1,
    resultsPerPage:  RES_PER_PAGE,
    results: []
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data;
  return {
    id: recipe.recipe_id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: 4,
    cookingTime: 40,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {


    // const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    const data = await getJSON(`${API_URL}get?rId=${id}`);
    state.recipe = createRecipeObject(data);

  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function(query ){
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}search?q=${query}`)
    state.search.results =  data.recipes.map((recipe) =>{
      return{
        id: recipe.recipe_id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
      }
    })

  } catch (error) {
    console.log(`${err} 💥💥💥💥`);
    throw error;
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; 
  const end = page * state.search.resultsPerPage;

  console.log('getSearchResultsPage2',start,end);
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};
