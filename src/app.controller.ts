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
    <title>Book Library</title>
    <style>
      :root {
        --bg: #efede3;
        --ink: #242220;
        --muted: #6a655e;
        --paper: #faf8f0;
        --card: #fdfcf8;
        --line: #d9d2c5;
        --accent: #1f6b66;
        --accent-2: #2f8f88;
        --danger: #b55151;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background: radial-gradient(circle at 10% 0%, #f8f6ef 0%, var(--bg) 55%);
      }

      .wrap {
        max-width: 1120px;
        margin: 22px auto 40px;
        padding: 0 14px;
      }

      .top {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: end;
      }

      .kicker {
        color: #8a6748;
        font-size: 10px;
        letter-spacing: 0.14em;
        font-weight: 700;
        text-transform: uppercase;
      }

      h1 {
        margin: 2px 0 6px;
        font-size: 58px;
        line-height: 0.92;
        letter-spacing: -0.02em;
      }

      .subtitle {
        margin: 0;
        color: var(--muted);
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        font-size: 12px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(2, 72px);
        gap: 8px;
      }

      .stat {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 4px;
        padding: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }

      .stat .n {
        display: block;
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
      }

      .stat .l {
        color: var(--muted);
        font-size: 10px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
      }

      .toolbar {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 108px 1fr 1fr 96px;
        gap: 6px;
        background: #2d2b29;
        border-radius: 4px;
        padding: 6px;
      }

      .toolbar input,
      .toolbar button {
        border: 1px solid #4a4641;
        border-radius: 3px;
        background: #f8f6ef;
        color: var(--ink);
        height: 28px;
        padding: 0 8px;
        font-size: 12px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
      }

      .toolbar button {
        background: var(--accent);
        border-color: #135651;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
      }

      .toolbar-label {
        color: #f8f6ef;
        font-size: 11px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        display: flex;
        align-items: center;
        padding-left: 6px;
      }

      .layout {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1.35fr 0.55fr;
        gap: 10px;
      }

      .panel {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 4px;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.06);
        padding: 10px;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .panel-kicker {
        color: #c27d4f;
        font-size: 9px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .panel-title {
        margin-top: 1px;
        font-size: 15px;
        font-weight: 700;
      }

      .book-list,
      .author-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .book-item,
      .author-item {
        border: 1px solid var(--line);
        border-radius: 3px;
        background: #fff;
        padding: 8px;
        margin-bottom: 7px;
      }

      .draggable-item {
        cursor: grab;
      }

      .draggable-item:active {
        cursor: grabbing;
      }

      .dragging {
        opacity: 0.55;
      }

      .drop-target {
        outline: 2px dashed var(--accent);
        outline-offset: 2px;
      }

      .book-top {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px;
      }

      .book-title {
        font-weight: 700;
        font-size: 13px;
      }

      .meta {
        color: var(--muted);
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        font-size: 11px;
      }

      .book-meta {
        margin-top: 7px;
        display: grid;
        grid-template-columns: 1.4fr 0.8fr 0.9fr;
        gap: 8px;
      }

      .meta-key {
        color: #8b8378;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .danger-btn {
        height: 22px;
        min-width: 22px;
        border: 1px solid #ddb9b9;
        border-radius: 999px;
        background: #fff6f6;
        color: var(--danger);
        font-size: 12px;
        cursor: pointer;
      }

      form {
        display: grid;
        gap: 6px;
      }

      .row2 {
        display: grid;
        grid-template-columns: 1fr 62px;
        gap: 6px;
      }

      input {
        width: 100%;
        height: 29px;
        border: 1px solid var(--line);
        border-radius: 3px;
        padding: 0 8px;
        font-size: 12px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
      }

      .primary {
        height: 28px;
        border: 0;
        border-radius: 3px;
        background: var(--accent);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        font-size: 12px;
      }

      .primary:hover,
      .toolbar button:hover {
        background: var(--accent-2);
      }

      .status {
        margin-top: 8px;
        min-height: 16px;
        color: var(--muted);
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        font-size: 12px;
      }

      .status.error {
        color: #9d3f3f;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(20, 16, 10, 0.42);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 14px;
        z-index: 30;
      }

      .modal-backdrop.open {
        display: flex;
      }

      .modal {
        width: min(420px, 100%);
        background: #fffdf8;
        border: 1px solid var(--line);
        border-radius: 7px;
        box-shadow: 0 20px 55px rgba(0, 0, 0, 0.24);
        padding: 14px;
      }

      .modal h3 {
        margin: 0;
        font-size: 20px;
      }

      .modal p {
        margin: 8px 0 12px;
        color: var(--muted);
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        font-size: 13px;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .btn-secondary,
      .btn-danger {
        height: 30px;
        border-radius: 4px;
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
        border: 1px solid #8d3131;
        background: var(--danger);
        color: #fff;
      }

      .small {
        font-size: 10px;
        color: var(--muted);
      }

      @media (max-width: 980px) {
        h1 {
          font-size: 46px;
        }
        .layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .top {
          grid-template-columns: 1fr;
        }
        .stats {
          grid-template-columns: repeat(2, minmax(80px, 1fr));
          max-width: 190px;
        }
        .toolbar {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="top">
        <div>
          <div class="kicker">Library Operations</div>
          <h1>Book Library</h1>
          <p class="subtitle">Maintain the catalog and author registry from one compact desk.</p>
        </div>
        <div class="stats">
          <article class="stat">
            <span id="book-count" class="n">0</span>
            <span class="l">Books</span>
          </article>
          <article class="stat">
            <span id="author-count" class="n">0</span>
            <span class="l">Authors</span>
          </article>
        </div>
      </section>

      <section class="toolbar">
        <div class="toolbar-label">Filter catalog</div>
        <input id="filter-author" type="text" placeholder="Author" />
        <input id="filter-genre" type="text" placeholder="Genre" />
        <button id="refresh-btn" type="button">Refresh</button>
      </section>

      <section class="layout">
        <article class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-kicker">Catalog</div>
              <div class="panel-title">Books</div>
            </div>
            <div class="small" id="books-label">0 shown</div>
          </div>
          <ul id="books" class="book-list"></ul>
        </article>

        <div>
          <article class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-kicker">New Entry</div>
                <div class="panel-title">Add Book</div>
              </div>
              <div class="small">+</div>
            </div>
            <form id="book-form">
              <input name="title" type="text" placeholder="Title" required />
              <input name="author" type="text" placeholder="Author" required />
              <div class="row2">
                <input name="isbn" type="text" placeholder="ISBN" required />
                <input name="publishedYear" type="number" min="0" max="9999" placeholder="Year" required />
              </div>
              <input name="genre" type="text" placeholder="Genre" />
              <button class="primary" type="submit">+ Add book</button>
            </form>
          </article>

          <article class="panel" style="margin-top: 10px;">
            <div class="panel-head">
              <div>
                <div class="panel-kicker">Registry</div>
                <div class="panel-title">Add Author</div>
              </div>
              <div class="small">+</div>
            </div>
            <form id="author-form">
              <input name="name" type="text" placeholder="Name" required />
              <input name="nationality" type="text" placeholder="Nationality" />
              <input name="birthYear" type="number" min="0" max="9999" placeholder="Birth year" />
              <button class="primary" type="submit">+ Add author</button>
            </form>
          </article>

          <article class="panel" style="margin-top: 10px;">
            <div class="panel-head">
              <div>
                <div class="panel-kicker">People</div>
                <div class="panel-title">Authors</div>
              </div>
              <div class="small" id="authors-label">0 total</div>
            </div>
            <ul id="authors" class="author-list"></ul>
          </article>
        </div>
      </section>

      <div id="status" class="status">Ready.</div>

      <div id="delete-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <div class="modal" data-modal-panel="true">
          <h3 id="delete-title">Are you sure?</h3>
          <p>This will permanently remove the selected book from the catalog.</p>
          <div class="modal-actions">
            <button id="cancel-delete-btn" type="button" class="btn-secondary">Cancel</button>
            <button id="confirm-delete-btn" type="button" class="btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </main>

    <script>
      const state = {
        books: [],
        authors: [],
      };

      const booksEl = document.getElementById('books');
      const authorsEl = document.getElementById('authors');
      const statusEl = document.getElementById('status');
      const bookCountEl = document.getElementById('book-count');
      const authorCountEl = document.getElementById('author-count');
      const booksLabelEl = document.getElementById('books-label');
      const authorsLabelEl = document.getElementById('authors-label');
      const filterAuthorEl = document.getElementById('filter-author');
      const filterGenreEl = document.getElementById('filter-genre');
      const refreshBtnEl = document.getElementById('refresh-btn');
      const bookFormEl = document.getElementById('book-form');
      const authorFormEl = document.getElementById('author-form');
      const deleteModalEl = document.getElementById('delete-modal');
      const confirmDeleteBtnEl = document.getElementById('confirm-delete-btn');
      const cancelDeleteBtnEl = document.getElementById('cancel-delete-btn');
      let draggingBookId = null;
      let draggingAuthorId = null;
      let pendingDeleteBookId = null;

      function esc(value) {
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.className = isError ? 'status error' : 'status';
      }

      function filteredBooks() {
        const authorFilter = filterAuthorEl.value.trim().toLowerCase();
        const genreFilter = filterGenreEl.value.trim().toLowerCase();

        return state.books.filter((book) => {
          const authorOk = !authorFilter || String(book.author || '').toLowerCase().includes(authorFilter);
          const genreOk = !genreFilter || String(book.genre || '').toLowerCase().includes(genreFilter);
          return authorOk && genreOk;
        });
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
        container
          .querySelectorAll('.drop-target')
          .forEach((node) => node.classList.remove('drop-target'));
      }

      function renderBooks() {
        const books = filteredBooks();
        booksLabelEl.textContent = books.length + ' shown';

        if (books.length === 0) {
          booksEl.innerHTML = '<li class="book-item"><span class="meta">No matching books.</span></li>';
          return;
        }

        booksEl.innerHTML = books
          .map(
            (book) =>
              '<li class="book-item draggable-item" draggable="true" data-book-id="' + esc(book.id) + '">' +
              '<div class="book-top">' +
              '<div>' +
              '<div class="book-title">' + esc(book.title) + '</div>' +
              '<div class="meta">' + esc(book.author) + '</div>' +
              '</div>' +
              '<button class="danger-btn" data-delete-book-id="' + esc(book.id) + '" title="Delete book">x</button>' +
              '</div>' +
              '<div class="book-meta">' +
              '<div><div class="meta-key">ISBN</div><div class="meta">' + esc(book.isbn) + '</div></div>' +
              '<div><div class="meta-key">Year</div><div class="meta">' + esc(book.publishedYear) + '</div></div>' +
              '<div><div class="meta-key">Genre</div><div class="meta">' + esc(book.genre || 'N/A') + '</div></div>' +
              '</div>' +
              '</li>',
          )
          .join('');
      }

      function renderAuthors() {
        authorsLabelEl.textContent = state.authors.length + ' total';

        if (state.authors.length === 0) {
          authorsEl.innerHTML = '<li class="author-item"><span class="meta">No authors yet.</span></li>';
          return;
        }

        authorsEl.innerHTML = state.authors
          .map(
            (author) =>
              '<li class="author-item draggable-item" draggable="true" data-author-id="' + esc(author.id) + '">' +
              '<div class="book-title">' + esc(author.name) + '</div>' +
              '<div class="meta">' + esc(author.nationality || 'Unknown nationality') + '</div>' +
              '<div class="meta">Born: ' + esc(author.birthYear || 'N/A') + '</div>' +
              '</li>',
          )
          .join('');
      }

      function renderStats() {
        bookCountEl.textContent = String(state.books.length);
        authorCountEl.textContent = String(state.authors.length);
      }

      function render() {
        renderStats();
        renderBooks();
        renderAuthors();
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
          setStatus('Loading catalog...', false);
          const [books, authors] = await Promise.all([
            fetchJson('/api/books'),
            fetchJson('/api/authors'),
          ]);
          state.books = Array.isArray(books) ? books : [];
          state.authors = Array.isArray(authors) ? authors : [];
          render();
          setStatus('Catalog synced.', false);
        } catch (err) {
          setStatus('Could not load API data: ' + err.message, true);
        }
      }

      function openDeleteModal(bookId) {
        pendingDeleteBookId = String(bookId);
        deleteModalEl.classList.add('open');
      }

      function closeDeleteModal() {
        pendingDeleteBookId = null;
        deleteModalEl.classList.remove('open');
      }

      booksEl.addEventListener('click', async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const id = target.getAttribute('data-delete-book-id');
        if (!id) {
          return;
        }

        openDeleteModal(id);
      });

      confirmDeleteBtnEl.addEventListener('click', async () => {
        if (!pendingDeleteBookId) {
          closeDeleteModal();
          return;
        }
        const deletingId = pendingDeleteBookId;
        closeDeleteModal();
        try {
          await fetchJson('/api/books/' + deletingId, { method: 'DELETE' });
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
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        if (target === deleteModalEl) {
          closeDeleteModal();
          setStatus('Delete canceled.', false);
        }
      });

      booksEl.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const item = target.closest('[data-book-id]');
        if (!(item instanceof HTMLElement)) {
          return;
        }
        draggingBookId = item.getAttribute('data-book-id');
        item.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
        }
      });

      booksEl.addEventListener('dragend', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          target.classList.remove('dragging');
        }
        draggingBookId = null;
        clearDropTargets(booksEl);
      });

      booksEl.addEventListener('dragover', (event) => {
        event.preventDefault();
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const item = target.closest('[data-book-id]');
        if (!(item instanceof HTMLElement)) {
          clearDropTargets(booksEl);
          return;
        }
        clearDropTargets(booksEl);
        item.classList.add('drop-target');
      });

      booksEl.addEventListener('drop', (event) => {
        event.preventDefault();
        const target = event.target;
        if (!(target instanceof HTMLElement) || !draggingBookId) {
          return;
        }
        const item = target.closest('[data-book-id]');
        if (!(item instanceof HTMLElement)) {
          clearDropTargets(booksEl);
          return;
        }
        const toId = item.getAttribute('data-book-id');
        if (!toId) {
          return;
        }
        const changed = reorderById(state.books, draggingBookId, toId);
        clearDropTargets(booksEl);
        if (changed) {
          renderBooks();
          setStatus('Books reordered locally via drag and drop.', false);
        }
      });

      authorsEl.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const item = target.closest('[data-author-id]');
        if (!(item instanceof HTMLElement)) {
          return;
        }
        draggingAuthorId = item.getAttribute('data-author-id');
        item.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
        }
      });

      authorsEl.addEventListener('dragend', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          target.classList.remove('dragging');
        }
        draggingAuthorId = null;
        clearDropTargets(authorsEl);
      });

      authorsEl.addEventListener('dragover', (event) => {
        event.preventDefault();
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const item = target.closest('[data-author-id]');
        if (!(item instanceof HTMLElement)) {
          clearDropTargets(authorsEl);
          return;
        }
        clearDropTargets(authorsEl);
        item.classList.add('drop-target');
      });

      authorsEl.addEventListener('drop', (event) => {
        event.preventDefault();
        const target = event.target;
        if (!(target instanceof HTMLElement) || !draggingAuthorId) {
          return;
        }
        const item = target.closest('[data-author-id]');
        if (!(item instanceof HTMLElement)) {
          clearDropTargets(authorsEl);
          return;
        }
        const toId = item.getAttribute('data-author-id');
        if (!toId) {
          return;
        }
        const changed = reorderById(state.authors, draggingAuthorId, toId);
        clearDropTargets(authorsEl);
        if (changed) {
          renderAuthors();
          setStatus('Authors reordered locally via drag and drop.', false);
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
          await fetchJson('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
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

      filterAuthorEl.addEventListener('input', renderBooks);
      filterGenreEl.addEventListener('input', renderBooks);
      refreshBtnEl.addEventListener('click', loadAll);

      loadAll();
    </script>
  </body>
</html>`;
  }
}
