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
                    var sound = new Howl({
                        urls: genPath(path),
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

function tokenMake(key) {
    return $('<button data-token="' + key + '">' + names[key] + '</button>').on('dblclick', function() {$(this).remove()});
}

function tokenUpdater() {
    return function(elementClicked) {
        tokenMake(elementClicked.data('token')).appendTo('#tokens');
        $('#tokens').sortable({cancel: ''});
    }
}

function sayTokens() {
    if (true === playing) {
        return;
    }
    updateHash();

    var tokens = $('#tokens button');
    var keys = convertTokToKey(tokens);

    if (keys.length > 0) {
        tokens.removeClass('talking');
        playing = true;
        sayToken(tokens, keys, 0);
    } else {
        feelLucky();
    }
}

function feelLucky() {
    var sentences = [
        'yousee youseesee haveno is you donot nong i jzlmy',
        'chok',
        '1 ke 2s ke 3 ke 4 ke total 5 bei ec',
        'sorry i wrong wehaveto love gay friend wow',
        'ldzy czr',
        'uh',
        'ng already ' + getTimeString() + ' wow bk de classmate qz',
        'ahy qsj allare friend',
        'ng cloud ng mist czr',
        'we love 5 5 6 6',
        'i de sound very moe i love moe',
        'youhaveto share i de sound'
    ];
    appendTokensByString(sentences[Math.floor(Math.random()*sentences.length)]);
    sayTokens();
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
    if (0 != pos && false == playing) {
        return;
    }
    var sound = new Howl({
        urls: genPath(keys[pos]),
        onplay: function() {
            $(tokens[pos]).addClass('talking');
            $('html, body').animate({scrollTop: $(tokens[pos]).position().top - 20}, 'fast');
            if (pos+1 < keys.length) {
                var next = new Howl({
                    urls: genPath(keys[pos+1])
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

$(document).ready(function() {
    renderButtons(clips);
    var str = window.location.hash.substr(1);
    if (str.length > 0) {
        appendTokensByString(str);
        sayTokens();
    }
    $('#say').on('click', function() {
        sayTokens();
    });
    $('#time').on('click', function() {
        $('#tokens').empty();
        playing = false;
        appendTokensByString(getTimeString());
        sayTokens();
    });
    $('#clear').on('click', function() {
        $('#tokens').empty();
        playing = false;
    });
    $('#stop').on('click', function() {
        playing = false;
        $('#tokens button').removeClass('talking');
    });
    $('#lucky').on('click', function() {
        $('#tokens').empty();
        playing = false;
        feelLucky();
    });
});

function appendTokensByString(str) {
    if (str.length > 0) {
        var tokens = str.replace(/_/g, ' ').trim().split(' ');
        $(tokens).each(function(i, key) {
            if ('undefined' !== typeof(names[key])) {
                $('#tokens').append(tokenMake(key));
            }
        });
        $('#tokens').sortable({cancel: ''});
    }
}

function updateHash() {
    var tokens = $('#tokens button');
    if (tokens.length > 0) {
        var hash = '';
        tokens.each(function (i, obj) {
            hash += $(obj).data('token') + ' ';
        });
        window.location.hash = hash.trim().replace(/ /g, '_');
    }
}

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
