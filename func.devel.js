var clips = $(document).data('clips');
var names = $(document).data('names');
var playing = false;

function renderTags(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            var path = obj[0];
            var tag = $('<li data-token="' + key + '">' + names[key] + '</li>');
            tag.on('mousedown', function() {
                var sound = new Howl({
                    urls: genPath(path),
                    onend: function() {
                        this.unload();
                    }
                });
                sound.play();
                tag.holdEvent({ handler: tokenUpdater() });
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
    var keys = convertTokToKey(tokens);

    if (keys.length > 0) {
        tokens.removeClass('talking');
        playing = true;
        sayToken(tokens, keys, 0);
    }
}

function genPath(key) {
    var filename = 'convert/' + key;
    return [filename + '.ogg', filename + '.mp3'];
}

function convertTokToKey(tokens) {
    var keys = [];
    $(tokens).each(function(i, obj) {
        var key = $(obj).data('token');
        var tokenSet = clips[key];
        if ('undefined' !== typeof(tokenSet)) {
            var token = tokenSet[Math.floor(Math.random()*tokenSet.length)];
            keys.push(token);
        }
    });
    return keys;
}

function sayToken(tokens, keys, pos) {
    var sound = new Howl({
        urls: genPath(keys[pos]),
        onplay: function() {
            $(tokens[pos]).addClass('talking');
            if (pos+1 < keys.length) {
                var next = new Howl({
                    urls: genPath(keys[pos+1]),
                }).unload();
            }
        },
        onloaderror: function() {
            if (pos+1 < keys.length) {
                sayToken(tokens, keys, pos+1);
            }
        },
        onend: function() {
            if (pos+1 < keys.length) {
                sayToken(tokens, keys, pos+1);
            } else {
                tokens.removeClass('talking');
                playing = false;
            }
            this.unload();
        }
    }).play();
}

function tokenMake(key) {
    return $('<li data-token="' + key + '">' + names[key] + '</li>').on('dblclick', function() {$(this).remove()});
}

function tokenUpdater() {
    return function(elementClicked) {
        tokenMake(elementClicked.data('token')).appendTo('#tokens').sortable();
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
