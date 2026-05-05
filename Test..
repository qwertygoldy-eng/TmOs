(function() {
  'use strict';

  var TOKEN = 'free_token_123';
  var RC_PARAMS = 'cub_id=1075737612&account_email=qwerty.goldy@gmail.com&uid=uw66smxc&nws_id=9yffoznegf4uxuat4ksqt2oqgnreymnp';

  var ALL_SOURCES = [
    { name: '93 Filmix 4K', url: 'http://93.183.95.219:11378/lite/filmix', token: true },
    { name: '93 Mirage 4K', url: 'http://93.183.95.219:11378/lite/mirage', token: true },
    { name: '93 Collaps', url: 'http://93.183.95.219:11378/lite/collaps', token: true },
    { name: '93 VK Видео', url: 'http://93.183.95.219:11378/lite/vkmovie', token: true, vk: true },
    { name: '93 Rutube', url: 'http://93.183.95.219:11378/lite/rutubemovie', token: true },
    { name: 'Z01 Filmix 4K', url: 'http://z01.online/lite/filmix', token: false },
    { name: 'Z01 VK Видео', url: 'http://z01.online/lite/vkmovie', token: false, vk: true },
    { name: 'Z01 VeoVeo', url: 'http://z01.online/lite/veoveo', token: false },
    { name: 'Z01 Rutube', url: 'http://z01.online/lite/rutubemovie', token: false },
    { name: 'Z01 iRemux', url: 'http://z01.online/lite/remux', token: false },
    { name: 'Z01 Geosaitebi', url: 'http://z01.online/lite/geosaitebi', token: false },
    { name: 'Z01 HD', url: 'http://z01.online/lite/hd', token: false },
    { name: 'Z01 DVD', url: 'http://z01.online/lite/dvd', token: false },
    { name: 'FXAPI 4K HDR', url: 'http://showypro.com/lite/fxapi', token: true },
    { name: 'Alloha 1080p', url: 'http://showypro.com/lite/alloha', token: true },
    { name: 'Pidtor 4K', url: 'http://showypro.com/lite/pidtor', token: true },
    { name: 'Mirage 4K', url: 'http://showypro.com/lite/mirage', token: true },
    { name: 'Showy Ultra', url: 'http://showypro.com/lite/ultra', token: true },
    { name: 'Filmix IP1 4K', url: 'http://144.124.225.106:11310/lite/filmix', token: true },
    { name: 'Filmix IP2 4K', url: 'http://88.218.61.149:9219/lite/filmix', token: true },
    { name: 'Filmix IP3 4K', url: 'http://91.184.245.78:11560/lite/filmix', token: true },
    { name: 'Collaps', url: 'http://88.218.61.149:9219/lite/collaps', token: true },
    { name: 'Collaps-Dash', url: 'http://88.218.61.149:9219/lite/collaps-dash', token: true },
    { name: 'Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix', token: true },
    { name: 'Videasy', url: 'http://144.124.225.106:11310/lite/videasy', token: true },
    { name: 'Smashystream', url: 'http://144.124.225.106:11310/lite/smashystream', token: true },
    { name: 'Alloha Direct', url: 'http://88.218.61.149:9219/lite/alloha', token: true },
    { name: 'Firestream', url: 'http://144.124.225.106:11310/lite/fire', token: true },
    { name: 'Megastream', url: 'http://88.218.61.149:9219/lite/mega', token: true },
    { name: 'RC Filmix 4K', url: 'http://rc.bwa.ad/lite/filmix', token: false, rc: true },
    { name: 'RC VK Видео', url: 'http://rc.bwa.ad/lite/vkmovie', token: false, rc: true, vk: true },
    { name: 'RC VeoVeo', url: 'http://rc.bwa.ad/lite/veoveo', token: false, rc: true },
    { name: 'RC Geosaitebi', url: 'http://rc.bwa.ad/lite/geosaitebi', token: false, rc: true },
    { name: 'RC Alloha', url: 'http://rc.bwa.ad/lite/alloha', token: false, rc: true },
    { name: 'RC Collaps', url: 'http://rc.bwa.ad/lite/collaps', token: false, rc: true },
    { name: 'Kinopoisk HD', url: 'http://z01.online/lite/kinopoisk', token: false },
    { name: 'HDVB', url: 'http://z01.online/lite/hdvb', token: false },
    { name: 'LostFilm', url: 'http://showypro.com/lite/lostfilm', token: true },
    { name: 'NewStudio', url: 'http://showypro.com/lite/newstudio', token: true },
    { name: 'Fishkin', url: 'http://z01.online/lite/fishkin', token: false },
    { name: 'Kinolux', url: 'http://showypro.com/lite/kinolux', token: true }
  ];

  var debugPanel = null;
  var debugBtn = null;
  var backTap = 0;
  var backTimer = null;

  function log(msg, type) {
    type = type || 'info';
    var time = new Date().toLocaleTimeString();
    console.log('[TimOs] ' + msg);
    if (debugPanel) {
      var c = type === 'error' ? '#e74c3c' : type === 'ok' ? '#2ecc71' : type === 'warn' ? '#f39c12' : '#fff';
      debugPanel.find('.dl').append('<div style="color:' + c + ';font-size:10px;padding:2px 5px;">' + time + ' ' + msg + '</div>');
      debugPanel.find('.dl').scrollTop(99999);
    }
  }

  function initDebug() {
    // Панель отладки
    debugPanel = $(
      '<div style="position:fixed;bottom:0;left:0;right:0;height:160px;background:rgba(0,0,0,0.97);z-index:999999;display:none;font-family:monospace;">' +
      '<div style="background:#ff6b35;color:#fff;padding:8px 12px;display:flex;justify-content:space-between;font-size:12px;" class="dh">' +
      '<span>TimOs Debug</span><span style="font-size:16px;cursor:pointer;" class="dc">X</span>' +
      '</div>' +
      '<div class="dl" style="height:130px;overflow-y:auto;padding:5px;"></div>' +
      '</div>'
    ).appendTo('body');
    debugPanel.find('.dh').on('click', function() { debugPanel.hide(); updateBtn(); });
    debugPanel.find('.dc').on('click', function(e) { e.stopPropagation(); debugPanel.hide(); updateBtn(); });

    // Кнопка всегда видна
    debugBtn = $(
      '<div id="debug-fixed" style="position:fixed;bottom:15px;left:15px;z-index:99999;background:#ff6b35;color:#fff;width:40px;height:40px;border-radius:50%;font-size:20px;text-align:center;line-height:40px;cursor:pointer;font-weight:bold;box-shadow:0 2px 15px rgba(0,0,0,0.6);">🐛</div>'
    ).appendTo('body');
    debugBtn.on('click', function() {
      if (debugPanel.is(':visible')) { debugPanel.hide(); } else { debugPanel.show(); }
      updateBtn();
    });
  }

  function updateBtn() {
    if (debugPanel.is(':visible')) {
      debugBtn.css('background', '#d63031');
    } else {
      debugBtn.css('background', '#ff6b35');
    }
  }

  function addToken(url, s) {
    if (s.token && url.indexOf('showy_token=') === -1) url = Lampa.Utils.addUrlComponent(url, 'showy_token=' + TOKEN);
    if (s.rc && url.indexOf('cub_id=') === -1) url = Lampa.Utils.addUrlComponent(url, RC_PARAMS);
    return url;
  }

  function parseVideos(str, src) {
    var v = [];
    try {
      var re = /data-json='([^']+)'/g, m;
      while ((m = re.exec(str)) !== null) {
        try {
          var d = JSON.parse(m[1]);
          if (d.method === 'play' || d.method === 'call' || d.method === 'link') {
            d.source = src;
            d.title = d.title || d.translate || '?';
            if (d.url && d.url.indexOf(' or ') !== -1) d.url = d.url.split(' or ')[0];
            if (d.stream && d.stream.indexOf(' or ') !== -1) d.stream = d.stream.split(' or ')[0];
            if (d.translate && d.translate.indexOf('4K') !== -1) d.qt = '4K';
            else if (d.translate && d.translate.indexOf('1080') !== -1) d.qt = '1080p';
            else if (d.maxquality) d.qt = d.maxquality;
            if (d.method === 'link' && d.url) { d.method = 'call'; d.stream = d.url; }
            v.push(d);
          }
        } catch(e) {}
      }
    } catch(e) {}
    return v;
  }

  function component(obj) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(obj);
    var filter = new Lampa.Filter(obj);
    var all = [];
    var total = ALL_SOURCES.length;
    var done = 0;
    var last;
    var idx = -1;
    var items = [];

    this.create = function() { return files.render(); };
    this.render = function() { return files.render(); };

    this.init = function() {
      var self = this;
      initDebug();
      log('Start. Sources: ' + total, 'ok');

      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));

      scroll.append($(
        '<div style="padding:1em;text-align:center;background:linear-gradient(135deg,rgba(255,107,53,0.15),rgba(102,126,234,0.15));border-radius:0.5em;margin:0.5em;">' +
        '<div style="font-size:1.4em;font-weight:700;background:linear-gradient(90deg,#ff6b35,#d63031,#667eea);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">От Папуськи для Мамуськи</div>' +
        '<div style="font-size:0.6em;opacity:0.3;">TimOs v12 • ' + total + ' источников</div>' +
        '<div id="cnt" style="font-size:0.85em;margin-top:0.5em;">Поиск: 0/' + total + '</div>' +
        '<div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0.5em 1em 0 1em;"><div id="bar" style="height:100%;width:0;background:linear-gradient(90deg,#ff6b35,#d63031,#667eea,#764ba2,#00b894);border-radius:2px;"></div></div>' +
        '<div id="log" style="margin-top:0.5em;font-size:0.65em;opacity:0.5;max-height:80px;overflow-y:auto;text-align:left;padding:0 1em;"></div>' +
        '</div>'
      ));

      var movie = obj.movie || obj;
      var title = movie.title || movie.name || '';

      ALL_SOURCES.forEach(function(s) {
        var p = [];
        p.push('id=' + encodeURIComponent(movie.id || '550'));
        p.push('title=' + encodeURIComponent(title));
        p.push('original_title=' + encodeURIComponent(movie.original_title || movie.original_name || ''));
        p.push('serial=' + (movie.name ? 1 : 0));
        p.push('year=' + ((movie.release_date || movie.first_air_date || '')+'').slice(0,4));
        if (movie.imdb_id) p.push('imdb_id=' + movie.imdb_id);
        if (movie.kinopoisk_id) p.push('kinopoisk_id=' + movie.kinopoisk_id);
        p.push('source=tmdb'); p.push('clarification=0');
        var url = s.url + '?' + p.join('&');
        url = addToken(url, s);

        $.ajax({
          url: url, method: 'GET', dataType: 'text', timeout: 12000,
          success: function(d) {
            var v = parseVideos(d, s.name);
            all = all.concat(v);
            done++; upUI(s.name, v.length);
            log(s.name + ': ' + (v.length > 0 ? 'OK +' + v.length : '--'), v.length > 0 ? 'ok' : 'warn');
            if (done >= total) self.finish(movie);
          },
          error: function(x) {
            done++; upUI(s.name, -1);
            log(s.name + ': ERR ' + (x.status || '?'), 'error');
            if (done >= total) self.finish(movie);
          }
        });
      });

      function upUI(n, c) {
        var pct = Math.round((done / total) * 100);
        $('#cnt').text('Поиск: ' + done + '/' + total);
        $('#bar').css('width', pct + '%');
        var ic = c > 0 ? '+' : c === 0 ? '~' : '-';
        $('#log').append('<div>' + ic + ' ' + n + (c > 0 ? ' +' + c : '') + '</div>');
        var el = $('#log')[0]; if (el) el.scrollTop = el.scrollHeight;
      }
    };

    this.finish = function(movie) {
      scroll.clear();
      items = []; idx = -1;
      log('Total videos: ' + all.length, all.length > 0 ? 'ok' : 'error');

      if (!all.length) {
        scroll.append($('<div style="padding:4em;text-align:center;">Ничего не найдено</div>'));
        Lampa.Controller.enable('content');
        return;
      }

      var g = {};
      all.forEach(function(v) { var k = v.source || '?'; if (!g[k]) g[k] = []; g[k].push(v); });
      var keys = Object.keys(g).sort(function(a,b){ return g[b].length - g[a].length });

      scroll.append($('<div style="padding:0.5em;text-align:center;background:rgba(255,107,53,0.15);border-radius:0.3em;margin:0.5em;"><div style="font-weight:bold;color:#ff6b35;">Найдено: ' + all.length + ' видео</div></div>'));

      keys.forEach(function(k) {
        var vv = g[k];
        scroll.append($('<div style="margin:0.3em 0.5em;padding:0.3em 0.8em;background:rgba(255,107,53,0.08);border-left:3px solid #ff6b35;border-radius:0.2em;"><div style="font-size:0.85em;font-weight:bold;color:#ff6b35;">' + k + ' (' + vv.length + ')</div></div>'));

        vv.forEach(function(v) {
          var inf = [];
          if (v.qt) inf.push(v.qt);
          if (v.translate) inf.push(v.translate.replace(/\[.*?\]/g, '').trim());

          var row = $(
            '<div class="selector ti" style="padding:0.5em 0.8em;margin:0 0.5em;background:rgba(255,107,53,0.03);border-bottom:1px solid rgba(255,255,255,0.02);cursor:pointer;display:flex;justify-content:space-between;align-items:center;">' +
            '<div style="flex:1;min-width:0;"><div style="font-size:0.82em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (v.title || '?') + '</div>' +
            (inf.length ? '<div style="font-size:0.68em;opacity:0.5;">' + inf.join(' / ') + '</div>' : '') + '</div>' +
            '<div style="opacity:0.3;margin-left:0.5em;">▶</div></div>'
          );

          row.on('hover:enter', function() {
            var i = items.indexOf(this);
            if (i >= 0) {
              if (idx >= 0 && items[idx]) $(items[idx]).css({background:'rgba(255,107,53,0.03)',border:'none'});
              idx = i;
              $(this).css({background:'rgba(255,107,53,0.25)',border:'1px solid #ff6b35'});
            }
            playV(v, movie);
          });

          row.on('hover:focus', function(e) {
            last = e.target;
            var i = items.indexOf(this);
            if (i >= 0 && idx >= 0 && items[idx] && items[idx] !== this) $(items[idx]).css({background:'rgba(255,107,53,0.03)',border:'none'});
            if (i >= 0) {
              idx = i;
              $(this).css({background:'rgba(255,107,53,0.25)',border:'1px solid #ff6b35'});
              scroll.update($(this), true);
            }
          });

          items.push(row[0]);
          scroll.append(row);
        });
      });

      scroll.append($('<div class="selector" style="padding:1.5em;text-align:center;opacity:0.4;cursor:pointer;margin-top:1em;">Назад</div>').on('hover:enter', function() { idx = -1; Lampa.Activity.backward(); }));

      setTimeout(function() {
        if (items.length > 0) {
          idx = 0;
          $(items[0]).css({background:'rgba(255,107,53,0.25)',border:'1px solid #ff6b35'});
          last = items[0];
        }
      }, 100);

      Lampa.Controller.enable('content');
    };

    function playV(v, movie) {
      log('Play: ' + (v.title || '?').substring(0, 40), 'ok');
      Lampa.Loading.start();
      var u = v.url || v.stream;
      if (!u) { Lampa.Loading.stop(); log('No URL', 'error'); return; }

      if (u.indexOf('vkuser') !== -1 || u.indexOf('okcdn') !== -1 || u.indexOf('vkvd') !== -1) {
        Lampa.Loading.stop();
        Lampa.Player.play({ title: v.title, url: u, isonline: true });
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
        return;
      }

      if (v.method === 'play') {
        if (u.indexOf('_480.mp4') !== -1) u = u.replace('_480.mp4', '_2160.mp4');
        Lampa.Loading.stop();
        Lampa.Player.play({ title: v.title, url: u, quality: v.qt || 'HD', isonline: true });
        if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
      } else {
        $.ajax({
          url: addToken(u, {token: true}), method: 'GET', dataType: 'json', timeout: 10000,
          success: function(j) {
            Lampa.Loading.stop();
            var s = j.url || j.stream || '';
            if (s.indexOf(' or ') !== -1) s = s.split(' or ')[0];
            if (s) {
              Lampa.Player.play({ title: v.title, url: s, quality: j.quality || v.qt || 'HD', subtitles: j.subtitles, isonline: true });
              if (movie && movie.id) Lampa.Favorite.add('history', movie, 100);
            } else { log('Empty response', 'error'); Lampa.Noty.show('Не удалось'); }
          },
          error: function(x) { Lampa.Loading.stop(); log('Err: ' + (x.status || '?'), 'error'); Lampa.Noty.show('Ошибка'); }
        });
      }
    }

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.init();
      Lampa.Controller.add('content', {
        toggle: function() { Lampa.Controller.collectionSet(scroll.render()); Lampa.Controller.collectionFocus(last || false, scroll.render()); },
        up: function() {
          if (idx > 0 && items[idx]) {
            $(items[idx]).css({background:'rgba(255,107,53,0.03)',border:'none'});
            idx--;
            var t = $(items[idx]);
            t.css({background:'rgba(255,107,53,0.25)',border:'1px solid #ff6b35'});
            last = t[0]; scroll.update(t, true);
            try { items[idx].scrollIntoView({behavior:'smooth',block:'center'}); } catch(e) {}
          } else { Lampa.Controller.toggle('head'); }
        },
        down: function() {
          if (idx < items.length - 1) {
            if (idx >= 0 && items[idx]) $(items[idx]).css({background:'rgba(255,107,53,0.03)',border:'none'});
            idx++;
            var t = $(items[idx]);
            t.css({background:'rgba(255,107,53,0.25)',border:'1px solid #ff6b35'});
            last = t[0]; scroll.update(t, true);
            try { items[idx].scrollIntoView({behavior:'smooth',block:'center'}); } catch(e) {}
          }
        },
        right: function() { if (idx >= 0 && items[idx]) $(items[idx]).trigger('hover:enter'); },
        left: function() { Lampa.Activity.backward(); },
        back: function() {
          backTap++;
          if (backTap === 1) {
            backTimer = setTimeout(function() { backTap = 0; }, 600);
          } else if (backTap >= 2) {
            clearTimeout(backTimer); backTap = 0;
            debugPanel.show(); updateBtn();
            return;
          }
          Lampa.Activity.backward();
        }
      });
      Lampa.Controller.toggle('content');
    };

    this.destroy = function() { if (debugPanel) debugPanel.remove(); if (debugBtn) debugBtn.remove(); scroll.destroy(); files.destroy(); };
  }

  if (!window.timos_v12) {
    window.timos_v12 = true;
    Lampa.Component.add('timos_v12', component);
    Lampa.Manifest.plugins = {
      type: 'video', version: '12.0.0', name: 'TimOs v12',
      description: 'От Папуськи для Мамуськи',
      component: 'timos_v12',
      onContextLauch: function(obj) { Lampa.Activity.push({ title: 'От Папуськи для Мамуськи', component: 'timos_v12', movie: obj, page: 1 }); }
    };
    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var r = e.object.activity.render();
          if (r.find('.timos-btn').length) return;
          var b = $('<div class="full-start__button selector timos-btn" style="background:linear-gradient(135deg,#ff6b35,#d63031,#667eea,#764ba2,#00b894,#fdcb6e);color:#fff;font-weight:700;font-size:1.1em;text-align:center;">От Папуськи для Мамуськи</div>');
          b.on('hover:enter', function() { Lampa.Activity.push({ title: 'От Папуськи для Мамуськи', component: 'timos_v12', movie: e.data.movie, page: 1 }); });
          r.find('.button--play').before(b);
        }, 200);
      }
    });
  }
})();
