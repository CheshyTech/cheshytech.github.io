document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const searchConfig = window.searchConfig || {
    json: 'index.json',
    page: {
      id: 'searchResults',
      input: 'searchInput'
    }
  };

  fetch(searchConfig.json)
    .then(res => res.json())
    .then(data => {
      const fuse = new Fuse(data, {
        keys: ['title', 'content'],
        includeMatches: true,
        threshold: 0.3,
      });

      input.addEventListener('input', function (e) {
        const query = e.target.value.trim();
        results.innerHTML = '';

        if (query.length < 2) return;

        const matches = fuse.search(query);
        const seen = new Set();

        matches.forEach(match => {
            const item = match.item;
            const key = item.relpermalink || item.permalink;
            if (seen.has(key)) return;
            seen.add(key);

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = key;
            a.textContent = item.title;
            li.appendChild(a);
            results.appendChild(li);
        });

      });
    });
});
