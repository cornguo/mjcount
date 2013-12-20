var clips = $(document).data('clips');
var names = $(document).data('names');
var playing = false;

function renderTags(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            var path = obj[0];
            var tag = $('<li data-token="' + key + '">' + names[key] + '</li>');
            tag.on('click', function() {
                var filename = 'convert/' + path;
                var sound = new Howl({
                    urls: [filename + '.ogg', filename + '.mp3'],
                    onend: function() {
                        this.unload();
                    }
                });
                sound.play();
                tag.holdEvent({ handler: tokenUpdater() });
                $('#tags').append(tag);
            });
            $('#tags').append(tag);
        }
    });
    $('#tags').append('<hr class="clear"></hr>');
}

function sayTokens() {
    if (true === playing) {
        return;
    }

    var tokens = $('#tokens li');
    var paths = convertTokToPath(tokens);

    if (paths.length > 0) {
        tokens.removeClass('talking');
        playing = true;
        sayToken(tokens, paths, 0);
    }
}

function convertTokToPath(tokens) {
    var paths = [];
    $(tokens).each(function(i, obj) {
        var key = $(obj).data('token');
        var tokenSet = clips[key];
        if ('undefined' !== typeof(tokenSet)) {
            var token = tokenSet[Math.floor(Math.random()*tokenSet.length)];
            paths.push(token);
        }
    });
    return paths;
}

function sayToken(tokens, paths, pos) {
    var filename = 'convert/' + paths[pos];
    var sound = new Howl({
        urls: [filename + '.ogg', filename + '.mp3'],
        onplay: function() {
            $(tokens[pos]).addClass('talking');
            if (pos+1 < paths.length) {
                var filename = 'convert/' + paths[pos];
                var next = new Howl({
                    urls: [filename + '.ogg', filename + '.mp3'],
                }).unload();
            }
        },
        onloaderror: function() {
            if (pos+1 < paths.length) {
                sayToken(tokens, paths, pos+1);
            }
        },
        onend: function() {
            if (pos+1 < paths.length) {
                sayToken(tokens, paths, pos+1);
            } else {
                tokens.removeClass('talking');
                playing = false;
            }
            this.unload();
        }
    }).play();
}

function tokenMake(key) {
    return $('<li data-token="' + key + '">' + names[key] + '</li>').on('click', function() {$(this).remove()});
}

function tokenUpdater() {
    return function(elementClicked) {
        tokenMake(elementClicked.data('token')).appendTo('#tokens');
    }
}

$(document).ready(function() {
    renderTags(clips);
    var string = window.location.hash.substr(1);
    if (string.length > 0) {
        var tokens = string.replace(/_/g, ' ').trim().split(' ');
        $(tokens).each(function(i, key) {
            if ('undefined' !== typeof(names[key])) {
                $('#tokens').append(tokenMake(key));
            }
        });
        $('#tokens').sortable();
        sayTokens();
    }
    $('#say').on('click', function() {
        var tokens = $('#tokens li');
        if (tokens.length > 0) {
            var hash = '';
            tokens.each(function (i, obj) {
                hash += $(obj).data('token') + ' ';
            });
            window.location.hash = hash.trim().replace(/ /g, '_');
        }
        sayTokens();
    });
});
