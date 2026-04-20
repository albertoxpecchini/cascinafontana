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
    return '/risorse/immagini/' + encodeURIComponent(fileName);
  }

  function renderRootGallery() {
    var grid = document.getElementById('galleryGrid');
    var counter = document.getElementById('galleryCount');

    if (!grid) {
      return;
    }

    grid.innerHTML = items.map(function (item) {
      var url = imageUrl(item.file);

      return '' +
        '<a class="home-gallery__item" href="' + url + '" target="_blank" rel="noopener">' +
          '<div class="home-gallery__media">' +
            '<img class="home-gallery__image" src="' + url + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
          '</div>' +
        '</a>';
    }).join('');

    if (counter) {
      counter.textContent = items.length + ' foto online';
    }
  }

  renderRootGallery();
})();