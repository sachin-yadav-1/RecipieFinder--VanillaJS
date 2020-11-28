// Import Files and Modules
import icons from "url:../img/icons.svg";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// State of the page persists after some changes in the code ( intead of reloading )
// if (module.hot) {
//   module.hot.accept();
// }

// Recipe Contoller
const controlRecipe = async function (req, res) {
	try {
		// Id from hash
		const id = window.location.hash.slice(1);
		if (!id) return;

		// Update Results View for Selected Item
		resultsView.update(model.getSearchResultsPage());

		// Loading Spinner
		recipeView.renderSpinner();

		// Get Data
		await model.loadRecipe(id);

		// Render Recipe UI
		recipeView.render(model.state.recipe);

		// Update Bookmarks
		bookmarksView.update(model.state.bookmarks);

		// Catch Error
	} catch (err) {
		recipeView.renderError();
		console.error(err);
	}
};

// Search Results
const ctrlSearchResults = async function () {
	try {
		// Get Query
		const query = searchView.getQuery();
		if (!query) return;

		// Loading Spinner
		resultsView.renderSpinner();

		await model.loadSearchResults(query);

		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// Pagination Buttons
		paginationView.render(model.state.search);

		// Catch
	} catch (err) {
		console.error(err);
	}
};

// Display Pagination
const ctrlPagination = function (goToPage) {
	// resultsView.render(model.state.search.results);
	resultsView.render(model.getSearchResultsPage(goToPage));

	// Pagination Buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update Servings
	model.updateServings(newServings);

	// Update View
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Add Bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Update View
	recipeView.update(model.state.recipe);

	// Render Bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();

		await model.uploadRecipe(newRecipe);

		// Render Recipe
		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderSuccess();

		// Render Bookmark
		bookmarksView.render(model.state.bookmarks);

		// Change ID in url
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// Close Modal after 2sec
		setTimeout(() => {
			addRecipeView.toggleWindow();
		}, 2500);

		// Catch
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

// Event Listeners for 'load' & 'hashchange'
const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.renderHandler(controlRecipe);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.renderHandler(ctrlSearchResults);
	paginationView.addHandlerClick(ctrlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
