(function () {
  var items = Array.isArray(window.CASCINA_GALLERY) ? window.CASCINA_GALLERY : [];

  if (!items.length) {
    return;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function imageUrl(fileName) {
    return '/public/images/' + encodeURIComponent(fileName);
  }

  function renderRootGallery() {
    var grid = document.getElementById('galleryGrid');
    var counter = document.getElementById('galleryCount');

    if (!grid) {
      return;
    }

    grid.innerHTML = items.map(function (item, index) {
      var url = imageUrl(item.file);
      var featuredClass = item.featured ? ' home-gallery__item--featured' : '';

      return '' +
        '<a class="home-gallery__item' + featuredClass + '" href="' + url + '" target="_blank" rel="noopener">' +
          '<div class="home-gallery__media">' +
            '<img class="home-gallery__image" src="' + url + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
          '</div>' +
          '<div class="home-gallery__overlay">' +
            '<div class="home-gallery__kicker">Foto ' + String(index + 1).padStart(2, '0') + '</div>' +
            '<p class="home-gallery__title">' + escapeHtml(item.title) + '</p>' +
            '<p class="home-gallery__caption">' + escapeHtml(item.caption) + '</p>' +
          '</div>' +
        '</a>';
    }).join('');

    if (counter) {
      counter.textContent = items.length + ' foto online';
    }
  }

  function renderFlashGallery() {
    var grid = document.getElementById('galleryGridFp');
    var counter = document.getElementById('galleryCountFp');

    if (!grid) {
      return;
    }

    grid.innerHTML = items.map(function (item, index) {
      var url = imageUrl(item.file);
      var featuredClass = item.featured ? ' gal__item--lg' : '';

      return '' +
        '<figure class="gal__item' + featuredClass + '">' +
          '<a class="gal__button" href="' + url + '" target="_blank" rel="noopener">' +
            '<img class="gal__img" src="' + url + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
          '</a>' +
          '<figcaption>' +
            '<strong>Foto ' + String(index + 1).padStart(2, '0') + ' · ' + escapeHtml(item.title) + '</strong>' +
            '<span>' + escapeHtml(item.caption) + '</span>' +
          '</figcaption>' +
        '</figure>';
    }).join('');

    if (counter) {
      counter.textContent = items.length + ' foto caricate';
    }
  }

  renderRootGallery();
  renderFlashGallery();
})();