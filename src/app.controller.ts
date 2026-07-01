import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Header('Content-Type', 'text/html; charset=utf-8')
  index(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Book Library Dashboard</title>
    <style>
      :root {
        --bg: #f2f4f9;
        --surface: #ffffff;
        --surface-2: #f8f9fc;
        --ink: #1c2440;
        --muted: #6f7a9a;
        --line: #e6eaf4;
        --brand: #1f7ae0;
        --brand-2: #155fba;
        --accent: #13b4a7;
        --warning: #f59e0b;
        --danger: #ef4444;
        --shadow: 0 14px 30px rgba(18, 30, 60, 0.08);
        --radius: 0px;
        --heading-font: "Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--ink);
        font-family: "Avenir Next", "Segoe UI", sans-serif;
      }

      .shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 250px 1fr;
      }

      .sidebar {
        background: #1b2746;
        color: #dce5ff;
        padding: 22px 16px;
        border-right: 1px solid #25345d;
      }

      .brand {
        font-size: 24px;
        font-weight: 800;
        letter-spacing: 0.01em;
        margin-bottom: 22px;
      }

      .side-section {
        font-size: 11px;
        text-transform: uppercase;
        opacity: 0.7;
        letter-spacing: 0.09em;
        margin: 18px 0 10px;
      }

      .side-link {
        padding: 10px 10px;
        border-radius: 0;
        margin-bottom: 5px;
        background: transparent;
      }

      .side-link.active {
        background: rgba(88, 136, 255, 0.22);
      }

      .main {
        padding: 16px 18px 24px;
      }

      .topbar {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
      }

      .search {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 0;
        height: 42px;
        padding: 0 12px;
        font-size: 13px;
      }

      .top-actions {
        display: flex;
        gap: 8px;
      }

      .chip {
        min-width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        border-radius: 0;
        background: var(--surface);
      }

      .hero {
        margin-top: 12px;
        background: linear-gradient(102deg, #1f7ae0 0%, #0ea5e9 45%, #22c7b8 100%);
        color: #fff;
        border-radius: var(--radius);
        padding: 20px;
        box-shadow: var(--shadow);
      }

      .hero h1 {
        margin: 0;
        font-size: 34px;
        font-family: var(--heading-font);
        font-weight: 600;
      }

      .hero p {
        margin: 8px 0 0;
        font-size: 14px;
        opacity: 0.92;
      }

      .quick-cards {
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(4, minmax(110px, 1fr));
        gap: 10px;
      }

      .quick-card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 12px;
        box-shadow: var(--shadow);
      }

      .quick-title {
        color: var(--muted);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }

      .quick-value {
        margin-top: 6px;
        font-size: 24px;
        font-weight: 800;
        font-family: var(--heading-font);
      }

      .layout {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1.45fr 0.7fr;
        gap: 10px;
      }

      .panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 12px;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .panel-title {
        font-size: 17px;
        font-family: var(--heading-font);
        font-weight: 600;
      }

      .toolbar {
        display: grid;
        grid-template-columns: 1.1fr 1fr 80px 130px;
        gap: 6px;
        margin-bottom: 10px;
      }

      .toolbar input,
      .toolbar button,
      .form input,
      .form button,
      .form select {
        height: 34px;
        border: 1px solid var(--line);
        border-radius: 0;
        font-size: 12px;
        padding: 0 10px;
      }

      .toolbar button,
      .form button,
      .btn-primary {
        border: 0;
        background: var(--brand);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
      }

      .toolbar button:hover,
      .form button:hover,
      .btn-primary:hover {
        background: var(--brand-2);
      }

      .books-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(250px, 1fr));
        gap: 10px;
        align-content: start;
      }

      .books-viewport {
        min-height: 420px;
        max-height: 420px;
        overflow: hidden;
      }

      .book-card {
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: 0;
        padding: 10px;
      }

      .book-card.draggable {
        cursor: grab;
      }

      .book-card.draggable:active {
        cursor: grabbing;
      }

      .book-card.dragging {
        opacity: 0.5;
      }

      .book-card.drop-target {
        outline: 2px dashed var(--brand);
        outline-offset: 2px;
      }

      .book-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }

      .book-name {
        font-size: 15px;
        font-family: var(--heading-font);
        font-weight: 600;
      }

      .book-meta {
        color: var(--muted);
        font-size: 12px;
        margin-top: 2px;
      }

      .book-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 0;
        font-size: 10px;
        font-weight: 700;
        background: #e8eefb;
        color: #355088;
      }

      .tag.genre {
        background: #e6fbf7;
        color: #0f7d74;
      }

      .book-actions {
        display: flex;
        gap: 6px;
      }

      .btn-sm {
        height: 28px;
        border-radius: 0;
        border: 1px solid var(--line);
        background: #fff;
        padding: 0 9px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .btn-sm.edit {
        color: #1f7ae0;
      }

      .btn-sm.delete {
        color: var(--danger);
      }

      .side-stack {
        display: grid;
        gap: 10px;
      }

      .form {
        display: grid;
        gap: 6px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 100px;
        gap: 6px;
      }

      .popular-list,
      .recent-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .popular-item,
      .recent-item {
        border-top: 1px solid var(--line);
        padding: 8px 0;
        font-size: 12px;
      }

      .popular-item:first-child,
      .recent-item:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .lower {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .pagination {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }

      .pagination button {
        height: 30px;
        min-width: 74px;
        border-radius: 0;
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }

      .pagination button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .pagination-info {
        font-size: 12px;
        color: var(--muted);
        min-width: 110px;
        text-align: center;
      }

      .chart {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        min-height: 180px;
      }

      .bar-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 100%;
      }

      .bar {
        width: 100%;
        max-width: 42px;
        background: linear-gradient(180deg, #5da0ff 0%, #1f7ae0 100%);
        border-radius: 0;
      }

      .bar-date {
        font-size: 10px;
        color: var(--muted);
      }

      .bar-value {
        font-size: 10px;
        font-weight: 700;
      }

      .status {
        margin-top: 8px;
        color: var(--muted);
        font-size: 12px;
      }

      .status.error {
        color: #b91c1c;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(14, 23, 44, 0.42);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 40;
        padding: 14px;
      }

      .modal-backdrop.open {
        display: flex;
      }

      .modal {
        width: min(460px, 100%);
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 0;
        box-shadow: var(--shadow);
        padding: 14px;
      }

      .modal h3 {
        margin: 0;
        font-size: 20px;
      }

      .modal p {
        margin: 8px 0 12px;
        color: var(--muted);
        font-size: 13px;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .btn-secondary,
      .btn-danger {
        height: 32px;
        border-radius: 0;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .btn-secondary {
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink);
      }

      .btn-danger {
        border: 0;
        background: var(--danger);
        color: #fff;
      }

      @media (max-width: 1180px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          display: none;
        }
      }

      @media (max-width: 980px) {
        .layout,
        .lower {
          grid-template-columns: 1fr;
        }

        .quick-cards {
          grid-template-columns: repeat(2, minmax(110px, 1fr));
        }

        .books-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .toolbar {
          grid-template-columns: 1fr 1fr;
        }

        .form-row {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">EduAdmin</div>
        <div class="side-section">Components</div>
        <div class="side-link active">Book Dashboard</div>
        <div class="side-link">Catalog Manager</div>
        <div class="side-link">Authors</div>
        <div class="side-section">Insights</div>
        <div class="side-link">Recent Books</div>
        <div class="side-link">Popular Authors</div>
        <div class="side-link">Additions Chart</div>
      </aside>

      <main class="main">
        <section class="topbar">
          <input id="search-book" class="search" type="text" placeholder="Search by title or author" />
          <div class="top-actions">
            <div class="chip">B</div>
            <div class="chip">A</div>
            <div class="chip">+</div>
          </div>
        </section>

        <section class="hero">
          <h1>Book Library</h1>
          <p>Track your collection, monitor recent additions, and manage author popularity from one modern dashboard.</p>
        </section>

        <section class="quick-cards">
          <article class="quick-card">
            <div class="quick-title">Books</div>
            <div id="metric-books" class="quick-value">0</div>
          </article>
          <article class="quick-card">
            <div class="quick-title">Authors</div>
            <div id="metric-authors" class="quick-value">0</div>
          </article>
          <article class="quick-card">
            <div class="quick-title">Genres</div>
            <div id="metric-genres" class="quick-value">0</div>
          </article>
          <article class="quick-card">
            <div class="quick-title">Recent (7d)</div>
            <div id="metric-recent" class="quick-value">0</div>
          </article>
        </section>

        <section class="layout">
          <article class="panel">
            <div class="panel-head">
              <div class="panel-title">Current Books</div>
              <div id="books-count-label" class="quick-title">0 entries</div>
            </div>

            <div class="toolbar">
              <input id="filter-author" type="text" placeholder="Filter by author" />
              <input id="filter-genre" type="text" placeholder="Filter by genre" />
              <button id="refresh-btn" type="button">Refresh</button>
              <button id="generate-random-btn" type="button">Generate Random</button>
            </div>

            <div class="books-viewport">
              <div id="book-cards" class="books-grid"></div>
            </div>
            <div class="pagination">
              <button id="books-prev-btn" type="button">Previous</button>
              <div id="books-page-info" class="pagination-info">Page 1 / 1</div>
              <button id="books-next-btn" type="button">Next</button>
            </div>
          </article>

          <section class="side-stack">
            <article class="panel">
              <div class="panel-head">
                <div class="panel-title">Add Book</div>
              </div>
              <form id="book-form" class="form">
                <input name="title" type="text" placeholder="Title" required />
                <input name="author" type="text" placeholder="Author" required />
                <input name="isbn" type="text" placeholder="ISBN" required />
                <div class="form-row">
                  <input name="genre" type="text" placeholder="Genre" />
                  <input name="publishedYear" type="number" min="0" max="9999" placeholder="Year" required />
                </div>
                <button type="submit">+ Add Book</button>
              </form>
            </article>

            <article class="panel">
              <div class="panel-head">
                <div class="panel-title">Add Author</div>
              </div>
              <form id="author-form" class="form">
                <input name="name" type="text" placeholder="Name" required />
                <input name="nationality" type="text" placeholder="Nationality" />
                <input name="birthYear" type="number" min="0" max="9999" placeholder="Birth year" />
                <button type="submit">+ Add Author</button>
              </form>
            </article>

            <article class="panel">
              <div class="panel-head">
                <div class="panel-title">Most Popular Authors</div>
              </div>
              <ul id="popular-authors" class="popular-list"></ul>
            </article>
          </section>
        </section>

        <section class="lower">
          <article class="panel">
            <div class="panel-head">
              <div class="panel-title">Recent Books</div>
            </div>
            <ul id="recent-books" class="recent-list"></ul>
          </article>

          <article class="panel">
            <div class="panel-head">
              <div class="panel-title">Books Added by Date</div>
            </div>
            <div id="added-chart" class="chart"></div>
          </article>
        </section>

        <div id="status" class="status">Ready.</div>
      </main>
    </div>

    <div id="delete-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div class="modal">
        <h3 id="delete-title">Are you sure?</h3>
        <p>This action permanently removes the selected book.</p>
        <div class="modal-actions">
          <button id="cancel-delete-btn" type="button" class="btn-secondary">Cancel</button>
          <button id="confirm-delete-btn" type="button" class="btn-danger">Delete</button>
        </div>
      </div>
    </div>

    <div id="edit-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <div class="modal">
        <h3 id="edit-title">Edit Book</h3>
        <p>Update book details and save changes.</p>
        <form id="edit-book-form" class="form">
          <input name="title" type="text" placeholder="Title" required />
          <input name="author" type="text" placeholder="Author" required />
          <input name="isbn" type="text" placeholder="ISBN" required />
          <div class="form-row">
            <input name="genre" type="text" placeholder="Genre" />
            <input name="publishedYear" type="number" min="0" max="9999" placeholder="Year" required />
          </div>
          <div class="modal-actions">
            <button id="cancel-edit-btn" type="button" class="btn-secondary">Cancel</button>
            <button id="save-edit-btn" type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const state = {
        books: [],
        authors: [],
        pendingDeleteBookId: null,
        editingBook: null,
        addedById: {},
        draggingBookId: null,
        currentPage: 1,
        pageSize: 14,
      };

      const storageKey = 'book-library-added-by-id';

      const searchBookEl = document.getElementById('search-book');
      const filterAuthorEl = document.getElementById('filter-author');
      const filterGenreEl = document.getElementById('filter-genre');
      const refreshBtnEl = document.getElementById('refresh-btn');
      const generateRandomBtnEl = document.getElementById('generate-random-btn');
      const bookCardsEl = document.getElementById('book-cards');
      const popularAuthorsEl = document.getElementById('popular-authors');
      const recentBooksEl = document.getElementById('recent-books');
      const addedChartEl = document.getElementById('added-chart');
      const booksCountLabelEl = document.getElementById('books-count-label');
      const metricBooksEl = document.getElementById('metric-books');
      const metricAuthorsEl = document.getElementById('metric-authors');
      const metricGenresEl = document.getElementById('metric-genres');
      const metricRecentEl = document.getElementById('metric-recent');
      const statusEl = document.getElementById('status');
      const bookFormEl = document.getElementById('book-form');
      const authorFormEl = document.getElementById('author-form');
      const booksPrevBtnEl = document.getElementById('books-prev-btn');
      const booksNextBtnEl = document.getElementById('books-next-btn');
      const booksPageInfoEl = document.getElementById('books-page-info');

      const deleteModalEl = document.getElementById('delete-modal');
      const confirmDeleteBtnEl = document.getElementById('confirm-delete-btn');
      const cancelDeleteBtnEl = document.getElementById('cancel-delete-btn');

      const editModalEl = document.getElementById('edit-modal');
      const editBookFormEl = document.getElementById('edit-book-form');
      const cancelEditBtnEl = document.getElementById('cancel-edit-btn');

      function esc(value) {
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function todayKey() {
        return new Date().toISOString().slice(0, 10);
      }

      function readAddedStore() {
        try {
          const raw = localStorage.getItem(storageKey);
          if (!raw) {
            return {};
          }
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== 'object') {
            return {};
          }
          return parsed;
        } catch (err) {
          return {};
        }
      }

      function writeAddedStore() {
        localStorage.setItem(storageKey, JSON.stringify(state.addedById));
      }

      function ensureAddedDates() {
        const currentDate = todayKey();
        let changed = false;

        for (const book of state.books) {
          const id = String(book.id);
          if (!state.addedById[id]) {
            state.addedById[id] = currentDate;
            changed = true;
          }
        }

        const validIds = new Set(state.books.map((book) => String(book.id)));
        for (const id of Object.keys(state.addedById)) {
          if (!validIds.has(id)) {
            delete state.addedById[id];
            changed = true;
          }
        }

        if (changed) {
          writeAddedStore();
        }
      }

      function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.className = isError ? 'status error' : 'status';
      }

      function normalizeDateLabel(value) {
        return value.slice(5);
      }

      function dateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().slice(0, 10);
      }

      function reorderById(list, fromId, toId) {
        const fromIndex = list.findIndex((item) => String(item.id) === String(fromId));
        const toIndex = list.findIndex((item) => String(item.id) === String(toId));
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
          return false;
        }
        const moved = list.splice(fromIndex, 1)[0];
        list.splice(toIndex, 0, moved);
        return true;
      }

      function clearDropTargets(container) {
        container.querySelectorAll('.drop-target').forEach((node) => node.classList.remove('drop-target'));
      }

      function getFilteredBooks() {
        const search = searchBookEl.value.trim().toLowerCase();
        const authorFilter = filterAuthorEl.value.trim().toLowerCase();
        const genreFilter = filterGenreEl.value.trim().toLowerCase();

        return state.books.filter((book) => {
          const title = String(book.title || '').toLowerCase();
          const author = String(book.author || '').toLowerCase();
          const genre = String(book.genre || '').toLowerCase();

          const searchOk = !search || title.includes(search) || author.includes(search);
          const authorOk = !authorFilter || author.includes(authorFilter);
          const genreOk = !genreFilter || genre.includes(genreFilter);

          return searchOk && authorOk && genreOk;
        });
      }

      function renderMetrics(filteredBooks) {
        metricBooksEl.textContent = String(state.books.length);
        metricAuthorsEl.textContent = String(state.authors.length);

        const genres = new Set(state.books.map((book) => String(book.genre || '').trim()).filter(Boolean));
        metricGenresEl.textContent = String(genres.size);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        let recentCount = 0;
        for (const id of Object.keys(state.addedById)) {
          const dateValue = new Date(state.addedById[id]);
          if (dateValue >= sevenDaysAgo) {
            recentCount += 1;
          }
        }
        metricRecentEl.textContent = String(recentCount);

        booksCountLabelEl.textContent = filteredBooks.length + ' entries';
      }

      function renderBookCards(filteredBooks) {
        const totalPages = Math.max(1, Math.ceil(filteredBooks.length / state.pageSize));
        if (state.currentPage > totalPages) {
          state.currentPage = totalPages;
        }
        const startIndex = (state.currentPage - 1) * state.pageSize;
        const pageBooks = filteredBooks.slice(startIndex, startIndex + state.pageSize);

        booksPageInfoEl.textContent = 'Page ' + state.currentPage + ' / ' + totalPages;
        booksPrevBtnEl.disabled = state.currentPage <= 1;
        booksNextBtnEl.disabled = state.currentPage >= totalPages;

        if (filteredBooks.length === 0) {
          bookCardsEl.innerHTML = '<article class="book-card">No books match the current filters.</article>';
          return;
        }

        bookCardsEl.innerHTML = pageBooks
          .map((book) => {
            const addedDate = state.addedById[String(book.id)] || todayKey();
            return (
              '<article class="book-card draggable" draggable="true" data-book-id="' + esc(book.id) + '">' +
              '<div class="book-top">' +
              '<div>' +
              '<div class="book-name">' + esc(book.title) + '</div>' +
              '<div class="book-meta">' + esc(book.author) + '</div>' +
              '</div>' +
              '<div class="book-actions">' +
              '<button class="btn-sm edit" data-edit-book-id="' + esc(book.id) + '">Edit</button>' +
              '<button class="btn-sm delete" data-delete-book-id="' + esc(book.id) + '">Delete</button>' +
              '</div>' +
              '</div>' +
              '<div class="book-tags">' +
              '<span class="tag">ISBN ' + esc(book.isbn) + '</span>' +
              '<span class="tag">Year ' + esc(book.publishedYear) + '</span>' +
              '<span class="tag genre">' + esc(book.genre || 'Uncategorized') + '</span>' +
              '<span class="tag">Added ' + esc(addedDate) + '</span>' +
              '</div>' +
              '</article>'
            );
          })
          .join('');
      }

      function renderRecentBooks() {
        const ordered = [...state.books].sort((a, b) => {
          const aDate = state.addedById[String(a.id)] || '';
          const bDate = state.addedById[String(b.id)] || '';
          return bDate.localeCompare(aDate);
        });

        if (ordered.length === 0) {
          recentBooksEl.innerHTML = '<li class="recent-item">No recent books.</li>';
          return;
        }

        recentBooksEl.innerHTML = ordered
          .slice(0, 8)
          .map((book) => {
            const addedDate = state.addedById[String(book.id)] || todayKey();
            return (
              '<li class="recent-item">' +
              '<strong>' + esc(book.title) + '</strong><br />' +
              '<span style="color: var(--muted);">' + esc(book.author) + ' · Added ' + esc(addedDate) + '</span>' +
              '</li>'
            );
          })
          .join('');
      }

      function renderPopularAuthors() {
        const counter = {};
        for (const book of state.books) {
          const key = String(book.author || '').trim() || 'Unknown';
          counter[key] = (counter[key] || 0) + 1;
        }

        const ranked = Object.entries(counter).sort((a, b) => b[1] - a[1]);

        if (ranked.length === 0) {
          popularAuthorsEl.innerHTML = '<li class="popular-item">No author stats yet.</li>';
          return;
        }

        popularAuthorsEl.innerHTML = ranked
          .slice(0, 6)
          .map(
            ([name, count], index) =>
              '<li class="popular-item">#' + (index + 1) + ' <strong>' + esc(name) + '</strong> · ' + esc(count) + ' books</li>',
          )
          .join('');
      }

      function renderAdditionChart() {
        const counts = {};
        const now = new Date();
        const labels = [];
        for (let i = 6; i >= 0; i -= 1) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          const key = date.toISOString().slice(0, 10);
          labels.push(key);
          counts[key] = 0;
        }

        for (const id of Object.keys(state.addedById)) {
          const key = state.addedById[id];
          if (counts[key] !== undefined) {
            counts[key] += 1;
          }
        }

        const maxCount = Math.max(1, ...Object.values(counts));

        addedChartEl.innerHTML = labels
          .map((key) => {
            const value = counts[key];
            const height = Math.max(10, Math.round((value / maxCount) * 130));
            return (
              '<div class="bar-wrap">' +
              '<div class="bar-value">' + value + '</div>' +
              '<div class="bar" style="height:' + height + 'px"></div>' +
              '<div class="bar-date">' + normalizeDateLabel(key) + '</div>' +
              '</div>'
            );
          })
          .join('');
      }

      function renderAll() {
        const filtered = getFilteredBooks();
        renderMetrics(filtered);
        renderBookCards(filtered);
        renderRecentBooks();
        renderPopularAuthors();
        renderAdditionChart();
      }

      async function fetchJson(url, options) {
        const response = await fetch(url, options);
        if (!response.ok) {
          const fallbackMessage = response.status + ' ' + response.statusText;
          let payload = null;
          try {
            payload = await response.json();
          } catch (err) {
            payload = null;
          }
          throw new Error((payload && (payload.message || payload.error)) || fallbackMessage);
        }
        if (response.status === 204) {
          return null;
        }
        return response.json();
      }

      async function loadAll() {
        try {
          setStatus('Loading dashboard data...', false);
          let [books, authors] = await Promise.all([fetchJson('/api/books'), fetchJson('/api/authors')]);
          state.books = Array.isArray(books) ? books : [];
          state.authors = Array.isArray(authors) ? authors : [];

          if (state.books.length === 0 && state.authors.length === 0) {
            setStatus('Seeding initial dashboard demo data...', false);
            await generateRandomBooks(40);
            [books, authors] = await Promise.all([fetchJson('/api/books'), fetchJson('/api/authors')]);
            state.books = Array.isArray(books) ? books : [];
            state.authors = Array.isArray(authors) ? authors : [];
            state.currentPage = 1;
          }

          ensureAddedDates();
          renderAll();
          setStatus('Dashboard synced.', false);
        } catch (err) {
          setStatus('Could not load API data: ' + err.message, true);
        }
      }

      function openDeleteModal(bookId) {
        state.pendingDeleteBookId = String(bookId);
        deleteModalEl.classList.add('open');
      }

      function closeDeleteModal() {
        state.pendingDeleteBookId = null;
        deleteModalEl.classList.remove('open');
      }

      function openEditModal(bookId) {
        const found = state.books.find((book) => String(book.id) === String(bookId));
        if (!found) {
          setStatus('Book not found for editing.', true);
          return;
        }

        state.editingBook = found;
        editBookFormEl.elements.title.value = found.title || '';
        editBookFormEl.elements.author.value = found.author || '';
        editBookFormEl.elements.isbn.value = found.isbn || '';
        editBookFormEl.elements.genre.value = found.genre || '';
        editBookFormEl.elements.publishedYear.value = String(found.publishedYear || '');
        editModalEl.classList.add('open');
      }

      function closeEditModal() {
        state.editingBook = null;
        editModalEl.classList.remove('open');
      }

      function randomFrom(list) {
        return list[Math.floor(Math.random() * list.length)];
      }

      async function generateRandomBooks(count) {
        const left = ['Hidden', 'Silver', 'Silent', 'Digital', 'Final', 'Solar', 'Broken', 'Secret', 'Golden', 'Crystal', 'Ancient', 'Neon'];
        const right = ['Pages', 'Network', 'Library', 'Formula', 'Orbit', 'Code', 'Legacy', 'Index', 'Voyage', 'Cipher'];
        const genres = ['Fantasy', 'Science Fiction', 'Mystery', 'Historical', 'Thriller', 'Drama', 'Romance', 'Biography', 'Horror', 'Adventure'];
        const randomAuthorPool = ['A. Walker', 'M. Bennett', 'R. Quinn', 'L. Carter', 'N. Rivera', 'J. Young', 'K. Adams', 'D. Brooks', 'S. Reed', 'P. Morgan'];
        const existingAuthors = state.authors.map((author) => author.name).filter(Boolean);
        const pool = Array.from(new Set([...existingAuthors, ...randomAuthorPool]));

        const daysWindow = 10;
        const spreadDates = [];
        for (let i = 0; i < count; i += 1) {
          spreadDates.push(dateDaysAgo(i % daysWindow));
        }
        spreadDates.sort(() => Math.random() - 0.5);

        for (let i = 0; i < count; i += 1) {
          const chosenAuthor = randomFrom(pool);
          const addedDate = spreadDates[i];
          const payload = {
            title: randomFrom(left) + ' ' + randomFrom(right),
            author: chosenAuthor,
            isbn: 'RND-' + Date.now().toString(36) + '-' + i.toString(36) + '-' + Math.floor(Math.random() * 99999).toString(36),
            publishedYear: 1950 + Math.floor(Math.random() * 76),
            genre: randomFrom(genres),
          };

          if (!state.authors.some((author) => author.name === chosenAuthor)) {
            try {
              await fetchJson('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: chosenAuthor,
                  nationality: randomFrom(['US', 'UK', 'Canada', 'Spain', 'Greece', 'France', 'Germany']),
                  birthYear: 1940 + Math.floor(Math.random() * 55),
                }),
              });
            } catch (err) {
              // Ignore author creation conflicts and continue generating books.
            }
          }

          const created = await fetchJson('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (created && created.id !== undefined) {
            state.addedById[String(created.id)] = addedDate;
          }
        }

        writeAddedStore();
      }

      bookCardsEl.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const card = target.closest('[data-book-id]');
        if (!(card instanceof HTMLElement)) {
          return;
        }
        state.draggingBookId = card.getAttribute('data-book-id');
        card.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
        }
      });

      bookCardsEl.addEventListener('dragend', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          target.classList.remove('dragging');
        }
        state.draggingBookId = null;
        clearDropTargets(bookCardsEl);
      });

      bookCardsEl.addEventListener('dragover', (event) => {
        event.preventDefault();
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const card = target.closest('[data-book-id]');
        if (!(card instanceof HTMLElement)) {
          clearDropTargets(bookCardsEl);
          return;
        }
        clearDropTargets(bookCardsEl);
        card.classList.add('drop-target');
      });

      bookCardsEl.addEventListener('drop', (event) => {
        event.preventDefault();
        if (!state.draggingBookId) {
          return;
        }
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const card = target.closest('[data-book-id]');
        if (!(card instanceof HTMLElement)) {
          clearDropTargets(bookCardsEl);
          return;
        }

        const dropId = card.getAttribute('data-book-id');
        if (!dropId) {
          clearDropTargets(bookCardsEl);
          return;
        }

        const changed = reorderById(state.books, state.draggingBookId, dropId);
        clearDropTargets(bookCardsEl);
        if (changed) {
          renderAll();
          setStatus('Books reordered locally via drag and drop.', false);
        }
      });

      bookCardsEl.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const deleteId = target.getAttribute('data-delete-book-id');
        if (deleteId) {
          openDeleteModal(deleteId);
          return;
        }

        const editId = target.getAttribute('data-edit-book-id');
        if (editId) {
          openEditModal(editId);
        }
      });

      confirmDeleteBtnEl.addEventListener('click', async () => {
        if (!state.pendingDeleteBookId) {
          closeDeleteModal();
          return;
        }
        const deletingId = state.pendingDeleteBookId;
        closeDeleteModal();

        try {
          await fetchJson('/api/books/' + deletingId, { method: 'DELETE' });
          delete state.addedById[String(deletingId)];
          writeAddedStore();
          setStatus('Book deleted.', false);
          await loadAll();
        } catch (err) {
          setStatus('Delete failed: ' + err.message, true);
        }
      });

      cancelDeleteBtnEl.addEventListener('click', () => {
        closeDeleteModal();
        setStatus('Delete canceled.', false);
      });

      deleteModalEl.addEventListener('click', (event) => {
        if (event.target === deleteModalEl) {
          closeDeleteModal();
          setStatus('Delete canceled.', false);
        }
      });

      editBookFormEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!state.editingBook) {
          return;
        }

        const formData = new FormData(editBookFormEl);
        const payload = {
          title: String(formData.get('title') || '').trim(),
          author: String(formData.get('author') || '').trim(),
          isbn: String(formData.get('isbn') || '').trim(),
          publishedYear: Number(formData.get('publishedYear')),
          genre: String(formData.get('genre') || '').trim() || undefined,
        };

        try {
          await fetchJson('/api/books/' + state.editingBook.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          closeEditModal();
          setStatus('Book updated.', false);
          await loadAll();
        } catch (err) {
          setStatus('Edit failed: ' + err.message, true);
        }
      });

      cancelEditBtnEl.addEventListener('click', () => {
        closeEditModal();
        setStatus('Edit canceled.', false);
      });

      editModalEl.addEventListener('click', (event) => {
        if (event.target === editModalEl) {
          closeEditModal();
          setStatus('Edit canceled.', false);
        }
      });

      bookFormEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(bookFormEl);
        const payload = {
          title: String(formData.get('title') || '').trim(),
          author: String(formData.get('author') || '').trim(),
          isbn: String(formData.get('isbn') || '').trim(),
          publishedYear: Number(formData.get('publishedYear')),
          genre: String(formData.get('genre') || '').trim() || undefined,
        };

        try {
          const created = await fetchJson('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (created && created.id !== undefined) {
            state.addedById[String(created.id)] = todayKey();
            writeAddedStore();
          }
          bookFormEl.reset();
          setStatus('Book added.', false);
          await loadAll();
        } catch (err) {
          setStatus('Add book failed: ' + err.message, true);
        }
      });

      authorFormEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(authorFormEl);
        const birthYearRaw = String(formData.get('birthYear') || '').trim();
        const payload = {
          name: String(formData.get('name') || '').trim(),
          nationality: String(formData.get('nationality') || '').trim() || undefined,
          birthYear: birthYearRaw ? Number(birthYearRaw) : undefined,
        };

        try {
          await fetchJson('/api/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          authorFormEl.reset();
          setStatus('Author added.', false);
          await loadAll();
        } catch (err) {
          setStatus('Add author failed: ' + err.message, true);
        }
      });

      searchBookEl.addEventListener('input', () => {
        state.currentPage = 1;
        renderAll();
      });
      filterAuthorEl.addEventListener('input', () => {
        state.currentPage = 1;
        renderAll();
      });
      filterGenreEl.addEventListener('input', () => {
        state.currentPage = 1;
        renderAll();
      });

      booksPrevBtnEl.addEventListener('click', () => {
        if (state.currentPage > 1) {
          state.currentPage -= 1;
          renderAll();
        }
      });

      booksNextBtnEl.addEventListener('click', () => {
        state.currentPage += 1;
        renderAll();
      });

      refreshBtnEl.addEventListener('click', loadAll);

      generateRandomBtnEl.addEventListener('click', async () => {
        const answer = prompt('How many random sets should I generate? (5 = 50 books)', '5');
        if (answer === null) {
          setStatus('Random generation canceled.', false);
          return;
        }

        const multiplier = Number.parseInt(answer.trim(), 10);
        if (!Number.isInteger(multiplier) || multiplier <= 0 || multiplier > 20) {
          setStatus('Please enter a whole number multiplier between 1 and 20.', true);
          return;
        }

        const totalCount = multiplier * 10;

        try {
          setStatus('Generating ' + totalCount + ' random books...', false);
          await generateRandomBooks(totalCount);
          await loadAll();
          setStatus('Added ' + totalCount + ' random books with randomized author, year, category, and added date.', false);
        } catch (err) {
          setStatus('Random generation failed: ' + err.message, true);
        }
      });

      state.addedById = readAddedStore();
      loadAll();
    </script>
  </body>
</html>`;
  }
}
