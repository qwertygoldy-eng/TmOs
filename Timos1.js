(function() {
  'use strict';

  // ============================================
  // 🔥 TimOS — МЫШЬ + ПУЛЬТ (все платформы)
  // 40 источников • Буфер • VK плеер
  // ============================================

  var TOKEN = 'free_token_123';
  var RC_PARAMS = 'cub_id=1075737612&account_email=qwerty.goldy@gmail.com&uid=uw66smxc&nws_id=9yffoznegf4uxuat4ksqt2oqgnreymnp';

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

  function playVKVideo(url, title) {
    console.log('[VK] Воспроизведение:', url);
    
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999';
    
    var video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'width:100%;height:100%';
    video.src = url;
    
    video.preload = 'auto';
    video.onloadedmetadata = function() {
      console.log('[Buffer] Установлен буфер:', BUFFER_CONFIG.current, 'сек');
    };
    
    var menuBtn = document.createElement('div');
    menuBtn.innerHTML = '⋮';
    menuBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:45px;height:45px;background:rgba(0,0,0,0.7);color:white;font-size:28px;text-align:center;line-height:45px;border-radius:50%;cursor:pointer;z-index:100001;font-weight:bold;transition:0.3s';
    menuBtn.onmouseenter = function() { this.style.background = 'rgba(0,0,0,0.9)'; };
    menuBtn.onmouseleave = function() { this.style.background = 'rgba(0,0,0,0.7)'; };
    
    var menu = document.createElement('div');
    menu.style.cssText = 'position:fixed;bottom:75px;right:20px;background:rgba(0,0,0,0.9);border-radius:10px;padding:10px;z-index:100002;display:none;min-width:120px';
    
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
    
    var menuVisible = false;
    menuBtn.onclick = function(e) {
      e.stopPropagation();
      menuVisible = !menuVisible;
      menu.style.display = menuVisible ? 'block' : 'none';
    };
    
    document.addEventListener('click', function(e) {
      if (menuVisible && !menu.contains(e.target) && e.target !== menuBtn) {
        menu.style.display = 'none';
        menuVisible = false;
      }
    });
    
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
    var filter = new Lampa.Filter(object);
    var allVideos = [];
    var totalSources = ALL_SOURCES.length;
    var doneSources = 0;
    var last;
    var currentFocusIndex = 0;
    var allItems = [];

    this.create = function() { return files.render(); };
    this.render = function() { return files.render(); };

    this.initialize = function() {
      var _this = this;
      
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));

      scroll.append($(
        '<div style="padding: 1.5em; text-align: center;">' +
        '<div style="font-size: 1.5em; margin-bottom: 0.3em;">🔥 TimOs ULTIMATE v11</div>' +
        '<div style="font-size: 0.85em; opacity: 0.5; margin-bottom: 1em;">' + totalSources + ' источников • Буфер ' + BUFFER_CONFIG.current + 'c</div>' +
        '<div id="v11-count" style="font-size: 1em; margin-bottom: 0.5em;">Поиск: 0/' + totalSources + '</div>' +
        '<div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0 1em;">' +
        '<div id="v11-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff6b35, #d63031, #667eea, #764ba2, #00b894, #fdcb6e); border-radius: 2px; transition: width 0.3s;"></div>' +
        '</div>' +
        '<div id="v11-log" style="margin-top: 0.8em; font-size: 0.75em; opacity: 0.6; max-height: 120px; overflow-y: auto; text-align: left; padding: 0 1em;"></div>' +
        '<div style="margin-top: 1em; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">' +
        BUFFER_CONFIG.options.map(function(sec) {
          return '<button class="buffer-preset" data-buffer="' + sec + '" style="background:' + (BUFFER_CONFIG.current === sec ? '#ff6b35' : 'rgba(255,255,255,0.3)') + ';border:none;color:white;padding:5px 15px;border-radius:20px;cursor:pointer;margin:2px">' + (sec >= 60 ? (sec/60) + ' мин' : sec + ' сек') + '</button>';
        }).join('') +
        '</div>' +
        '</div>'
      ));
      
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
          url: url, method: 'GET', dataType: 'text', timeout: 12000,
          success: function(data) {
            var vids = parseVideos(data, source.name);
            allVideos = allVideos.concat(vids);
            doneSources++;
            updateUI(source.name, vids.length);
            if (doneSources >= totalSources) _this.finish(movie);
          },
          error: function() {
            doneSources++;
            updateUI(source.name, -1);
            if (doneSources >= totalSources) _this.finish(movie);
          }
        });
      });

      function updateUI(name, count) {
        var pct = Math.round((doneSources / totalSources) * 100);
        $('#v11-count').text('Поиск: ' + doneSources + '/' + totalSources);
        $('#v11-bar').css('width', pct + '%');
        var icon = count > 0 ? '✅' : count === 0 ? '⚠️' : '❌';
        var extra = count > 0 ? ' +' + count : '';
        $('#v11-log').append('<div>' + icon + ' ' + name + extra + '</div>');
        var logEl = $('#v11-log')[0];
        if (logEl) logEl.scrollTop = logEl.scrollHeight;
      }
    };

    this.finish = function(movie) {
      scroll.clear();
      allItems = [];
      currentFocusIndex = 0;
      
      if (!allVideos.length) {
        scroll.append($('<div style="padding: 4em; text-align: center; font-size: 1.2em;">😢 Ничего не найдено</div>'));
        Lampa.Controller.enable('content');
        return;
      }

      var grouped = {};
      allVideos.forEach(function(v) {
        var key = v.source || 'Другое';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(v);
      });

      var keys = Object.keys(grouped).sort(function(a,b){ return grouped[b].length - grouped[a].length });

      scroll.append($(
        '<div style="padding: 0.6em; text-align: center; background: rgba(255,107,53,0.15); border-radius: 0.3em; margin: 0.5em;">' +
        '<div style="font-size: 1em; font-weight: bold; color: #ff6b35;">🎬 Найдено: ' + allVideos.length + ' видео в ' + keys.length + ' источниках</div>' +
        '</div>'
      ));

      keys.forEach(function(srcName) {
        var srcVideos = grouped[srcName];
        
        scroll.append($(
          '<div style="margin: 0.4em 0.5em; padding: 0.6em 0.8em; background: rgba(255,107,53,0.08); border-left: 3px solid #ff6b35; border-radius: 0.2em;">' +
          '<div style="font-size: 0.9em; font-weight: bold; color: #ff6b35;">' + srcName + ' (' + srcVideos.length + ')</div>' +
          '</div>'
        ));

        srcVideos.forEach(function(video) {
          var info = [];
          if (video.quality_text) info.push(video.quality_text);
          if (video.translate) info.push(video.translate.replace(/\[.*?\]/g, '').trim());
          if (video.episode) info.push('Серия ' + video.episode);

          var row = $(
            '<div class="selector timos-item" style="padding: 0.55em 0.8em; margin: 0 0.5em; background: rgba(255,107,53,0.03); border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">' +
            '<div style="flex: 1; min-width: 0;">' +
            '<div style="font-size: 0.82em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (video.title || 'Без названия') + '</div>' +
            (info.length ? '<div style="font-size: 0.68em; opacity: 0.5; margin-top: 0.1em;">' + info.join(' ● ') + '</div>' : '') +
            '</div>' +
            '<div style="opacity: 0.3; margin-left: 0.5em;">▶</div>' +
            '</div>'
          );

          // Мышь: hover:enter
          row.on('hover:enter', function() {
            currentFocusIndex = allItems.indexOf(this);
            _this.playVideo(video, movie);
          });

          // Пульт/Мышь: hover:focus
          row.on('hover:focus', function(e) {
            last = e.target;
            currentFocusIndex = allItems.indexOf(this);
            scroll.update($(e.target), true);
          });

          allItems.push(row[0]);
          scroll.append(row);
        });
      });

      scroll.append($(
        '<div class="selector timos-back-btn" style="padding: 1.5em; text-align: center; opacity: 0.4; cursor: pointer; margin-top: 1em;">↩ Назад</div>'
      ).on('hover:enter', function() { Lampa.Activity.backward(); }));
      
      Lampa.Controller.enable('content');
    };

    this.playVideo = function(video, movie) {
      Lampa.Loading.start();
      var playUrl = video.url || video.stream;
      if (!playUrl) { Lampa.Loading.stop(); Lampa.Noty.show('Ссылка недоступна'); return; }

      if (video.source && video.source.indexOf('VK') !== -1) {
        Lampa.Loading.stop();
        playVKVideo(playUrl, video.title);
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
        return;
      }

      if (video.method === 'play') {
        if (playUrl.indexOf('_480.mp4') !== -1) playUrl = playUrl.replace('_480.mp4', '_2160.mp4');
        Lampa.Loading.stop();
        Lampa.Player.play({ title: video.title, url: playUrl, quality: video.quality_text || 'HD', isonline: true });
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
      } else {
        $.ajax({
          url: addToken(playUrl, {token: true}), method: 'GET', dataType: 'json', timeout: 10000,
          success: function(json) {
            Lampa.Loading.stop();
            var s = json.url || json.stream || '';
            if (s.indexOf(' or ') !== -1) s = s.split(' or ')[0];
            if (s) {
              Lampa.Player.play({ title: video.title, url: s, quality: json.quality || video.quality_text || 'HD', subtitles: json.subtitles, isonline: true });
              if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
            } else Lampa.Noty.show('Не удалось');
          },
          error: function() { Lampa.Loading.stop(); Lampa.Noty.show('Ошибка'); }
        });
      }
    };

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.initialize();
      
      // Универсальная навигация: ПУЛЬТ + МЫШЬ
      Lampa.Controller.add('content', {
        toggle: function() { 
          Lampa.Controller.collectionSet(scroll.render()); 
          Lampa.Controller.collectionFocus(last || false, scroll.render()); 
        },
        up: function() { 
          if (currentFocusIndex > 0) {
            currentFocusIndex--;
            var target = $(allItems[currentFocusIndex]);
            if (target.length) {
              target.trigger('hover:focus');
              last = target[0];
              scroll.update(target, true);
            }
          } else {
            Lampa.Controller.toggle('head');
          }
        },
        down: function() { 
          if (currentFocusIndex < allItems.length - 1) {
            currentFocusIndex++;
            var target = $(allItems[currentFocusIndex]);
            if (target.length) {
              target.trigger('hover:focus');
              last = target[0];
              scroll.update(target, true);
            }
          }
        },
        right: function() { 
          if (Navigator.canmove('right')) Navigator.move('right'); 
          else filter.show('Фильтр', 'filter'); 
        },
        left: function() { 
          if (Navigator.canmove('left')) Navigator.move('left'); 
          else Lampa.Controller.toggle('menu'); 
        },
        back: function() { 
          if (currentFocusIndex >= 0 && allItems[currentFocusIndex]) {
            // Если фокус на элементе — запускаем видео
            $(allItems[currentFocusIndex]).trigger('hover:enter');
          } else {
            Lampa.Activity.backward(); 
          }
        },
        enter: function() {
          if (currentFocusIndex >= 0 && allItems[currentFocusIndex]) {
            $(allItems[currentFocusIndex]).trigger('hover:enter');
          }
        }
      });
      
      Lampa.Controller.toggle('content');
    };

    this.destroy = function() { scroll.destroy(); files.destroy(); };
  }

  if (!window.timos_v11_dual) {
    window.timos_v11_dual = true;
    Lampa.Component.add('timos_v11_dual', component);
    Lampa.Manifest.plugins = {
      type: 'video', version: '11.0.0', name: 'TimOs ULTIMATE v11',
      description: '40 источников • Мышь + Пульт • 4K',
      component: 'timos_v11_dual',
      onContextLauch: function(obj) { 
        Lampa.Activity.push({ title: '🔥 TimOs v11', component: 'timos_v11_dual', movie: obj, page: 1 }); 
      }
    };
    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var r = e.object.activity.render();
          if (r.find('.timos-v11-btn').length) return;
          var b = $('<div class="full-start__button selector timos-v11-btn" style="background:linear-gradient(135deg,#ff6b35,#d63031,#667eea,#764ba2,#00b894,#fdcb6e);color:#fff;font-weight:700;font-size:1.1em;">🔥 TimOs v11 (40)</div>');
          b.on('hover:enter', function() { 
            Lampa.Activity.push({ title: '🔥 TimOs v11', component: 'timos_v11_dual', movie: e.data.movie, page: 1 }); 
          });
          r.find('.button--play').before(b);
        }, 200);
      }
    });
  }
})();
