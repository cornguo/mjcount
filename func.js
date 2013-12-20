var clips = $(document).data('clips');
var names = $(document).data('names');
var playing = false;

function renderButtons(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            var path = obj[0];
            var button = $('<button data-token="' + key + '">' + names[key] + '</button>');
            button.on('mousedown', function() {
                try {
                    var filename = 'convert/' + path;
                    var sound = new Howl({
                        urls: [filename + '.ogg', filename + '.mp3'],
                        onend: function() { this.unload(); }
                    });
                    sound.play();
                } catch(e) {
                    console.log('Howl is not found')
                }
            })
            button.holdEvent({ handler: tokenUpdater() })
            $('#buttons').append(button);
        }
    });
}

function tokenUpdater() {
    return function(elementClicked) {
        $('#tokens')
            .val(function(index, valueCurrent) {
                return $.trim(valueCurrent
                    + ' '
                    + elementClicked.data('token'))
            });
    }
}

function sayTokens() {
    if (true === playing) {
        return;
    }

    $('#tokens').val($('#tokens').val().replace(/_/g, ' ').replace(/#/, ''));
    var tokens = $('#tokens').val().trim().split(' ');
    var paths = convertTokToPath(tokens);

    if (paths.length > 0) {
//        tokens.removeClass('talking');
        playing = true;
        sayToken(tokens, paths, 0);
    }
}

function convertTokToPath(tokens) {
    var paths = [];
    $(tokens).each(function(i, key) {
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
//            $(tokens[pos]).addClass('talking');
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
//                tokens.removeClass('talking');
                playing = false;
            }
            this.unload();
        }
    }).play();
}

$(document).ready(function() {
    renderButtons(clips);
    var string = window.location.hash.substr(1);
    if (string.length > 0) {
        $('#tokens').val(string);
        sayTokens();
    }
});

function getTimeString() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var retStr = '';

    if (2 == hour) {
        retStr += '2s dian ';
    } else if (10 == hour) {
        retStr += '10 dian ';
    } else {
        if (hour - 10 > 9) {
            retStr += parseInt(hour/10) + ' ';
        }
        retStr += '10 ';
        retStr += hour % 10 + ' dian ';
    }

    if (0 == minute) {
        retStr += 'whole';
        return retStr;
    } else if (2 == minute) {
        retStr += '2s fen';
        return retStr;
    } else if (10 == minute) {
        retStr += '10 fen';
        return retStr;
    }

    if (parseInt(minute/10) > 1) {
        retStr += parseInt(minute/10) + ' ';
    }
    retStr += '10 ';
    if (0 != minute % 10) {
        retStr += minute % 10 + ' ';
    }
    retStr += 'fen';

    return retStr;
}
