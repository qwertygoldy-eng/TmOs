(function() {
  'use strict';

  // ============================================
  // 🔥 TIMOS ULTIMATE v10.0 - СУПЕР ФИНАЛ
  // 40 источников • Буфер • VK плеер • Скрытое управление
  // ============================================

  var TOKEN = 'free_token_123';
  var RC_PARAMS = 'cub_id=1075737612&account_email=qwerty.goldy@gmail.com&uid=uw66smxc&nws_id=9yffoznegf4uxuat4ksqt2oqgnreymnp';

  // НАСТРОЙКИ БУФЕРА
  var BUFFER_CONFIG = {
    options: [15, 30, 60, 120],
    current: 30
  };

  var ALL_SOURCES = [
    { name: '🔴 93 Filmix 4K', url: 'http://93.183.95.219:11378/lite/filmix', token: true },
    { name: '🔴 93 Mirage 4K', url: 'http://93.183.95.219:11378/lite/mirage', token: true },
    { name: '🔴 93 Collaps', url: 'http://93.183.95.219:11378/lite/collaps', token: true },
    { name: '🔴 93 VK Видео', url: 'http://93.183.95.219:11378/lite/vkmovie', token: true, vk: true },
    { name: '🔴 93 Rutube', url: 'http://93.183.95.219:11378/lite/rutubemovie', token: true },
    { name: '🎬 Z01 Filmix 4K', url: 'http://z01.online/lite/filmix', token: false },
    { name: '📺 Z01 VK Видео', url: 'http://z01.online/lite/vkmovie', token: false, vk: true },
    { name: '🎥 Z01 VeoVeo', url: 'http://z01.online/lite/veoveo', token: false },
    { name: '▶️ Z01 Rutube', url: 'http://z01.online/lite/rutubemovie', token: false },
    { name: '💿 Z01 iRemux', url: 'http://z01.online/lite/remux', token: false },
    { name: '🌍 Z01 Geosaitebi', url: 'http://z01.online/lite/geosaitebi', token: false },
    { name: '🎬 Z01 HD', url: 'http://z01.online/lite/hd', token: false },
    { name: '📀 Z01 DVD', url: 'http://z01.online/lite/dvd', token: false },
    { name: '💎 FXAPI 4K HDR', url: 'http://showypro.com/lite/fxapi', token: true },
    { name: '🌊 Alloha 1080p', url: 'http://showypro.com/lite/alloha', token: true },
    { name: '🏴‍☠️ Pidtor 4K', url: 'http://showypro.com/lite/pidtor', token: true },
    { name: '🎯 Mirage 4K', url: 'http://showypro.com/lite/mirage', token: true },
    { name: '⚡ Showy Ultra', url: 'http://showypro.com/lite/ultra', token: true },
    { name: '📀 Filmix Direct 1', url: 'http://144.124.225.106:11310/lite/filmix', token: true },
    { name: '📀 Filmix Direct 2', url: 'http://88.218.61.149:9219/lite/filmix', token: true },
    { name: '📀 Filmix Direct 3', url: 'http://91.184.245.78:11560/lite/filmix', token: true },
    { name: '📦 Collaps', url: 'http://88.218.61.149:9219/lite/collaps', token: true },
    { name: '⚡ Collaps-Dash', url: 'http://88.218.61.149:9219/lite/collaps-dash', token: true },
    { name: '💧 Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix', token: true },
    { name: '🎯 Videasy', url: 'http://144.124.225.106:11310/lite/videasy', token: true },
    { name: '🎮 Smashystream', url: 'http://144.124.225.106:11310/lite/smashystream', token: true },
    { name: '🌊 Alloha Direct', url: 'http://88.218.61.149:9219/lite/alloha', token: true },
    { name: '🔥 Firestream', url: 'http://144.124.225.106:11310/lite/fire', token: true },
    { name: '⭐ Megastream', url: 'http://88.218.61.149:9219/lite/mega', token: true },
    { name: '🔵 RC Filmix 4K', url: 'http://rc.bwa.ad/lite/filmix', token: false, rc: true },
    { name: '🔵 RC VK Видео', url: 'http://rc.bwa.ad/lite/vkmovie', token: false, rc: true, vk: true },
    { name: '🔵 RC VeoVeo', url: 'http://rc.bwa.ad/lite/veoveo', token: false, rc: true },
    { name: '🔵 RC Geosaitebi', url: 'http://rc.bwa.ad/lite/geosaitebi', token: false, rc: true },
    { name: '🔵 RC Alloha', url: 'http://rc.bwa.ad/lite/alloha', token: false, rc: true },
    { name: '🔵 RC Collaps', url: 'http://rc.bwa.ad/lite/collaps', token: false, rc: true },
    { name: '🌐 Kinopoisk HD', url: 'http://z01.online/lite/kinopoisk', token: false },
    { name: '📺 HDVB', url: 'http://z01.online/lite/hdvb', token: false },
    { name: '🎬 LostFilm', url: 'http://showypro.com/lite/lostfilm', token: true },
    { name: '🇺🇸 NewStudio', url: 'http://showypro.com/lite/newstudio', token: true },
    { name: '🐟 Fishkin', url: 'http://z01.online/lite/fishkin', token: false },
    { name: '🎬 Kinolux', url: 'http://showypro.com/lite/kinolux', token: true }
  ];

  function addToken(url, source) {
    if (source.token && url.indexOf('showy_token=') === -1) {
      url = Lampa.Utils.addUrlComponent(url, 'showy_token=' + TOKEN);
    }
    if (source.rc && url.indexOf('cub_id=') === -1) {
      url = Lampa.Utils.addUrlComponent(url, RC_PARAMS);
    }
    return url;
  }

  function parseVideos(str, sourceName) {
    try {
      var videos = [];
      var dataJsonRegex = /data-json='([^']+)'/g;
      var match;
      
      while ((match = dataJsonRegex.exec(str)) !== null) {
        try {
          var data = JSON.parse(match[1]);
          if (data.method === 'play' || data.method === 'call' || data.method === 'link') {
            data.source = sourceName;
            data.title = data.title || data.translate || 'Без названия';
            if (data.url && data.url.indexOf(' or ') !== -1) data.url = data.url.split(' or ')[0];
            if (data.stream && data.stream.indexOf(' or ') !== -1) data.stream = data.stream.split(' or ')[0];
            if (data.translate && data.translate.indexOf('4K') !== -1) data.quality_text = '4K';
            else if (data.translate && data.translate.indexOf('1080') !== -1) data.quality_text = '1080p';
            else if (data.translate && data.translate.indexOf('720') !== -1) data.quality_text = '720p';
            else if (data.maxquality) data.quality_text = data.maxquality;
            if (data.method === 'link' && data.url) {
              data.method = 'call';
              data.stream = data.url;
            }
            videos.push(data);
          }
        } catch(e) {}
      }
      return videos;
    } catch(e) { return []; }
  }

  // Улучшенный VK плеер с меню и скрытым управлением
  function playVKVideo(url, title) {
    console.log('[VK] Воспроизведение:', url);
    
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999';
    
    var video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'width:100%;height:100%';
    video.src = url;
    
    // Настройка буфера
    video.preload = 'auto';
    video.onloadedmetadata = function() {
      console.log('[Buffer] Установлен буфер:', BUFFER_CONFIG.current, 'сек');
    };
    
    // Меню с тремя точками
    var menuBtn = document.createElement('div');
    menuBtn.innerHTML = '⋮';
    menuBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:45px;height:45px;background:rgba(0,0,0,0.7);color:white;font-size:28px;text-align:center;line-height:45px;border-radius:50%;cursor:pointer;z-index:100001;font-weight:bold;transition:0.3s';
    menuBtn.onmouseenter = function() { this.style.background = 'rgba(0,0,0,0.9)'; };
    menuBtn.onmouseleave = function() { this.style.background = 'rgba(0,0,0,0.7)'; };
    
    // Выпадающее меню
    var menu = document.createElement('div');
    menu.style.cssText = 'position:fixed;bottom:75px;right:20px;background:rgba(0,0,0,0.9);border-radius:10px;padding:10px;z-index:100002;display:none;min-width:120px';
    
    // Кнопки меню
    var bufferLabel = document.createElement('div');
    bufferLabel.style.cssText = 'color:#ff6b35;padding:8px 15px;font-size:14px;border-bottom:1px solid #333;margin-bottom:5px';
    bufferLabel.innerHTML = '💾 Буфер: ' + BUFFER_CONFIG.current + 'c';
    menu.appendChild(bufferLabel);
    
    BUFFER_CONFIG.options.forEach(function(sec) {
      var btn = document.createElement('div');
      btn.innerHTML = sec + ' секунд';
      btn.style.cssText = 'color:white;padding:8px 15px;cursor:pointer;border-radius:5px;margin:2px 0;font-size:14px;transition:0.2s';
      btn.onmouseenter = function() { this.style.background = '#ff6b35'; };
      btn.onmouseleave = function() { this.style.background = 'transparent'; };
      btn.onclick = function() {
        BUFFER_CONFIG.current = sec;
        bufferLabel.innerHTML = '💾 Буфер: ' + sec + 'c';
        video.preload = 'auto';
        Lampa.Noty.show('Буфер установлен: ' + sec + ' секунд');
        menu.style.display = 'none';
      };
      menu.appendChild(btn);
    });
    
    var sep = document.createElement('div');
    sep.style.cssText = 'height:1px;background:#333;margin:5px 0';
    menu.appendChild(sep);
    
    var closeMenuBtn = document.createElement('div');
    closeMenuBtn.innerHTML = '✕ Закрыть видео';
    closeMenuBtn.style.cssText = 'color:#e74c3c;padding:8px 15px;cursor:pointer;border-radius:5px;margin:2px 0;font-size:14px';
    closeMenuBtn.onmouseenter = function() { this.style.background = '#e74c3c'; this.style.color = 'white'; };
    closeMenuBtn.onmouseleave = function() { this.style.background = 'transparent'; this.style.color = '#e74c3c'; };
    closeMenuBtn.onclick = function() {
      video.pause();
      video.src = '';
      document.body.removeChild(container);
      Lampa.Controller.enableAll();
    };
    menu.appendChild(closeMenuBtn);
    
    // Открыть/закрыть меню
    var menuVisible = false;
    menuBtn.onclick = function(e) {
      e.stopPropagation();
      menuVisible = !menuVisible;
      menu.style.display = menuVisible ? 'block' : 'none';
    };
    
    // Скрыть меню при клике вне
    document.addEventListener('click', function(e) {
      if (menuVisible && !menu.contains(e.target) && e.target !== menuBtn) {
        menu.style.display = 'none';
        menuVisible = false;
      }
    });
    
    // Скрываем стандартные контролы через 2 секунды
    var controlsTimeout;
    function hideControls() {
      video.style.cursor = 'none';
      menuBtn.style.opacity = '0';
    }
    function showControls() {
      video.style.cursor = 'pointer';
      menuBtn.style.opacity = '1';
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(hideControls, 2000);
    }
    
    video.onmousemove = showControls;
    video.onclick = showControls;
    video.addEventListener('play', function() {
      setTimeout(hideControls, 2000);
    });
    
    showControls();
    
    video.onerror = function() {
      document.body.removeChild(container);
      Lampa.Controller.enableAll();
      Lampa.Noty.show('Ошибка VK, открываем в новой вкладке');
      window.open(url, '_blank');
    };
    
    container.appendChild(video);
    container.appendChild(menuBtn);
    container.appendChild(menu);
    document.body.appendChild(container);
    Lampa.Controller.disableAll();
    Lampa.Loading.stop();
  }

  function component(object) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var allVideos = [];
    var totalSources = ALL_SOURCES.length;
    var doneSources = 0;
    var currentFocusIndex = 0;
    var allItems = [];

    this.create = function() { return files.render(); };

    this.initialize = function() {
      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());

      scroll.body().append(
        '<div style="padding: 2em; text-align: center;">' +
        '<div style="font-size: 1.8em; margin-bottom: 0.3em;">🔥 TimOs ULTIMATE v10.0</div>' +
        '<div style="font-size: 0.9em; opacity: 0.6; margin-bottom: 1.5em;">' + totalSources + ' источников • Буфер ' + BUFFER_CONFIG.current + 'c • VK Menu</div>' +
        '<div class="ult-count" style="font-size: 1.2em; margin-bottom: 0.8em;">Поиск... 0/' + totalSources + '</div>' +
        '<div style="height: 0.6em; background: rgba(255,255,255,0.1); border-radius: 0.3em; overflow: hidden;">' +
        '<div class="ult-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff6b35, #d63031, #667eea, #764ba2, #00b894, #fdcb6e); border-radius: 0.3em; transition: width 0.3s;"></div>' +
        '</div>' +
        '<div class="ult-status" style="margin-top: 1em; font-size: 0.85em; opacity: 0.7; max-height: 150px; overflow: auto;"></div>' +
        '<div style="margin-top: 1em; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">' +
        BUFFER_CONFIG.options.map(function(sec) {
          return '<button class="buffer-preset" data-buffer="' + sec + '" style="background:' + (BUFFER_CONFIG.current === sec ? '#ff6b35' : 'rgba(255,255,255,0.3)') + ';border:none;color:white;padding:5px 15px;border-radius:20px;cursor:pointer;margin:2px">' + (sec >= 60 ? (sec/60) + ' мин' : sec + ' сек') + '</button>';
        }).join('') +
        '</div>' +
        '</div>'
      );
      
      $('.buffer-preset').on('click', function() {
        var sec = parseInt($(this).data('buffer'));
        BUFFER_CONFIG.current = sec;
        $('.buffer-preset').css('background', 'rgba(255,255,255,0.3)');
        $(this).css('background', '#ff6b35');
        Lampa.Noty.show('Буфер установлен: ' + (sec >= 60 ? (sec/60) + ' минут' : sec + ' секунд'));
      });

      var movie = object.movie || object;
      var title = movie.title || movie.name || 'Test';

      ALL_SOURCES.forEach(function(source) {
        var params = [];
        params.push('id=' + encodeURIComponent(movie.id || '550'));
        params.push('title=' + encodeURIComponent(title));
        params.push('original_title=' + encodeURIComponent(movie.original_title || movie.original_name || ''));
        params.push('serial=' + (movie.name ? 1 : 0));
        params.push('year=' + ((movie.release_date || movie.first_air_date || '')+'').slice(0,4));
        if (movie.imdb_id) params.push('imdb_id=' + movie.imdb_id);
        if (movie.kinopoisk_id) params.push('kinopoisk_id=' + movie.kinopoisk_id);
        params.push('source=tmdb');
        params.push('clarification=0');

        var url = source.url + '?' + params.join('&');
        url = addToken(url, source);

        $.ajax({
          url: url,
          method: 'GET',
          dataType: 'text',
          timeout: 12000,
          success: function(data) {
            var vids = parseVideos(data, source.name);
            allVideos = allVideos.concat(vids);
            doneSources++;
            var pct = Math.round((doneSources / totalSources) * 100);
            scroll.body().find('.ult-count').text('Поиск... ' + doneSources + '/' + totalSources);
            scroll.body().find('.ult-bar').css('width', pct + '%');
            scroll.body().find('.ult-status').append('<div>' + (vids.length > 0 ? '✅ ' : '❌ ') + source.name + (vids.length > 0 ? ' +' + vids.length : '') + '</div>');
            if (doneSources >= totalSources) finish();
          },
          error: function() {
            doneSources++;
            var pct = Math.round((doneSources / totalSources) * 100);
            scroll.body().find('.ult-count').text('Поиск... ' + doneSources + '/' + totalSources);
            scroll.body().find('.ult-bar').css('width', pct + '%');
            scroll.body().find('.ult-status').append('<div style="color:#e74c3c;">❌ ' + source.name + '</div>');
            if (doneSources >= totalSources) finish();
          }
        });
      });

      function finish() {
        scroll.clear();
        
        if (!allVideos.length) {
          scroll.body().append('<div style="padding: 4em; text-align: center;"><div style="font-size: 3em;">😢</div><div>Ничего не найдено</div></div>');
          Lampa.Controller.enable('content');
          return;
        }

        var grouped = {};
        allVideos.forEach(function(v) {
          var key = v.source || 'Другое';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(v);
        });

        var containerDiv = $('<div class="timos-container" style="max-height: 70vh; overflow-y: auto; padding: 0.5em;"></div>');
        
        Object.keys(grouped).sort(function(a,b){ return grouped[b].length - grouped[a].length }).forEach(function(srcName) {
          var srcVideos = grouped[srcName];
          var block = $('<div style="margin:0.5em;padding:1em;background:rgba(255,255,255,0.05);border-radius:0.5em;"><div style="font-size:1.1em;font-weight:bold;color:#ff6b35;margin-bottom:0.5em;">' + srcName + ' (' + srcVideos.length + ')</div></div>');

          srcVideos.forEach(function(video) {
            var info = [];
            if (video.quality_text) info.push(video.quality_text);
            if (video.translate) info.push(video.translate.replace(/\[.*?\]/g, '').trim());
            if (video.episode) info.push('Серия ' + video.episode);
            
            var row = $('<div class="selector timos-video-item" style="padding:0.8em;background:rgba(255,107,53,0.08);border-radius:0.3em;margin:0.3em 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;"><div style="flex:1;"><div style="font-size:1em;">' + (video.title || 'Без названия') + '</div><div style="font-size:0.8em;opacity:0.5;">' + info.join(' ● ') + '</div></div><div style="opacity:0.4;">▶</div></div>');

            row.data('video', video);
            row.data('source', srcName);
            allItems.push(row);

            row.on('hover:enter', function() {
              var videoData = $(this).data('video');
              var sourceName = $(this).data('source');
              playVideo(videoData, movie, sourceName);
            });

            row.on('hover:focus', function(e) {
              currentFocusIndex = allItems.indexOf($(this));
              scroll.update($(this), true);
              setTimeout(function() { row[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
            });

            block.append(row);
          });
          containerDiv.append(block);
        });

        containerDiv.append('<div class="selector timos-back-btn" style="padding:1.5em;text-align:center;opacity:0.5;cursor:pointer;margin-top:1em;">↩ Назад в меню</div>');
        scroll.body().append(containerDiv);
        scroll.body().find('.timos-back-btn').on('hover:enter', function() { Lampa.Activity.backward(); });

        setupNavigation();
        Lampa.Controller.enable('content');
      }
      
      function setupNavigation() {
        Lampa.Controller.add('content', {
          toggle: function() { Lampa.Controller.collectionSet(scroll.render()); Lampa.Controller.collectionFocus(false, scroll.render()); },
          up: function() { if (currentFocusIndex > 0) { currentFocusIndex--; var target = allItems[currentFocusIndex]; if (target) { target.trigger('hover:focus'); target.addClass('focused'); } } },
          down: function() { if (currentFocusIndex < allItems.length - 1) { currentFocusIndex++; var target = allItems[currentFocusIndex]; if (target) { target.trigger('hover:focus'); target.addClass('focused'); } } },
          right: function() { Navigator.move('right'); },
          left: function() { if (Navigator.canmove('left')) Navigator.move('left'); else Lampa.Controller.toggle('menu'); },
          back: function() { Lampa.Activity.backward(); }
        });
      }
      
      function playVideo(video, movie, sourceName) {
        Lampa.Loading.start();
        var playUrl = video.url || video.stream;
        if (!playUrl) { Lampa.Loading.stop(); Lampa.Noty.show('Ссылка недоступна'); return; }

        if (sourceName.includes('VK') || playUrl.includes('vkuser.net') || playUrl.includes('vk.com') || playUrl.includes('vkvd') || playUrl.includes('okcdn.ru')) {
          Lampa.Loading.stop();
          playVKVideo(playUrl, video.title);
          if (movie.id) Lampa.Favorite.add('history', movie, 100);
          return;
        }

        if (video.method === 'play') {
          if (playUrl.indexOf('_480.mp4') !== -1) playUrl = playUrl.replace('_480.mp4', '_2160.mp4');
          Lampa.Loading.stop();
          Lampa.Player.play({ title: video.title, url: playUrl, quality: video.quality_text || 'HD', isonline: true });
          if (movie.id) Lampa.Favorite.add('history', movie, 100);
        } else if (video.method === 'call' || video.method === 'link') {
          $.ajax({
            url: playUrl, method: 'GET', dataType: 'text', timeout: 15000,
            success: function(response) {
              Lampa.Loading.stop();
              var streamUrl = '';
              try { var json = JSON.parse(response); streamUrl = json.url || json.stream || ''; } catch(e) { var urlMatch = response.match(/(https?:\/\/[^\s"']+\.(?:mp4|m3u8|mkv|avi|ts))/i); if (urlMatch) streamUrl = urlMatch[1]; }
              if (streamUrl) { Lampa.Player.play({ title: video.title, url: streamUrl, quality: video.quality_text || 'HD', isonline: true }); if (movie.id) Lampa.Favorite.add('history', movie, 100); } else { Lampa.Noty.show('Не удалось получить ссылку'); }
            },
            error: function() { Lampa.Loading.stop(); Lampa.Noty.show('Ошибка загрузки'); }
          });
        } else { Lampa.Loading.stop(); Lampa.Noty.show('Неизвестный метод'); }
      }
    };

    this.start = function() { if (Lampa.Activity.active().activity !== this.activity) return; this.initialize(); Lampa.Controller.toggle('content'); };
    this.render = function() { return files.render(); };
    this.destroy = function() { scroll.destroy(); files.destroy(); };
  }

  if (!window.timos_ultimate) {
    window.timos_ultimate = true;
    Lampa.Component.add('timos_ultimate', component);
    Lampa.Manifest.plugins = {
      type: 'video', version: '10.0.0', name: 'TimOs ULTIMATE',
      description: '40 источников • Буфер • VK Menu • 4K',
      component: 'timos_ultimate',
      onContextLauch: function(obj) { Lampa.Activity.push({ title: '🔥 TimOs ULTIMATE v10.0', component: 'timos_ultimate', movie: obj, page: 1 }); }
    };
    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var render = e.object.activity.render();
          if (render.find('.ultimate-btn').length) return;
          var btn = $('<div class="full-start__button selector ultimate-btn" style="background:linear-gradient(135deg,#ff6b35,#d63031,#667eea,#764ba2,#00b894,#fdcb6e);color:#fff;font-weight:700;font-size:1.1em;">🔥 TimOs ULTIMATE (36)</div>');
          btn.on('hover:enter', function() { Lampa.Activity.push({ title: '🔥 TimOs ULTIMATE v10.0', component: 'timos_ultimate', movie: e.data.movie, page: 1 }); });
          render.find('.button--play').before(btn);
        }, 200);
      }
    });
  }
})();
