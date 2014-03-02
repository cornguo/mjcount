var clips = $(document).data('clips');
var names = $(document).data('names');
var sentences = $(document).data('sentences');
var categories = $(document).data('categories');
var playing = null;
var previous = null;

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
            if (0 === $('#buttons div[data-category="' + categories[key] + '"]').length) {
                var div = $('<div data-category="' + categories[key] + '"><h2>' + categories[key] + '</h2></div>');
                $('#buttons').append(div);
            }
            $('#buttons div[data-category="' + categories[key] + '"]').append(button);
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
            var pos = currentTok.position().top - $('#tokens').position().top - 10;
            if (pos > 0) {
                $('#tokens').animate({scrollTop: $('#tokens').scrollTop() + pos}, 'fast');
            }
        },
        onloaderror: function() {
            this.stop();
            this.unload();
        },
        onend: function() {
            if (null !== previous) {
                previous.unload();
                previous = null;
            }
            if (tokQue.length > 1) {
                previous = this;
                sayToken(tokens);
            } else {
                playing = null;
                this.unload();
                tokens.removeClass('talking');
            }
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
    $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    return false;
});

function stopPlaying() {
    if (null !== playing) {
        try {
            playing.stop();
            playing.unload();
        } catch (e) {
            playing = null;
        }
    }
    $('#tokens').animate({scrollTop: 0}, 'fast');
    playing = null;
    previous = null;
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

    if (0 === minute) {
        return convertNumToTok(hour) + ' dian whole';
    } else {
        return convertNumToTok(hour) + ' dian ' + convertNumToTok(minute) + ' fen';
    }
}

function convertNumToTok(num) {
    if (0 == num) {
        return '0';
    } else if (2 == num) {
        return '2s';
    } else if (10 == num) {
        return '10';
    } else {
        if (num < 10) {
            return num;
        } else if (num > 10 && num < 20) {
            return '10 ' + (num%10);
        } else if (num >= 20) {
            var retStr = parseInt(num/10) + ' 10 ';
            if (num % 10 != 0) {
                retStr += num % 10;
            }
            return retStr;
        }
    }
}

function getLink() {
    updateHash();
    return window.location;
}
