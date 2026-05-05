(function() {
  'use strict';

  // ============================================
  // 🔥 TimOS — От Папуськи для Мамуськи
  // 40 источников • Буфер • VK плеер • Мышь+Пульт • Отладчик
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

  // ========== ОТЛАДЧИК ==========
  var DEBUG = true;
  var debugLog = [];
  var debugPanel = null;

  function debug(msg, type) {
    type = type || 'info';
    var time = new Date().toLocaleTimeString();
    debugLog.push({ time: time, msg: msg, type: type });
    console.log('[TimOs] [' + type + '] ' + msg);
    
    if (DEBUG && debugPanel) {
      var colors = { error: '#e74c3c', success: '#2ecc71', warn: '#f39c12', info: '#bdc3c7', stream: '#3498db' };
      var line = $('<div style="color:' + (colors[type] || '#fff') + ';font-size:10px;padding:2px 8px;border-bottom:1px solid rgba(255,255,255,0.03);font-family:monospace;">' + time + ' ' + msg + '</div>');
      debugPanel.find('.debug-lines').append(line);
      debugPanel.find('.debug-lines').scrollTop(99999);
    }
  }

  function createDebugPanel() {
    debugPanel = $(
      '<div class="timos-debug" style="position:fixed;bottom:0;left:0;right:0;height:220px;background:rgba(0,0,0,0.97);z-index:999999;display:none;flex-direction:column;">' +
      '<div class="debug-head" style="background:linear-gradient(90deg,#ff6b35,#d63031);color:#fff;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;font-size:11px;cursor:pointer;">' +
      '<span>🐛 TimOs Debug • <span style="opacity:0.7;">' + ALL_SOURCES.length + ' источников</span></span>' +
      '<span style="cursor:pointer;font-size:16px;" onclick="$(this).closest(\'.timos-debug\').hide()">✕</span>' +
      '</div>' +
      '<div class="debug-lines" style="flex:1;overflow-y:auto;padding:4px 0;"></div>' +
      '</div>'
    ).appendTo('body');
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
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
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999';
    var video = document.createElement('video');
    video.controls = true; video.autoplay = true;
    video.style.cssText = 'width:100%;height:100%'; video.src = url;
    container.appendChild(video);
    document.body.appendChild(container);
    Lampa.Controller.disableAll();
    Lampa.Loading.stop();
  }

  // ========== ОСНОВНОЙ КОМПОНЕНТ ==========
  function component(object) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var allVideos = [];
    var totalSources = ALL_SOURCES.length;
    var doneSources = 0;
    var last;
    var currentFocusIndex = -1;
    var allItems = [];

    this.create = function() { return files.render(); };
    this.render = function() { return files.render(); };

    this.initialize = function() {
      var _this = this;
      
      createDebugPanel();
      debug('Инициализация плагина...', 'info');
      debug('Всего источников: ' + totalSources, 'info');
      
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));

      // КРУТОЙ ВИДЖЕТ
      scroll.append($(
        '<div style="padding: 1.2em; text-align: center; background: linear-gradient(135deg, rgba(255,107,53,0.15), rgba(102,126,234,0.15)); border-radius: 0.5em; margin: 0.5em;">' +
        '<div style="font-size: 1.6em; font-weight: 700; background: linear-gradient(90deg, #ff6b35, #d63031, #667eea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">От Папуськи для Мамуськи</div>' +
        '<div style="font-size: 0.7em; opacity: 0.4; margin-top: 0.2em; font-style: italic;">TimOs v12 • ' + totalSources + ' источников • 4K</div>' +
        '<div id="v12-count" style="font-size: 0.9em; margin-top: 0.8em; color: #fff;">Поиск: 0/' + totalSources + '</div>' +
        '<div style="height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5em 1em 0 1em;">' +
        '<div id="v12-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff6b35, #d63031, #667eea, #764ba2, #00b894); border-radius: 2px; transition: width 0.3s;"></div>' +
        '</div>' +
        '<div id="v12-log" style="margin-top: 0.5em; font-size: 0.7em; opacity: 0.6; max-height: 100px; overflow-y: auto; text-align: left; padding: 0 1em;"></div>' +
        '<button class="debug-toggle" style="margin-top:0.8em;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:4px 15px;border-radius:15px;font-size:0.75em;cursor:pointer;">🐛 Отладка</button>' +
        '</div>'
      ));
      
      $('.debug-toggle').on('click', function() {
        debugPanel.toggle();
        debug('Отладчик ' + (debugPanel.is(':visible') ? 'открыт' : 'закрыт'), 'warn');
      });

      var movie = object.movie || object;
      var title = movie.title || movie.name || '';
      
      debug('Начинаю поиск: ' + title, 'info');

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
            debug(source.name + ': ' + (vids.length > 0 ? 'НАЙДЕНО ' + vids.length : 'пусто'), vids.length > 0 ? 'success' : 'warn');
            if (doneSources >= totalSources) _this.finish(movie);
          },
          error: function(xhr, status, err) {
            doneSources++;
            updateUI(source.name, -1);
            debug(source.name + ': ОШИБКА ' + (xhr.status || status), 'error');
            if (doneSources >= totalSources) _this.finish(movie);
          }
        });
      });

      function updateUI(name, count) {
        var pct = Math.round((doneSources / totalSources) * 100);
        $('#v12-count').text('Поиск: ' + doneSources + '/' + totalSources);
        $('#v12-bar').css('width', pct + '%');
        var icon = count > 0 ? '✅' : count === 0 ? '⚠️' : '❌';
        $('#v12-log').append('<div>' + icon + ' ' + name + (count > 0 ? ' +' + count : '') + '</div>');
        var logEl = $('#v12-log')[0];
        if (logEl) logEl.scrollTop = logEl.scrollHeight;
      }
    };

    this.finish = function(movie) {
      scroll.clear();
      allItems = [];
      currentFocusIndex = -1;
      
      debug('Финальная обработка. Всего видео: ' + allVideos.length, allVideos.length > 0 ? 'success' : 'error');
      
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
      
      debug('Группировка: ' + keys.length + ' источников с видео', 'info');

      scroll.append($(
        '<div style="padding: 0.5em; text-align: center; background: rgba(255,107,53,0.15); border-radius: 0.3em; margin: 0.5em;">' +
        '<div style="font-size: 0.95em; font-weight: bold; color: #ff6b35;">🎬 Найдено: ' + allVideos.length + ' видео</div>' +
        '</div>'
      ));

      keys.forEach(function(srcName) {
        var srcVideos = grouped[srcName];
        
        scroll.append($(
          '<div style="margin: 0.3em 0.5em; padding: 0.4em 0.8em; background: rgba(255,107,53,0.08); border-left: 3px solid #ff6b35; border-radius: 0.2em;">' +
          '<div style="font-size: 0.85em; font-weight: bold; color: #ff6b35;">' + srcName + ' (' + srcVideos.length + ')</div>' +
          '</div>'
        ));

        srcVideos.forEach(function(video) {
          var info = [];
          if (video.quality_text) info.push(video.quality_text);
          if (video.translate) info.push(video.translate.replace(/\[.*?\]/g, '').trim());
          if (video.episode) info.push('S' + video.season + 'E' + video.episode);

          var row = $(
            '<div class="selector timos-item" style="padding: 0.5em 0.8em; margin: 0 0.5em; background: rgba(255,107,53,0.03); border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">' +
            '<div style="flex: 1; min-width: 0;">' +
            '<div style="font-size: 0.82em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (video.title || 'Без названия') + '</div>' +
            (info.length ? '<div style="font-size: 0.68em; opacity: 0.5; margin-top: 0.1em;">' + info.join(' / ') + '</div>' : '') +
            '</div>' +
            '<div style="opacity: 0.3; margin-left: 0.5em;">▶</div>' +
            '</div>'
          );

          row.on('hover:enter', function() {
            var idx = allItems.indexOf(this);
            if (idx >= 0) {
              if (currentFocusIndex >= 0 && allItems[currentFocusIndex]) {
                $(allItems[currentFocusIndex]).css({'background': 'rgba(255,107,53,0.03)', 'border': 'none'});
              }
              currentFocusIndex = idx;
              $(this).css({'background': 'rgba(255,107,53,0.25)', 'border': '1px solid #ff6b35'});
            }
            _this.playVideo(video, movie);
          });

          row.on('hover:focus', function(e) {
            last = e.target;
            var idx = allItems.indexOf(this);
            if (idx >= 0 && currentFocusIndex >= 0 && allItems[currentFocusIndex] && allItems[currentFocusIndex] !== this) {
              $(allItems[currentFocusIndex]).css({'background': 'rgba(255,107,53,0.03)', 'border': 'none'});
            }
            if (idx >= 0) {
              currentFocusIndex = idx;
              $(this).css({'background': 'rgba(255,107,53,0.25)', 'border': '1px solid #ff6b35'});
              scroll.update($(this), true);
            }
          });

          allItems.push(row[0]);
          scroll.append(row);
        });
      });

      scroll.append($(
        '<div class="selector" style="padding: 1.5em; text-align: center; opacity: 0.4; cursor: pointer; margin-top: 1em;">↩ Назад</div>'
      ).on('hover:enter', function() { 
        currentFocusIndex = -1;
        Lampa.Activity.backward(); 
      }));

      setTimeout(function() {
        if (allItems.length > 0) {
          currentFocusIndex = 0;
          $(allItems[0]).css({'background': 'rgba(255,107,53,0.25)', 'border': '1px solid #ff6b35'});
          last = allItems[0];
          debug('Фокус установлен на первый элемент', 'info');
        }
      }, 100);
      
      debug('Готово! ' + allVideos.length + ' видео из ' + keys.length + ' источников', 'success');
      Lampa.Controller.enable('content');
    };

    this.playVideo = function(video, movie) {
      debug('Запуск видео: ' + (video.title || 'Без названия').substring(0, 50), 'stream');
      
      Lampa.Loading.start();
      var playUrl = video.url || video.stream;
      if (!playUrl) { 
        Lampa.Loading.stop(); 
        debug('ОШИБКА: нет ссылки', 'error');
        Lampa.Noty.show('Ссылка недоступна'); 
        return; 
      }

      if (playUrl.indexOf('vkuser.net') !== -1 || playUrl.indexOf('okcdn.ru') !== -1 || playUrl.indexOf('vkvd') !== -1) {
        Lampa.Loading.stop();
        debug('VK видео: ' + playUrl.substring(0, 80), 'stream');
        playVKVideo(playUrl, video.title);
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
        return;
      }

      if (video.method === 'play') {
        if (playUrl.indexOf('_480.mp4') !== -1) {
          playUrl = playUrl.replace('_480.mp4', '_2160.mp4');
          debug('Апгрейд качества: 480p → 2160p', 'warn');
        }
        Lampa.Loading.stop();
        Lampa.Player.play({ title: video.title, url: playUrl, quality: video.quality_text || 'HD', isonline: true });
        debug('Воспроизведение: ' + playUrl.substring(0, 80), 'success');
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
      } else {
        debug('Двойной запрос: ' + playUrl.substring(0, 80), 'info');
        $.ajax({
          url: addToken(playUrl, {token: true}), method: 'GET', dataType: 'json', timeout: 10000,
          success: function(json) {
            Lampa.Loading.stop();
            var s = json.url || json.stream || '';
            if (s.indexOf(' or ') !== -1) s = s.split(' or ')[0];
            if (s) {
              Lampa.Player.play({ title: video.title, url: s, quality: json.quality || video.quality_text || 'HD', subtitles: json.subtitles, isonline: true });
              debug('Стрим получен: ' + s.substring(0, 80), 'success');
              if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
            } else {
              debug('ОШИБКА: пустой ответ от сервера', 'error');
              Lampa.Noty.show('Не удалось');
            }
          },
          error: function(xhr, status, err) {
            Lampa.Loading.stop();
            debug('ОШИБКА запроса: ' + (xhr.status || status) + ' ' + (err || ''), 'error');
            Lampa.Noty.show('Ошибка');
          }
        });
      }
    };

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.initialize();
      debug('Плагин запущен. Навигация активна.', 'success');
      
      Lampa.Controller.add('content', {
        toggle: function() { 
          Lampa.Controller.collectionSet(scroll.render()); 
          Lampa.Controller.collectionFocus(last || false, scroll.render()); 
        },
        up: function() { 
          if (currentFocusIndex > 0 && allItems[currentFocusIndex]) {
            $(allItems[currentFocusIndex]).css({'background': 'rgba(255,107,53,0.03)', 'border': 'none'});
            currentFocusIndex--;
            var t = $(allItems[currentFocusIndex]);
            t.css({'background': 'rgba(255,107,53,0.25)', 'border': '1px solid #ff6b35'});
            last = t[0];
            scroll.update(t, true);
            try { allItems[currentFocusIndex].scrollIntoView({behavior:'smooth',block:'center'}); } catch(e) {}
          } else {
            Lampa.Controller.toggle('head');
          }
        },
        down: function() { 
          if (currentFocusIndex < allItems.length - 1) {
            if (currentFocusIndex >= 0 && allItems[currentFocusIndex]) {
              $(allItems[currentFocusIndex]).css({'background': 'rgba(255,107,53,0.03)', 'border': 'none'});
            }
            currentFocusIndex++;
            var t = $(allItems[currentFocusIndex]);
            t.css({'background': 'rgba(255,107,53,0.25)', 'border': '1px solid #ff6b35'});
            last = t[0];
            scroll.update(t, true);
            try { allItems[currentFocusIndex].scrollIntoView({behavior:'smooth',block:'center'}); } catch(e) {}
          }
        },
        right: function() { 
          if (currentFocusIndex >= 0 && allItems[currentFocusIndex]) {
            $(allItems[currentFocusIndex]).trigger('hover:enter');
          }
        },
        left: function() { Lampa.Activity.backward(); },
        back: function() { Lampa.Activity.backward(); }
      });
      
      Lampa.Controller.toggle('content');
    };

    this.destroy = function() { 
      debug('Плагин выгружен', 'warn');
      if (debugPanel) debugPanel.remove();
      scroll.destroy(); files.destroy(); 
    };
  }

  // ========== РЕГИСТРАЦИЯ ==========
  if (!window.timos_v12_final) {
    window.timos_v12_final = true;
    Lampa.Component.add('timos_v12_final', component);
    Lampa.Manifest.plugins = {
      type: 'video', version: '12.0.0', name: 'TimOs v12',
      description: 'От Папуськи для Мамуськи • TimOs',
      component: 'timos_v12_final',
      onContextLauch: function(obj) { 
        Lampa.Activity.push({ title: 'От Папуськи для Мамуськи', component: 'timos_v12_final', movie: obj, page: 1 }); 
      }
    };
    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var r = e.object.activity.render();
          if (r.find('.timos-v12-btn').length) return;
          var b = $('<div class="full-start__button selector timos-v12-btn" style="background:linear-gradient(135deg,#ff6b35,#d63031,#667eea,#764ba2,#00b894,#fdcb6e);color:#fff;font-weight:700;font-size:1.1em;text-align:center;">❤️ От Папуськи для Мамуськи</div>');
          b.on('hover:enter', function() { 
            Lampa.Activity.push({ title: 'От Папуськи для Мамуськи', component: 'timos_v12_final', movie: e.data.movie, page: 1 }); 
          });
          r.find('.button--play').before(b);
        }, 200);
      }
    });
  }
})();

