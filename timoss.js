(function() {
  'use strict';

  var TOKEN = 'free_token_123';
  var HOST = 'http://showypro.com';

  var ALL_SOURCES = [
    { name: 'FXAPI (12 видео, 4K HDR, DV)', url: HOST + '/lite/fxapi', type: 'online' },
    { name: 'Alloha (21 видео, 4K)', url: HOST + '/lite/alloha', type: 'online' },
    { name: 'Mirage (21 видео, 4K)', url: 'http://91.184.245.78:11560/lite/mirage', type: 'online' },
    { name: 'Pidtor (21 видео, 4K)', url: HOST + '/lite/pidtor', type: 'online' },
    { name: 'Filmix (9 видео, 4K)', url: 'http://144.124.225.106:11310/lite/filmix', type: 'online' },
    { name: 'Collaps (3 видео)', url: 'http://88.218.61.149:9219/lite/collaps', type: 'online' },
    { name: 'Collaps-Dash (3 видео, 720p)', url: 'http://88.218.61.149:9219/lite/collaps-dash', type: 'online' },
    { name: 'Hydraflix (3 видео)', url: 'http://144.124.225.106:11310/lite/hydraflix', type: 'online' },
    { name: 'Videasy (3 видео)', url: 'http://144.124.225.106:11310/lite/videasy', type: 'online' },
    { name: 'Smashystream (3 видео)', url: 'http://144.124.225.106:11310/lite/smashystream', type: 'online' },
    { name: 'JAC Torrents (112 видео, 4K)', url: 'http://144.124.225.106:11310/lite/jac', type: 'torrent' }
  ];

  function account(url) {
    url = url + '';
    if (url.indexOf('showy_token=') === -1) {
      url = Lampa.Utils.addUrlComponent(url, 'showy_token=' + TOKEN);
    }
    return url;
  }

  function parseVideos(str, sourceName, sourceType) {
    try {
      var html = $('<div>' + str + '</div>');
      var videos = [];
      
      html.find('.videos__item').each(function() {
        var item = $(this);
        var data;
        try { data = JSON.parse(item.attr('data-json')); } catch(e) { return; }
        
        if (data.method === 'play' || data.method === 'call') {
          data.source = sourceName;
          data.sourceType = sourceType;
          data.season = item.attr('s') ? parseInt(item.attr('s')) : undefined;
          data.episode = item.attr('e') ? parseInt(item.attr('e')) : undefined;
          data.title = item.text() || data.title || 'Без названия';
          
          if (!data.quality && data.title) {
            var qMatch = data.title.match(/(\d{3,4}p|4K|UHD|HD|SDR|HDR|DV|Dolby\s*Vision)/gi);
            if (qMatch) data.quality_text = qMatch.join(' ');
          }
          
          videos.push(data);
        }
      });
      
      return videos;
    } catch(e) { return []; }
  }

  function component(object) {
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var allVideos = [];
    var totalSources = ALL_SOURCES.length;
    var doneSources = 0;

    this.create = function() { return files.render(); };

    this.initialize = function() {
      var _this = this;
      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());

      scroll.body().append(
        '<div style="padding: 2em; text-align: center;">' +
        '<div style="font-size: 1.6em; margin-bottom: 0.3em;">TimOs Mega</div>' +
        '<div style="font-size: 0.9em; opacity: 0.6; margin-bottom: 1em;">11 источников - 4K HDR - Онлайн + Торренты</div>' +
        '<div class="tim-count" style="font-size: 1.1em; margin-bottom: 0.8em;">0 / ' + totalSources + '</div>' +
        '<div style="height: 0.5em; background: rgba(255,255,255,0.15); border-radius: 0.3em; overflow: hidden;">' +
        '<div class="tim-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff6b35, #ff3838); border-radius: 0.3em; transition: width 0.3s;"></div>' +
        '</div>' +
        '<div class="tim-status" style="margin-top: 0.8em; font-size: 0.85em; opacity: 0.7;"></div>' +
        '</div>'
      );

      function updateProgress(name, found) {
        doneSources++;
        var pct = Math.round((doneSources / totalSources) * 100);
        scroll.body().find('.tim-count').text(doneSources + ' / ' + totalSources);
        scroll.body().find('.tim-bar').css('width', pct + '%');
        scroll.body().find('.tim-status').text((found ? '+ ' : '- ') + name);
      }

      function finish() {
        scroll.clear();

        if (!allVideos.length) {
          scroll.body().append(
            '<div style="padding: 4em; text-align: center;">' +
            '<div style="font-size: 3em; margin-bottom: 0.5em;">(</div>' +
            '<div style="font-size: 1.2em;">Ничего не найдено</div>' +
            '<div style="opacity: 0.5; margin-top: 0.5em;">Попробуйте изменить название</div>' +
            '</div>'
          );
          Lampa.Controller.enable('content');
          return;
        }

        var grouped = {};
        allVideos.forEach(function(v) {
          var key = v.source;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(v);
        });

        var keys = Object.keys(grouped).sort(function(a, b) {
          var aIsTorrent = grouped[a][0].sourceType === 'torrent';
          var bIsTorrent = grouped[b][0].sourceType === 'torrent';
          if (aIsTorrent && !bIsTorrent) return 1;
          if (!aIsTorrent && bIsTorrent) return -1;
          return grouped[b].length - grouped[a].length;
        });

        keys.forEach(function(srcName) {
          var srcVideos = grouped[srcName];
          var isTorrent = srcVideos[0].sourceType === 'torrent';
          var icon = isTorrent ? '[T]' : '[O]';
          var badge = isTorrent ? 'ТОРРЕНТ' : 'ОНЛАЙН';
          var badgeColor = isTorrent ? '#ff6b35' : '#4CAF50';
          
          var block = $(
            '<div style="margin-bottom: 1em;">' +
            '<div style="padding: 0.7em 1.2em; font-size: 1.2em; font-weight: 600; background: rgba(255,255,255,0.06); border-radius: 0.3em; margin-bottom: 0.3em; display: flex; justify-content: space-between; align-items: center;">' +
            '<span>' + icon + ' ' + srcName + ' (' + srcVideos.length + ')</span>' +
            '<span style="font-size: 0.7em; padding: 0.2em 0.6em; border-radius: 0.2em; background: ' + badgeColor + '; color: #fff;">' + badge + '</span>' +
            '</div>' +
            '</div>'
          );

          srcVideos.forEach(function(video) {
            var info = [];
            if (video.quality_text) info.push(video.quality_text);
            if (video.episode) info.push('S' + video.season + 'E' + video.episode);

            var row = $(
              '<div class="selector" style="padding: 0.8em 1.2em; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); cursor: pointer;">' +
              '<div style="flex: 1; min-width: 0;">' +
              '<div style="font-size: 1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + (video.title || 'Без названия') + '</div>' +
              '<div style="font-size: 0.78em; opacity: 0.5; margin-top: 0.2em;">' + info.join(' | ') + '</div>' +
              '</div>' +
              '<div style="opacity: 0.4; font-size: 1.1em; margin-left: 0.8em; flex-shrink: 0;">></div>' +
              '</div>'
            );

            row.on('hover:enter', function() {
              Lampa.Loading.start();
              
              var playUrl = video.url || video.stream;
              if (!playUrl && video.href) playUrl = video.href;
              
              if (video.method === 'play' && playUrl) {
                Lampa.Loading.stop();
                Lampa.Player.play({
                  title: video.title,
                  url: playUrl,
                  isonline: true,
                  quality: video.quality_text
                });
                if (object.movie && object.movie.id) {
                  Lampa.Favorite.add('history', object.movie, 100);
                }
              } else {
                $.ajax({
                  url: account(playUrl || video.url),
                  method: 'GET',
                  dataType: 'json',
                  timeout: 10000,
                  success: function(json) {
                    Lampa.Loading.stop();
                    if (json && json.url) {
                      Lampa.Player.play({
                        title: video.title,
                        url: json.url,
                        quality: json.quality || video.quality_text,
                        subtitles: json.subtitles,
                        isonline: true,
                        season: video.season,
                        episode: video.episode
                      });
                      if (object.movie && object.movie.id) {
                        Lampa.Favorite.add('history', object.movie, 100);
                      }
                    } else {
                      Lampa.Noty.show('Не удалось получить ссылку');
                    }
                  },
                  error: function() {
                    Lampa.Loading.stop();
                    Lampa.Noty.show('Ошибка загрузки');
                  }
                });
              }
            });

            row.on('hover:focus', function(e) {
              scroll.update($(e.target), true);
            });

            block.append(row);
          });

          scroll.body().append(block);
        });

        scroll.body().append(
          '<div class="selector" style="padding: 1.5em; text-align: center; opacity: 0.5; cursor: pointer; margin-top: 1em; font-size: 0.95em;">' +
          '< Назад' +
          '</div>'
        );
        scroll.body().find('.selector').last().on('hover:enter', function() {
          Lampa.Activity.backward();
        });

        Lampa.Controller.enable('content');
      }

      ALL_SOURCES.forEach(function(source) {
        var query = [];
        query.push('id=' + encodeURIComponent(object.movie.id || '550'));
        query.push('title=' + encodeURIComponent(object.movie.title || object.movie.name || ''));
        query.push('original_title=' + encodeURIComponent(object.movie.original_title || object.movie.original_name || ''));
        query.push('serial=' + (object.movie.name ? 1 : 0));
        query.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '') + '').slice(0, 4));
        if (object.movie.imdb_id) query.push('imdb_id=' + object.movie.imdb_id);
        if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + object.movie.kinopoisk_id);
        query.push('source=tmdb');
        query.push('clarification=0');

        var url = source.url + '?' + query.join('&');

        $.ajax({
          url: account(url),
          method: 'GET',
          dataType: 'text',
          timeout: 8000,
          success: function(data) {
            var videos = parseVideos(data, source.name, source.type);
            updateProgress(source.name, videos.length > 0);
            
            if (videos.length > 0) {
              allVideos = allVideos.concat(videos);
            }
            
            if (doneSources >= totalSources) finish();
          },
          error: function() {
            updateProgress(source.name, false);
            if (doneSources >= totalSources) finish();
          }
        });
      });
    };

    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.initialize();

      Lampa.Controller.add('content', {
        toggle: function() {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(false, scroll.render());
        },
        up: function() { Navigator.move('up'); },
        down: function() { Navigator.move('down'); },
        right: function() { Navigator.move('right'); },
        left: function() {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        back: function() { Lampa.Activity.backward(); }
      });

      Lampa.Controller.toggle('content');
    };

    this.render = function() { return files.render(); };
    this.destroy = function() { scroll.destroy(); files.destroy(); };
  }

  if (!window.timos_mega) {
    window.timos_mega = true;

    Lampa.Component.add('timos_mega', component);

    Lampa.Manifest.plugins = Lampa.Manifest.plugins || [];
    Lampa.Manifest.plugins.push({
      type: 'video',
      name: 'TimOs Mega',
      description: '11 источников - Авто-токен - 4K HDR - Онлайн + Торренты',
      component: 'timos_mega',
      onContextLauch: function(object) {
        Lampa.Component.add('timos_mega', component);
        Lampa.Activity.push({
          url: '',
          title: 'TimOs Mega',
          component: 'timos_mega',
          movie: object,
          page: 1
        });
      }
    });

    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var render = e.object.activity.render();
          if (render.find('.timos-mega-btn').length) return;

          var btn = $(
            '<div class="full-start__button selector timos-mega-btn" style="background: linear-gradient(135deg, #ff6b35, #d63031); color: #fff; font-weight: 600;">' +
            '<span>TimOs Mega (11 источников)</span>' +
            '</div>'
          );

          btn.on('hover:enter', function() {
            Lampa.Component.add('timos_mega', component);
            Lampa.Activity.push({
              url: '',
              title: 'TimOs Mega',
              component: 'timos_mega',
              movie: e.data.movie,
              page: 1
            });
          });

          render.find('.button--play').before(btn);
        }, 100);
      }
    });
  }
})();
