(function() {
    'use strict';
    
    var SOURCES = [
        { name: 'Filmix', url: 'http://144.124.225.106:11310/lite/filmix', icon: '🎬' },
        { name: 'Collaps', url: 'http://88.218.61.149:9219/lite/collaps', icon: '📺' },
        { name: 'Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix', icon: '🚀' }
    ];
    
    var SOURCE_ID = 'video_balancer';
    var SOURCE_NAME = 'Video Balancer';
    
    function log(msg) {
        console.log('[VB] ' + msg);
    }
    
    function parseVideos(str, sourceName) {
        var videos = [];
        try {
            var html = $('<div>' + str + '</div>');
            html.find('.videos__item').each(function() {
                try { 
                    var data = JSON.parse($(this).attr('data-json')); 
                    if (data.method === 'play' || data.method === 'call') {
                        data.source = sourceName;
                        data.title = $(this).find('.videos__item-title').text() || data.translate || data.title || 'Video';
                        videos.push(data);
                    }
                } catch(e) {}
            });
        } catch(e) {}
        return videos;
    }
    
    function createComponent(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var filter = new Lampa.Filter(object);
        var allVideos = [];
        var doneSources = 0;
        var totalSources = SOURCES.length;
        var initialized;
        var last;
        
        this.initialize = function() {
            var _this = this;
            filter.onSearch = function(value) { Lampa.Activity.replace({ search: value, clarification: true }); };
            filter.onBack = function() { _this.start(); };
            if (filter.addButtonBack) filter.addButtonBack();
            
            files.appendFiles(scroll.render());
            files.appendHead(filter.render());
            scroll.body().addClass('torrent-list');
            scroll.minus(files.render().find('.explorer__files-head'));
            this.search();
        };
        
        this.create = function() { return this.render(); };
        this.search = function() { this.activity.loader(true); this.find(); };
        
        this.find = function() {
            var movie = object.movie || object;
            var title = movie.title || movie.name || 'Test';
            
            scroll.body().html(
                '<div style="padding:2em;text-align:center;color:#fff;">' +
                '<div style="font-size:1.4em;margin-bottom:0.3em;color:#3498db;">⚡ ' + SOURCE_NAME + '</div>' +
                '<div style="font-size:0.85em;opacity:0.5;margin-bottom:1.5em;">Поиск: ' + title + '</div>' +
                '<div id="vb-progress" style="font-size:1.2em;margin-bottom:0.5em;">0 / ' + totalSources + '</div>' +
                '<div style="height:6px;background:rgba(255,255,255,0.15);border-radius:3px;overflow:hidden;margin-bottom:1em;">' +
                '<div id="vb-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#3498db,#2ecc71);transition:width 0.5s;"></div></div>' +
                '<div id="vb-status" style="font-size:0.85em;opacity:0.6;max-height:200px;overflow:auto;"></div>' +
                '</div>'
            );
            
            SOURCES.forEach(function(src) {
                var params = [];
                params.push('id=' + encodeURIComponent(movie.id || '550'));
                params.push('title=' + encodeURIComponent(title));
                params.push('original_title=' + encodeURIComponent(movie.original_title || movie.original_name || ''));
                params.push('serial=' + (movie.name ? 1 : 0));
                params.push('year=' + ((movie.release_date || movie.first_air_date || '')+'').slice(0,4));
                if (movie.imdb_id) params.push('imdb_id=' + movie.imdb_id);
                params.push('source=tmdb');
                params.push('clarification=0');
                
                network.clear();
                network.timeout(8000);
                network.silent(src.url + '?' + params.join('&'), function(data) {
                    var vids = parseVideos(data, src.name);
                    allVideos = allVideos.concat(vids);
                    var status = vids.length > 0 ? '<span style="color:#2ecc71;">+' + vids.length + ' видео</span>' : '<span style="color:#e74c3c;">нет результатов</span>';
                    $('#vb-status').append('<div>+ ' + src.name + ': ' + status + '</div>');
                    doneSources++;
                    updateProgress();
                    if (doneSources >= totalSources) finish();
                }, function(a, c) {
                    $('#vb-status').append('<div style="color:#e74c3c;">- ' + src.name + ': ошибка ' + c + '</div>');
                    doneSources++;
                    updateProgress();
                    if (doneSources >= totalSources) finish();
                });
            });
        };
        
        function updateProgress() {
            var pct = Math.round((doneSources / totalSources) * 100);
            $('#vb-progress').text(doneSources + ' / ' + totalSources + ' загружено');
            $('#vb-bar').css('width', pct + '%');
            $('#vb-status').scrollTop($('#vb-status')[0].scrollHeight);
        }
        
        function finish() {
            scroll.clear();
            this.activity.loader(false);
            
            if (!allVideos.length) {
                scroll.append($('<div class="online-empty"><div class="online-empty__title">Ничего не найдено</div><div class="online-empty__time">Попробуйте другое название</div></div>'));
                return;
            }
            
            var grouped = {};
            allVideos.forEach(function(v) {
                var k = v.source;
                if (!grouped[k]) grouped[k] = [];
                grouped[k].push(v);
            });
            
            scroll.body().html('<div style="padding:1em;background:rgba(46,204,113,0.2);border-radius:0.5em;margin:0.5em;text-align:center;color:#2ecc71;font-weight:bold;font-size:1.2em;">' + allVideos.length + ' видео найдено</div>');
            
            Object.keys(grouped).sort(function(a,b){ return grouped[b].length - grouped[a].length }).forEach(function(src) {
                var block = $('<div style="margin:0.5em;padding:1em;background:rgba(255,255,255,0.05);border-radius:0.5em;"><div style="font-size:1.1em;font-weight:bold;color:#3498db;margin-bottom:0.5em;">' + src + ' (' + grouped[src].length + ')</div></div>');
                
                grouped[src].forEach(function(v) {
                    var q = v.maxquality || (v.quality ? Object.keys(v.quality)[0] : '') || '';
                    var ti = (v.title || 'Video').trim();
                    var tr = v.translate || '';
                    
                    var row = $('<div class="online-prestige online-prestige--full selector" style="margin:0.3em 0;padding:0.8em;background:rgba(52,152,219,0.15);border-radius:0.3em;cursor:pointer;"><div style="display:flex;justify-content:space-between;"><div><div style="font-size:1em;">' + ti + '</div><div style="font-size:0.8em;opacity:0.5;">' + tr + (q ? ' | ' + q : '') + '</div></div><div style="opacity:0.4;padding-left:1em;">▶</div></div></div>');
                    
                    row.on('hover:enter', function() {
                        var url = v.url || v.stream;
                        if (v.method === 'call' && v.stream) url = v.stream;
                        if (url) {
                            Lampa.Player.play({ title: ti, url: url, isonline: true, quality: q });
                            if (movie.id) Lampa.Favorite.add('history', movie, 100);
                        } else {
                            Lampa.Noty.show('Нет ссылки');
                        }
                    });
                    
                    row.on('hover:focus', function(e) { last = e.target; scroll.update($(e.target), true); });
                    block.append(row);
                });
                scroll.append(block);
            });
            
            var back = $('<div class="selector" style="padding:1.5em;text-align:center;color:#666;margin-top:1em;cursor:pointer;border:1px solid rgba(255,255,255,0.1);border-radius:0.3em;">← Назад</div>');
            back.on('hover:enter', function() { Lampa.Activity.backward(); });
            back.on('hover:focus', function(e) { last = e.target; scroll.update($(e.target), true); });
            scroll.append(back);
            
            Lampa.Controller.enable('content');
        }
        
        this.activity = object;
        this.render = function() { return files.render(); };
        
        this.start = function() {
            if (Lampa.Activity.active().activity !== this.activity) return;
            if (!initialized) { initialized = true; this.initialize(); }
            
            Lampa.Controller.add('content', {
                toggle: function() { Lampa.Controller.collectionSet(scroll.render(), files.render()); Lampa.Controller.collectionFocus(last || false, scroll.render()); },
                up: function() { if (Navigator.canmove('up')) Navigator.move('up'); else Lampa.Controller.toggle('head'); },
                down: function() { Navigator.move('down'); },
                right: function() { if (Navigator.canmove('right')) Navigator.move('right'); else filter.show('Фильтр', 'filter'); },
                left: function() { if (Navigator.canmove('left')) Navigator.move('left'); else Lampa.Controller.toggle('menu'); },
                back: function() { Lampa.Activity.backward(); }
            });
            
            Lampa.Controller.toggle('content');
        };
        
        this.pause = function() {};
        this.stop = function() {};
        this.destroy = function() { network.clear(); files.destroy(); scroll.destroy(); };
    }
    
    function startPlugin() {
        if (window.video_balancer_installed_v4) {
            log('Already installed');
            return;
        }
        window.video_balancer_installed_v4 = true;
        
        log('=== Video Balancer v4 Installing ===');
        
        Lampa.Component.add(SOURCE_ID, createComponent);
        log('Component registered: ' + SOURCE_ID);
        
        Lampa.Manifest.plugins = {
            type: 'video',
            version: '4.0.0',
            name: SOURCE_NAME,
            description: '3 бесплатных источника - Без оплаты',
            component: SOURCE_ID,
            onContextLauch: function(obj) {
                Lampa.Activity.push({
                    title: SOURCE_NAME,
                    component: SOURCE_ID,
                    movie: obj,
                    page: 1
                });
            }
        };
        log('Plugin manifest set (official format)');
        
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                var render = e.object.activity.render();
                var movie = e.data.movie;
                var title = movie.title || movie.name || 'Video';
                
                if (render.find('.vb-btn').length) return;
                
                var btn = $(
                    '<div class="full-start__button selector vb-btn" style="background:linear-gradient(135deg,#3498db,#2980b9);color:#fff;font-weight:600;padding:0.7em 1.2em;border-radius:0.3em;margin-right:0.5em;cursor:pointer;">' +
                    '⚡ ' + SOURCE_NAME +
                    '</div>'
                );
                
                btn.on('hover:enter', function() {
                    Lampa.Component.add(SOURCE_ID, createComponent);
                    Lampa.Activity.push({
                        url: '',
                        title: SOURCE_NAME,
                        component: SOURCE_ID,
                        search: title,
                        search_one: title,
                        search_two: movie.original_title || movie.original_name || '',
                        movie: movie,
                        page: 1
                    });
                });
                
                function insertBtn() {
                    if (render.find('.vb-btn').length) return;
                    var btns = render.find('.full-start__buttons');
                    if (btns.length) { btns.append(btn); log('Button added to buttons'); return; }
                    var play = render.find('.button--play');
                    if (play.length) { play.before(btn); log('Button added before play'); return; }
                    var first = render.find('.full-start__button').first();
                    if (first.length) { first.before(btn); log('Button added before first'); return; }
                }
                
                insertBtn();
                setTimeout(insertBtn, 500);
                setTimeout(insertBtn, 1000);
                setTimeout(insertBtn, 2000);
            }
        });
        
        Lampa.Listener.follow('settings', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.render();
                    if (render.find('.vb-setting-final').length) return;
                    
                    var sourcesFolder = render.find('[data-component="sources"]');
                    var videoFolders = render.find('.settings-folder');
                    
                    var settingItem = $(
                        '<div class="settings-param selector vb-setting-final" style="padding:1em;background:rgba(52,152,219,0.15);cursor:pointer;border-left:3px solid #3498db;margin:0.5em 1em;">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                        '<div><div style="font-size:1.1em;font-weight:600;">⚡ ' + SOURCE_NAME + '</div>' +
                        '<div style="font-size:0.85em;opacity:0.6;margin-top:3px;">Filmix + Collaps + Hydraflix • FREE</div></div>' +
                        '<div style="background:#2ecc71;color:#fff;padding:0.3em 0.8em;border-radius:0.3em;font-size:0.8em;font-weight:bold;">FREE</div>' +
                        '</div></div>'
                    );
                    
                    settingItem.on('hover:enter', function() {
                        Lampa.Activity.push({
                            url: '',
                            title: SOURCE_NAME,
                            component: SOURCE_ID,
                            movie: { id: '550', title: 'Test' },
                            page: 1
                        });
                    });
                    
                    if (sourcesFolder.length) {
                        sourcesFolder.after(settingItem);
                        log('Added after sources folder');
                    } else if (videoFolders.length > 0) {
                        videoFolders.first().after(settingItem);
                        log('Added after first video folder');
                    } else {
                        render.append(settingItem);
                        log('Appended to render');
                    }
                }, 1500);
            }
        });
        
        log('=== Installation Complete ===');
        
        if (typeof alert !== 'undefined') {
            setTimeout(function() {
                alert('⚡ Video Balancer v4 installed!\n\n3 Free Sources:\n• Filmix\n• Collaps\n• Hydraflix\n\nGo to any movie and click the ⚡ button!');
            }, 500);
        }
    }
    
    var init_timer = setInterval(function() {
        if (typeof Lampa !== 'undefined' && Lampa.Component && Lampa.Manifest) {
            clearInterval(init_timer);
            startPlugin();
        }
    }, 200);
    
    if (document.readyState === 'complete') {
        clearInterval(init_timer);
        startPlugin();
    }
})();
