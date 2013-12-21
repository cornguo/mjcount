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
            });
            tag.holdEvent({handler: tokenUpdater(), time: 600});
            $('#tags').append(tag);
        }
    });
    $('#tags').append('<hr class="clear"></hr>');
}

function sayTokens() {
    if (true === playing) {
        return;
    }

    var tokens1 = $('#tokens1 li');
    var keys1 = convertTokToKey(tokens1);
    var tokens2 = $('#tokens2 li');
    var keys2 = convertTokToKey(tokens2);

    if (keys1.length > 0 || keys2.length > 0) {
        $('.talking').removeClass('talking');
        playing = true;
        sayToken(tokens1, keys1, 0);
        sayToken(tokens2, keys2, 0);
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
    if (0 === tokens.length) {
        return;
    }
    var sound = new Howl({
        urls: genPath(keys[pos]),
        onplay: function() {
            $(tokens[pos]).addClass('talking');
            if (pos+1 < keys.length) {
                var next = new Howl({
                    urls: genPath(keys[pos+1]),
                }).unload();
            }
            if ('+' === keys[pos][0]) {
                setTimeout(function() {
                    if (pos+1 < keys.length) {
                        sayToken(tokens, keys, pos+1);
                    } else {
                        tokens.removeClass('talking');
                        playing = false;
                    }
                }, 250);
            }
        },
        onloaderror: function() {
            if (pos+1 < keys.length) {
                sayToken(tokens, keys, pos+1);
            }
        },
        onend: function() {
            if ('+' !== keys[pos][0]) {
                if (pos+1 < keys.length) {
                    sayToken(tokens, keys, pos+1);
                } else {
                    tokens.removeClass('talking');
                    playing = false;
                }
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
        var obj = $('#tokens' + $('input[name=zone]:checked').val());
        tokenMake(elementClicked.data('token')).appendTo(obj);
        obj.sortable();
    }
}

$(document).ready(function() {
    renderTags(clips);
    var string = window.location.hash.substr(1);
    if (string.length > 0) {
        var parts = string.replace(/_/g, ' ').trim().split('|');
        $(parts).each(function(n, k) {
            var tokens = k.split(' ');
            $(tokens).each(function(i, key) {
                if ('undefined' !== typeof(names[key])) {
                    $('#tokens' + (n+1)).append(tokenMake(key));
                }
            });
        });
        $('#tokens1').sortable();
        $('#tokens2').sortable();
        sayTokens();
    }
    $('#say').on('click', function() {
        var tokens1 = $('#tokens1 li');
        if (tokens1.length > 0) {
            var hash = '';
            tokens1.each(function (i, obj) {
                hash += $(obj).data('token') + ' ';
            });
            window.location.hash = hash.trim().replace(/ /g, '_');
        }
        var tokens2 = $('#tokens2 li');
        if (tokens2.length > 0) {
            var hash = '';
            tokens2.each(function (i, obj) {
                hash += $(obj).data('token') + ' ';
            });
            window.location.hash += '|' + hash.trim().replace(/ /g, '_');
        }

        sayTokens();
    });
});
