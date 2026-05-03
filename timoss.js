\/**
 * Video Balancer - Native Lampa Source
 * Adds as built-in video source in Settings
 */
(function() {
    'use strict';
    
    var SOURCES = [
        { name: 'Filmix', url: 'http://144.124.225.106:11310/lite/filmix' },
        { name: 'Collaps', url: 'http://88.218.61.149:9219/lite/collaps' },
        { name: 'Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix' }
    ];
    
    var SOURCE_ID = 'video_balancer';
    var SOURCE_NAME = 'Video Balancer';
    
    function waitForLampa(callback, attempts) {
        attempts = attempts || 0;
        if (typeof Lampa !== 'undefined' && Lampa.Component && Lampa.Scroll && Lampa.Activity && Lampa.Storage) {
            callback();
        } else if (attempts < 100) {
            setTimeout(function() { waitForLampa(callback, attempts + 1); }, 100);
        }
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
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var allVideos = [];
        var done = 0;
        
        var comp = {
            create: function() { return files.render(); },
            
            initialize: function() {
                scroll.body().addClass('vb-balancer');
                files.appendFiles(scroll.render());
                
                var title = object.movie ? (object.movie.title || object.movie.name || 'Search') : 'Search';
                
                scroll.body().html(
                    '<div style="padding:2em;text-align:center;color:#fff;">' +
                    '<div style="font-size:1.5em;margin-bottom:0.5em;">Video Balancer</div>' +
                    '<div style="font-size:0.9em;opacity:0.5;margin-bottom:1.5em;">3 Free Sources - No Payment</div>' +
                    '<div id="vb-title" style="font-size:1.1em;margin-bottom:1em;color:#3498db;">' + title + '</div>' +
                    '<div id="vb-status" style="font-size:0.9em;opacity:0.7;">Searching...</div>' +
                    '<div style="height:4px;background:rgba(255,255,255,0.1);margin:1em 0;border-radius:2px;">' +
                    '<div id="vb-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#3498db,#2ecc71);transition:width 0.3s;"></div></div>' +
                    '<div id="vb-log" style="font-size:0.75em;opacity:0.5;max-height:100px;overflow:auto;"></div>' +
                    '</div>'
                );
                
                function log(msg, isError) {
                    var color = isError ? '#e74c3c' : '#2ecc71';
                    $('#vb-log').append('<div style="color:' + color + ';margin:2px 0;">' + (isError ? '-' : '+') + ' ' + msg + '</div>');
                    $('#vb-log').scrollTop($('#vb-log')[0].scrollHeight);
                }
                
                function finish() {
                    scroll.clear();
                    
                    if (!allVideos.length) {
                        scroll.body().html(
                            '<div style="padding:4em;text-align:center;color:#888;">' +
                            '<div style="font-size:2em;margin-bottom:0.5em;">(</div>' +
                            '<div style="font-size:1.1em;">No videos found</div>' +
                            '<div style="opacity:0.5;margin-top:0.5em;">Try another title</div>' +
                            '</div>'
                        );
                        Lampa.Controller.enable('content');
                        return;
                    }
                    
                    var grouped = {};
                    allVideos.forEach(function(v) {
                        var k = v.source;
                        if (!grouped[k]) grouped[k] = [];
                        grouped[k].push(v);
                    });
                    
                    var total = allVideos.length;
                    scroll.body().html(
                        '<div style="padding:1em;background:rgba(46,204,113,0.2);border-radius:0.5em;margin:0.5em;text-align:center;font-size:1.2em;">' +
                        '<span style="color:#2ecc71;font-weight:bold;">' + total + '</span> videos found' +
                        '</div>'
                    );
                    
                    Object.keys(grouped).sort(function(a,b){ return grouped[b].length - grouped[a].length }).forEach(function(src) {
                        var block = $('<div style="margin:0.5em;padding:1em;background:rgba(255,255,255,0.05);border-radius:0.5em;"></div>');
                        block.append(
                            '<div style="font-size:1.1em;font-weight:bold;color:#3498db;margin-bottom:0.5em;">' +
                            src + ' <span style="opacity:0.5;font-size:0.8em;">(' + grouped[src].length + ')</span>' +
                            '</div>'
                        );
                        
                        grouped[src].forEach(function(v) {
                            var q = v.maxquality || (v.quality ? Object.keys(v.quality)[0] : '') || '';
                            var tr = v.translate || '';
                            var ti = (v.title || 'Video').trim();
                            
                            var row = $('<div class="selector" style="padding:0.8em;cursor:pointer;background:rgba(52,152,219,0.15);border-radius:0.3em;margin-bottom:4px;"></div>');
                            row.html(
                                '<div style="font-size:0.95em;">' + ti + '</div>' +
                                '<div style="font-size:0.75em;opacity:0.6;margin-top:3px;">' + tr + (q ? ' | ' + q : '') + '</div>'
                            );
                            
                            row.on('hover:enter', function() {
                                Lampa.Loading.start();
                                var url = v.url || v.stream;
                                if (v.method === 'call' && v.stream) url = v.stream;
                                
                                if (url) {
                                    Lampa.Loading.stop();
                                    Lampa.Player.play({ title: ti, url: url, isonline: true, quality: q });
                                    if (object.movie && object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
                                } else {
                                    Lampa.Loading.stop();
                                    Lampa.Noty.show('No URL');
                                }
                            });
                            
                            row.on('hover:focus', function() {
                                $(this).css('background', 'rgba(52,152,219,0.4)');
                                scroll.update($(this), true);
                            });
                            
                            row.on('hover:blur', function() {
                                $(this).css('background', 'rgba(52,152,219,0.15)');
                            });
                            
                            block.append(row);
                        });
                        scroll.body().append(block);
                    });
                    
                    var back = $('<div class="selector" style="padding:1.5em;text-align:center;color:#666;cursor:pointer;margin:1em 0;border:1px solid rgba(255,255,255,0.1);border-radius:0.3em;font-size:0.95em;">Back</div>');
                    back.on('hover:enter', function() { Lampa.Activity.backward(); });
                    scroll.body().append(back);
                    
                    Lampa.Controller.enable('content');
                }
                
                SOURCES.forEach(function(src) {
                    var params = [];
                    if (object.movie) {
                        params.push('id=' + encodeURIComponent(object.movie.id || '550'));
                        params.push('title=' + encodeURIComponent(object.movie.title || object.movie.name || ''));
                        params.push('original_title=' + encodeURIComponent(object.movie.original_title || object.movie.original_name || ''));
                        params.push('serial=' + (object.movie.name ? 1 : 0));
                        params.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '')+'').slice(0,4));
                        if (object.movie.imdb_id) params.push('imdb_id=' + object.movie.imdb_id);
                        if (object.movie.kinopoisk_id) params.push('kinopoisk_id=' + object.movie.kinopoisk_id);
                        params.push('source=tmdb');
                        params.push('clarification=0');
                    }
                    
                    $('#vb-status').text('Loading ' + src.name + '...');
                    log(src.name + ' - connecting...');
                    
                    $.ajax({
                        url: src.url + '?' + params.join('&'),
                        timeout: 10000,
                        cache: false,
                        success: function(data) {
                            var vids = parseVideos(data, src.name);
                            allVideos = allVideos.concat(vids);
                            var pct = Math.round((++done / SOURCES.length) * 100);
                            $('#vb-bar').css('width', pct + '%');
                            log(src.name + ': ' + vids.length + ' videos', vids.length === 0);
                            $('#vb-status').text(done + '/' + SOURCES.length + ' sources loaded');
                            if (done >= SOURCES.length) finish();
                        },
                        error: function() {
                            var pct = Math.round((++done / SOURCES.length) * 100);
                            $('#vb-bar').css('width', pct + '%');
                            log(src.name + ': error', true);
                            $('#vb-status').text(done + '/' + SOURCES.length + ' sources loaded');
                            if (done >= SOURCES.length) finish();
                        }
                    });
                });
            },
            
            start: function() {
                if (Lampa.Activity.active().activity !== this.activity) return;
                this.initialize();
                
                Lampa.Controller.add(SOURCE_ID, {
                    toggle: function() {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(false, scroll.render());
                    },
                    up: function() { Navigator.move('up'); },
                    down: function() { Navigator.move('down'); },
                    left: function() { Navigator.canmove('left') ? Navigator.move('left') : Lampa.Controller.toggle('menu'); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle(SOURCE_ID);
            },
            
            render: function() { return files.render(); },
            destroy: function() { scroll.destroy(); files.destroy(); }
        };
        
        return comp;
    }
    
    // Register as Lampa component
    waitForLampa(function() {
        Lampa.Component.add(SOURCE_ID, createComponent);
        
        // Add to plugins list
        Lampa.Manifest.plugins = Lampa.Manifest.plugins || [];
        var exists = Lampa.Manifest.plugins.some(function(p) { return p.component === SOURCE_ID; });
        if (!exists) {
            Lampa.Manifest.plugins.push({
                type: 'video',
                name: SOURCE_NAME,
                description: '3 free sources - no payment required',
                component: SOURCE_ID,
                onContextLauch: function(obj) {
                    Lampa.Activity.push({
                        title: SOURCE_NAME,
                        component: SOURCE_ID,
                        movie: obj,
                        page: 1
                    });
                }
            });
        }
        
        // Add button to movie card
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.activity.render();
                    if (render.find('.vb-btn').length) return;
                    
                    var btn = $(
                        '<div class="full-start__button selector vb-btn" ' +
                        'style="background:linear-gradient(135deg,#3498db,#2980b9);color:#fff;font-weight:600;' +
                        'padding:0.8em 1.2em;border-radius:0.3em;margin-right:0.5em;cursor:pointer;">' +
                        SOURCE_NAME + '</div>'
                    );
                    
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            title: SOURCE_NAME,
                            component: SOURCE_ID,
                            movie: e.data.movie,
                            page: 1
                        });
                    });
                    
                    var playBtn = render.find('.button--play');
                    if (playBtn.length) playBtn.before(btn);
                }, 500);
            }
        });
        
        // Add to Settings > Video Sources
        Lampa.Listener.follow('settings', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.render();
                    if (render.find('.vb-setting').length) return;
                    
                    // Find video source settings section
                    var sourceSection = render.find('[data-component="sources"]').closest('.settings-folder');
                    
                    if (sourceSection.length) {
                        var item = $(
                            '<div class="settings-param selector vb-setting" ' +
                            'style="padding:1em;background:rgba(52,152,219,0.2);cursor:pointer;' +
                            'border-left:3px solid #3498db;margin:0.5em 0;">' +
                            '<div style="display:flex;align-items:center;">' +
                            '<div style="flex:1;">' +
                            '<div style="font-size:1.1em;font-weight:600;">' + SOURCE_NAME + '</div>' +
                            '<div style="font-size:0.8em;opacity:0.6;margin-top:3px;">3 sources: Filmix, Collaps, Hydraflix</div>' +
                            '</div>' +
                            '<div style="color:#2ecc71;font-size:0.9em;">FREE</div>' +
                            '</div>' +
                            '</div>'
                        );
                        
                        item.on('hover:enter', function() {
                            Lampa.Activity.push({
                                title: SOURCE_NAME,
                                component: SOURCE_ID,
                                movie: { id: '550', title: 'Test Movie' },
                                page: 1
                            });
                        });
                        
                        sourceSection.after(item);
                    }
                }, 200);
            }
        });
        
        // Register as video source parser
        Lampa.VideoSource = Lampa.VideoSource || {};
        Lampa.VideoSource[SOURCE_ID] = {
            name: SOURCE_NAME,
            parse: function(movie, callback) {
                var results = [];
                var loaded = 0;
                
                SOURCES.forEach(function(src) {
                    var params = [];
                    params.push('id=' + encodeURIComponent(movie.id || '550'));
                    params.push('title=' + encodeURIComponent(movie.title || movie.name || ''));
                    params.push('serial=' + (movie.name ? 1 : 0));
                    params.push('year=' + ((movie.release_date || movie.first_air_date || '')+'').slice(0,4));
                    
                    $.ajax({
                        url: src.url + '?' + params.join('&'),
                        timeout: 8000,
                        success: function(data) {
                            var vids = parseVideos(data, src.name);
                            results = results.concat(vids);
                            loaded++;
                            if (loaded >= SOURCES.length) callback(results);
                        },
                        error: function() {
                            loaded++;
                            if (loaded >= SOURCES.length) callback(results);
                        }
                    });
                });
            }
        };
        
        window.videoBalancerReady = true;
        console.log('[Video Balancer] Installed successfully');
    });
})();
