var clips = $(document).data('clips');
var names = $(document).data('names');
var sentences = $(document).data('sentences');
var playing = null;

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
                        onend: function() {this.unload();}
                    });
                    sound.play();
                } catch(e) {
                    console.log('Howl is not found');
                }
                return false;
            })
            button.holdEvent({handler: tokenUpdater(), time: 600});
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
    stopPlaying();
    updateHash();

    var tokens = $('#tokens button');

    if (tokens.length > 0) {
        tokens.removeClass('talking');
        sayToken(tokens);
    } else {
        $('#lucky').click();
    }
}

function feelLucky() {
    var sentence = sentences[Math.floor(Math.random()*sentences.length)];
    appendTokensByString(sentence);
}

function genPath(key) {
    var filename = 'convert/' + key;
    return [filename + '.ogg', filename + '.mp3'];
}

function convertTokToKey(key) {
    var tokenSet = clips[key];
    if ('undefined' !== typeof(tokenSet)) {
        return tokenSet[Math.floor(Math.random()*tokenSet.length)];
    }
    return null;
}

function sayToken(tokens) {
    var tokQue = tokens.not('.talking');

    if (0 === tokQue.length) {
        return;
    }

    var currentTok = tokQue.first();

    playing = new Howl({
        urls: genPath(convertTokToKey(currentTok.data('token'))),
        onplay: function() {
            currentTok.addClass('talking');
            $('html, body').animate({scrollTop: currentTok.position().top - 100}, 'fast');
        },
        onloaderror: function() {
            this.stop();
            this.unload();
        },
        onend: function() {
            if (tokQue.length > 1) {
                sayToken(tokens);
            } else {
                playing = null;
                tokens.removeClass('talking');
            }
            this.unload();
        }
    });
    playing.play();
}

$(document).ready(function() {
    renderButtons(clips);
    var str = window.location.hash.substr(1);
    if (str.length > 0) {
        appendTokensByString(str);
        setTimeout(function() {
            sayTokens();
        }, 1000);
    }
    $('#say').on('click', function() {
        sayTokens();
        return false;
    });
    $('#time').on('click', function() {
        $('#tokens').empty();
        appendTokensByString(getTimeString());
        sayTokens();
        return false;
    });
    $('#clear').on('click', function() {
        $('#tokens').empty();
        stopPlaying();
        return false;
    });
    $('#stop').on('click', function() {
        stopPlaying();
        $('#tokens button').removeClass('talking');
        return false;
    });
    $('#lucky').on('click', function() {
        $('#tokens').empty();
        feelLucky();
        sayTokens();
        return false;
    });
    $('#getlink').on('click', function() {
        return prompt('分享連結', getLink());
    });
    return false;
});

function stopPlaying() {
    if (null !== playing) {
        playing.stop();
        playing.unload();
    }
    playing = null;
}

function appendTokensByString(str) {
    if (str.length > 0) {
        var tokens = str.replace(/_/g, ' ').trim().split(' ');
        $(tokens).each(function(i, key) {
            if ("[TIME]" === key) {
                var timeString = getTimeString();
                appendTokensByString(timeString);
            }
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
    return false;
}

function getTimeString() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var retStr = '';

    if (0 == hour) {
        retStr += '0 dian';
    } else if (2 == hour) {
        retStr += '2s dian ';
    } else if (10 == hour) {
        retStr += '10 dian ';
    } else {
        if (hour < 10) {
            retStr += hour % 10 + ' ';
        } else if (hour > 10) {
            retStr += '10 '
        } else if (hour > 19) {
            retStr += parseInt(hour/10) + ' ';
            retStr += '10 ';
        }
        if (hour > 10 && hour % 10 != 0) {
            retStr += hour % 10 + ' ';
        }
        retStr += ' dian ';
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

function getLink() {
    updateHash();
    return window.location;
}
