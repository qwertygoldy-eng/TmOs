(function() {
    'use strict';
    
    console.log('[FVS] Plugin loading...');
    
    var SOURCES = [
        { name: 'Filmix', url: 'http://144.124.225.106:11310/lite/filmix' },
        { name: 'Collaps', url: 'http://88.218.61.149:9219/lite/collaps' },
        { name: 'Hydraflix', url: 'http://144.124.225.106:11310/lite/hydraflix' }
    ];
    
    function waitForLampa(callback) {
        var attempts = 0;
        var check = function() {
            attempts++;
            if (typeof Lampa !== 'undefined' && Lampa.Component && Lampa.Scroll && Lampa.Activity) {
                callback();
            } else if (attempts < 50) {
                setTimeout(check, 200);
            } else {
                console.log('[FVS] Lampa not found after 10 seconds');
            }
        };
        check();
    }
    
    function parseVideos(str, sourceName) {
        try {
            var html = $('<div>' + str + '</div>');
            var videos = [];
            html.find('.videos__item').each(function() {
                var item = $(this);
                try { 
                    var data = JSON.parse(item.attr('data-json')); 
                    if (data.method === 'play' || data.method === 'call' || data.method === 'link') {
                        data.source = sourceName;
                        data.title = item.text() || data.title || 'Video';
                        videos.push(data);
                    }
                } catch(e) {}
            });
            return videos;
        } catch(e) { return []; }
    }
    
    function createComponent(object) {
        console.log('[FVS] Creating component for:', object.movie ? object.movie.title : 'unknown');
        
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var allVideos = [];
        var done = 0;
        
        var comp = {
            create: function() { return files.render(); },
            
            initialize: function() {
                var self = this;
                scroll.body().addClass('fvs-search');
                files.appendFiles(scroll.render());
                
                scroll.body().html(
                    '<div style="padding:2em;text-align:center;color:#fff;">' +
                    '<div style="font-size:1.5em;margin-bottom:1em;">Free Video Search</div>' +
                    '<div id="fvs-progress" style="font-size:1.1em;opacity:0.7;">0 / ' + SOURCES.length + '</div>' +
                    '<div id="fvs-status" style="margin-top:1em;font-size:0.9em;opacity:0.5;"></div>' +
                    '</div>'
                );
                
                function finish() {
                    console.log('[FVS] Done. Found:', allVideos.length);
                    scroll.clear();
                    
                    if (!allVideos.length) {
                        scroll.body().html('<div style="padding:3em;text-align:center;color:#888;">Nothing found</div>');
                        Lampa.Controller.enable('content');
                        return;
                    }
                    
                    var grouped = {};
                    allVideos.forEach(function(v) {
                        var k = v.source || 'Unknown';
                        if (!grouped[k]) grouped[k] = [];
                        grouped[k].push(v);
                    });
                    
                    Object.keys(grouped).forEach(function(src) {
                        var block = $('<div style="margin:1em;padding:1em;background:rgba(255,255,255,0.05);border-radius:0.5em;"></div>');
                        block.append('<div style="font-size:1.2em;font-weight:bold;margin-bottom:0.5em;">' + src + ' (' + grouped[src].length + ')</div>');
                        
                        grouped[src].forEach(function(v) {
                            var row = $('<div class="selector" style="padding:0.7em;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.1);">' + (v.title || 'Video') + '</div>');
                            row.on('hover:enter', function() {
                                Lampa.Loading.start();
                                var url = v.url || v.stream;
                                
                                if (v.method === 'call' && v.stream) {
                                    Lampa.Loading.stop();
                                    Lampa.Player.play({ title: v.title, url: v.stream, isonline: true });
                                } else if (v.method === 'play' && url) {
                                    Lampa.Loading.stop();
                                    Lampa.Player.play({ title: v.title, url: url, isonline: true });
                                } else if (v.method === 'link' && url) {
                                    $.ajax({ url: url, success: function(data) {
                                        var h = $('<div>' + data + '</div>');
                                        h.find('.videos__item').each(function() {
                                            var d = JSON.parse($(this).attr('data-json'));
                                            if (d.method === 'call' && d.stream) {
                                                Lampa.Loading.stop();
                                                Lampa.Player.play({ title: v.title, url: d.stream, isonline: true });
                                                return false;
                                            }
                                        });
                                    }, error: function() { Lampa.Loading.stop(); Lampa.Noty.show('Error'); }});
                                } else {
                                    Lampa.Loading.stop();
                                    Lampa.Noty.show('Not playable');
                                }
                            });
                            block.append(row);
                        });
                        scroll.body().append(block);
                    });
                    
                    scroll.body().append('<div class="selector" style="padding:1.5em;text-align:center;color:#888;cursor:pointer;" onclick="Lampa.Activity.backward()">Back</div>');
                    Lampa.Controller.enable('content');
                }
                
                SOURCES.forEach(function(src) {
                    var params = [];
                    if (object.movie) {
                        params.push('id=' + (object.movie.id || '550'));
                        params.push('title=' + encodeURIComponent(object.movie.title || object.movie.name || ''));
                        params.push('serial=' + (object.movie.name ? 1 : 0));
                        params.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '')+'').slice(0,4));
                    }
                    
                    $.ajax({
                        url: src.url + '?' + params.join('&'),
                        timeout: 8000,
                        success: function(data) {
                            var vids = parseVideos(data, src.name);
                            console.log('[FVS] ' + src.name + ':', vids.length);
                            allVideos = allVideos.concat(vids);
                            $('#fvs-progress').text(++done + ' / ' + SOURCES.length);
                            $('#fvs-status').text(src.name + ' ' + (vids.length ? '+' : '-') + vids.length);
                            if (done >= SOURCES.length) finish();
                        },
                        error: function() {
                            console.log('[FVS] ' + src.name + ': error');
                            $('#fvs-progress').text(++done + ' / ' + SOURCES.length);
                            $('#fvs-status').text(src.name + ' -');
                            if (done >= SOURCES.length) finish();
                        }
                    });
                });
            },
            
            start: function() {
                if (Lampa.Activity.active().activity !== this.activity) return;
                this.initialize();
                
                Lampa.Controller.add('fvs_content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(false, scroll.render());
                    },
                    up: function() { Navigator.move('up'); },
                    down: function() { Navigator.move('down'); },
                    left: function() { Navigator.canmove('left') ? Navigator.move('left') : Lampa.Controller.toggle('menu'); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('fvs_content');
            },
            
            render: function() { return files.render(); },
            destroy: function() { scroll.destroy(); files.destroy(); }
        };
        
        return comp;
    }
    
    waitForLampa(function() {
        console.log('[FVS] Lampa ready, registering plugin...');
        
        Lampa.Component.add('free_video_search', createComponent);
        
        Lampa.Manifest.plugins = Lampa.Manifest.plugins || [];
        Lampa.Manifest.plugins.push({
            type: 'video',
            name: 'Free Video Search',
            description: 'Free online video sources',
            component: 'free_video_search'
        });
        
        console.log('[FVS] Plugin registered');
        
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.activity.render();
                    if (render.find('.fvs-btn').length) return;
                    
                    var btn = $('<div class="full-start__button selector fvs-btn" style="background:#3498db;color:#fff;font-weight:600;padding:0.8em 1.5em;border-radius:0.3em;">Free Video Search</div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            title: 'Free Video Search',
                            component: 'free_video_search',
                            movie: e.data.movie,
                            page: 1
                        });
                    });
                    
                    var playBtn = render.find('.button--play');
                    if (playBtn.length) playBtn.before(btn);
                    else render.find('.full-start__buttons').append(btn);
                    
                    console.log('[FVS] Button added');
                }, 500);
            }
        });
        
        Lampa.Listener.follow('settings', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.render();
                    if (render.find('.fvs-setting-btn').length) return;
                    
                    var item = $(
                        '<div class="settings-param selector fvs-setting-btn" style="padding:1em;background:rgba(52,152,219,0.2);cursor:pointer;">' +
                        '<div style="font-size:1.1em;">Free Video Search</div>' +
                        '<div style="opacity:0.6;font-size:0.9em;margin-top:0.3em;">3 free sources</div>' +
                        '</div>'
                    );
                    
                    item.on('hover:enter', function() {
                        Lampa.Activity.push({
                            title: 'Free Video Search',
                            component: 'free_video_search',
                            movie: { id: '550', title: 'Test' },
                            page: 1
                        });
                    });
                    
                    render.find('[data-component="plugins"]').closest('.settings-folder').append(item);
                }, 100);
            }
        });
        
        window.freeVideoSearchReady = true;
        console.log('[FVS] Plugin fully loaded');
    });
    
})();
