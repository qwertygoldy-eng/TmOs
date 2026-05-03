(function() {
  'use strict';

  var ALL_SOURCES = [
    { name: 'Filmix', url: 'http://144.124.225.106:11310/lite/filmix', type: 'online' },
    { name: 'Collaps', url: 'http://88.218.61.149:9219/lite/collaps', type: 'online' },
    { name: 'Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix', type: 'online' },
    { name: 'Videasy', url: 'http://144.124.225.106:11310/lite/videasy', type: 'online' },
    { name: 'JAC Torrents', url: 'http://144.124.225.106:11310/lite/jac', type: 'torrent' }
  ];

  function parseVideos(str, sourceName, sourceType) {
    try {
      var html = $('<div>' + str + '</div>');
      var videos = [];
      
      html.find('.videos__item').each(function() {
        var item = $(this);
        var data;
        try { data = JSON.parse(item.attr('data-json')); } catch(e) { return; }
        
        if (data.method === 'play' || data.method === 'call' || data.method === 'link') {
          data.source = sourceName;
          data.sourceType = sourceType;
          data.season = item.attr('s') ? parseInt(item.attr('s')) : undefined;
          data.episode = item.attr('e') ? parseInt(item.attr('e')) : undefined;
          data.title = item.text() || data.title || 'Без названия';
          
          if (data.title && !data.quality_text) {
            var qMatch = data.title.match(/(\d{3,4}p|4K|UHD|HD|SDR|HDR|DV|Dolby)/gi);
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
        '<div style="font-size: 1.6em; margin-bottom: 0.3em;">Free Video Search</div>' +
        '<div style="font-size: 0.9em; opacity: 0.6; margin-bottom: 1em;">5 источников - Онлайн без оплаты</div>' +
        '<div class="tim-count" style="font-size: 1.1em; margin-bottom: 0.8em;">0 / ' + totalSources + '</div>' +
        '<div style="height: 0.5em; background: rgba(255,255,255,0.15); border-radius: 0.3em; overflow: hidden;">' +
        '<div class="tim-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #3498db, #2ecc71); border-radius: 0.3em; transition: width 0.3s;"></div>' +
        '</div>' +
        '<div class="tim-status" style="margin-top: 0.8em; font-size: 0.85em; opacity: 0.7;"></div>' +
        '</div>'
      );

      function updateProgress(name, found, count) {
        doneSources++;
        var pct = Math.round((doneSources / totalSources) * 100);
        scroll.body().find('.tim-count').text(doneSources + ' / ' + totalSources);
        scroll.body().find('.tim-bar').css('width', pct + '%');
        scroll.body().find('.tim-status').text((found ? '+' : '-') + ' ' + name + (found ? ' (' + count + ')' : ''));
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
          var badgeColor = isTorrent ? '#e74c3c' : '#27ae60';
          
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
              
              if (video.method === 'link') {
                $.ajax({
                  url: playUrl,
                  method: 'GET',
                  dataType: 'text',
                  timeout: 10000,
                  success: function(data) {
                    var subHtml = $('<div>' + data + '</div>');
                    subHtml.find('.videos__item').each(function() {
                      var item = $(this);
                      var subData;
                      try { subData = JSON.parse(item.attr('data-json')); } catch(e) { return; }
                      
                      if (subData.method === 'play' || subData.method === 'call') {
                        subData.title = video.title;
                        subData.source = video.source;
                        subData.sourceType = video.sourceType;
                        
                        if (subData.method === 'call' && subData.stream) {
                          Lampa.Loading.stop();
                          Lampa.Player.play({
                            title: subData.title,
                            url: subData.stream,
                            isonline: true
                          });
                        } else if (subData.method === 'play' && subData.url) {
                          Lampa.Loading.stop();
                          Lampa.Player.play({
                            title: subData.title,
                            url: subData.url,
                            isonline: true
                          });
                        } else if (subData.url) {
                          $.ajax({
                            url: subData.url,
                            method: 'GET',
                            dataType: 'json',
                            timeout: 10000,
                            success: function(json) {
                              Lampa.Loading.stop();
                              if (json && json.url) {
                                Lampa.Player.play({
                                  title: subData.title,
                                  url: json.url,
                                  isonline: true
                                });
                              } else {
                                Lampa.Noty.show('Ссылка не получена');
                              }
                            },
                            error: function() {
                              Lampa.Loading.stop();
                              Lampa.Noty.show('Ошибка загрузки');
                            }
                          });
                        }
                        return false;
                      }
                    });
                  },
                  error: function() {
                    Lampa.Loading.stop();
                    Lampa.Noty.show('Ошибка загрузки');
                  }
                });
              } else if (video.method === 'call' && video.stream) {
                Lampa.Loading.stop();
                Lampa.Player.play({
                  title: video.title,
                  url: video.stream,
                  isonline: true,
                  quality: video.quality_text
                });
                if (object.movie && object.movie.id) {
                  Lampa.Favorite.add('history', object.movie, 100);
                }
              } else if (video.method === 'play' && playUrl) {
                if (playUrl.indexOf('/lite/') !== -1) {
                  $.ajax({
                    url: playUrl,
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
                          isonline: true
                        });
                        if (object.movie && object.movie.id) {
                          Lampa.Favorite.add('history', object.movie, 100);
                        }
                      } else {
                        Lampa.Noty.show('Ссылка не получена');
                      }
                    },
                    error: function() {
                      Lampa.Loading.stop();
                      Lampa.Noty.show('Ошибка загрузки');
                    }
                  });
                } else {
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
                }
              } else {
                Lampa.Loading.stop();
                Lampa.Noty.show('Воспроизведение недоступно');
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
          url: url,
          method: 'GET',
          dataType: 'text',
          timeout: 8000,
          success: function(data) {
            var videos = parseVideos(data, source.name, source.type);
            updateProgress(source.name, videos.length > 0, videos.length);
            
            if (videos.length > 0) {
              allVideos = allVideos.concat(videos);
            }
            
            if (doneSources >= totalSources) finish();
          },
          error: function() {
            updateProgress(source.name, false, 0);
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

  if (!window.free_video_search) {
    window.free_video_search = true;

    Lampa.Component.add('free_video_search', component);

    Lampa.Manifest.plugins = Lampa.Manifest.plugins || [];
    Lampa.Manifest.plugins.push({
      type: 'video',
      name: 'Free Video Search',
      description: '5 бесплатных источников - Онлайн без оплаты',
      component: 'free_video_search',
      onContextLauch: function(object) {
        Lampa.Component.add('free_video_search', component);
        Lampa.Activity.push({
          url: '',
          title: 'Free Video Search',
          component: 'free_video_search',
          movie: object,
          page: 1
        });
      }
    });

    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var render = e.object.activity.render();
          if (render.find('.fvs-btn').length) return;

          var btn = $(
            '<div class="full-start__button selector fvs-btn" style="background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; font-weight: 600;">' +
            '<span>Free Video Search</span>' +
            '</div>'
          );

          btn.on('hover:enter', function() {
            Lampa.Component.add('free_video_search', component);
            Lampa.Activity.push({
              url: '',
              title: 'Free Video Search',
              component: 'free_video_search',
              movie: e.data.movie,
              page: 1
            });
          });

          var playBtn = render.find('.button--play');
          if (playBtn.length) {
            playBtn.before(btn);
          }
        }, 100);
      }
    });

    if (typeof SettingsApi !== 'undefined') {
      SettingsApi.addComponent({
        name: 'free_video_search',
        component: function() {
          var params = {
            title: 'Free Video Search',
            title_empty: 'Нет данных',
            onBack: function() {
              SettingsApi.back();
            },
            onEmpty: function() {},
            onSelect: function(item) {
              if (item.method === 'call' && item.stream) {
                Lampa.Player.play({
                  title: item.title,
                  url: item.stream,
                  isonline: true
                });
              }
            },
            onMenu: function() {}
          };

          var scroll = new Lampa.Scroll({
            mask: true,
            over: true
          });

          var body = scroll.render();

          body.addClass('torrent-files');

          var html = '<div style="padding: 2em; text-align: center;"><div style="font-size: 1.4em; margin-bottom: 0.5em;">Free Video Search</div><div style="opacity: 0.6; margin-bottom: 1em;">5 бесплатных источников онлайн</div><div style="font-size: 1.1em; opacity: 0.7;">Выберите фильм или сериал для поиска</div><div style="margin-top: 2em; padding: 1em; background: rgba(52, 152, 219, 0.2); border-radius: 0.5em;">Нажмите на любой фильм в каталоге и используйте кнопку "Free Video Search"</div></div>';

          body.append(html);

          return body;
        }
      });
    }

    Lampa.Listener.follow('settings', function(e) {
      if (e.type === 'complite') {
        setTimeout(function() {
          var render = e.object.render();
          if (render.find('.settings-folder[data-component="free_video_search"]').length) return;

          var item = $(
            '<div class="settings-folder selector" data-component="free_video_search">' +
            '<div class="settings-folder__icon">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3498db"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
            '</div>' +
            '<div class="settings-folder__name">Free Video Search</div>' +
            '</div>'
          );

          item.on('hover:enter', function() {
            Lampa.Activity.push({
              url: '',
              title: 'Free Video Search',
              component: 'free_video_search_settings',
              page: 1
            });
          });

          var pluginsFolder = render.find('[data-component="plugins"]').closest('.settings-folder');
          if (pluginsFolder.length) {
            pluginsFolder.after(item);
          }
        }, 100);
      }
    });
  }
})();
