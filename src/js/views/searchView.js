import View from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  // Search Input Value
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearFeilds();
    return query;
  }

  _clearFeilds() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // Render Handler
  renderHandler(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
