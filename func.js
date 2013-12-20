var clips = $(document).data('clips');
var names = $(document).data('names');
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
    var sentences = [
        'yousee youseesee haveno is you donot nong i jzlmy',
        'chok',
        '1 ke 2s ke 3 ke 4 ke total 5 bei de ec',
        'sorry i wrong wehaveto love gay friend wow',
        'ldzy czr',
        'uh',
        'ng already ' + getTimeString() + ' wow bk de classmate qz',
        'ahy qsj allare friend',
        'ng cloud ng mist czr',
        'we love 5 5 6 6',
        'i de sound very moe i love moe',
        'youhaveto share i de sound',
        'i donot dkhj i donot dksl',
        'qsj de gay allare friend we donot bcjl',
        'ohno',
        'ldzy become 1 haha',
        'ji ji ji ji bei bei bei bei',
        'hole 10 hole hole 10 hole 10 hole',
        'wah',
        'love i de qjs',
        '10 9 8 7 6 5 4 3 2 1 uh 5 bei ec wow',
        'hhd love you de dx jzlmy',
        'i love ke ke ke',
        'i de sound czr',
        'momo i de thb',
        'you is i de jie mei you is i de bei bei',
        '+13 +11 +05 +11 +12 +15 +00 +00 +12 +13 +12 +05 +11',
        '+11 +11 +12 +13 +14 +15 +15 +15 +15 +14 +13 +15 +15 +15 +15 +16 +17 +21 +00 +13 +13 +16 +15'
    ];
    appendTokensByString(sentences[Math.floor(Math.random()*sentences.length)]);
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
        sayTokens();
    }
    $('#say').on('click', function() {
        sayTokens();
    });
    $('#time').on('click', function() {
        $('#tokens').empty();
        appendTokensByString(getTimeString());
        sayTokens();
    });
    $('#clear').on('click', function() {
        $('#tokens').empty();
        stopPlaying();
    });
    $('#stop').on('click', function() {
        stopPlaying();
        $('#tokens button').removeClass('talking');
    });
    $('#lucky').on('click', function() {
        $('#tokens').empty();
        feelLucky();
        sayTokens();
    });
    $('#getlink').on('click', function() {
        return prompt('分享連結', getLink());
    });
});

function stopPlaying() {
    if (null !== playing) {
        playing.stop();
        playing.unload();
    }
    playing = null;
    setTimeout(function() {}, 1000);
}

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
