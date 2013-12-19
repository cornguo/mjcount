var clips = {
    '0'          : ['0'],
    '1'          : ['1-1', '1-2', '1-3'],
    '10'         : ['A-1', 'A-2', 'A-3'],
    '2'          : ['2-1', '2-2'],
    '2s'         : ['2s-1', '2s-2'],
    '3'          : ['3-1', '3-2'],
    '4'          : ['4-1', '4-2'],
    '5'          : ['5-1', '5-2'],
    '6'          : ['6-1', '6-2'],
    '7'          : ['7-1', '7-2'],
    '8'          : ['8-1', '8-2'],
    '9'          : ['9-1', '9-2', '9-3'],
    'ahy'        : ['ahy'],
    'allare'     : ['allare-1', 'allare-2'],
    'ay'         : ['ay'],
    'bcjl'       : ['bcjl'],
    'beautiful'  : ['beautiful'],
    'become'     : ['become'],
    'bei'        : ['bei'],
    'bless'      : ['bless'],
    'bu'         : ['bu'],
    'buddy'      : ['buddy-1', 'buddy-2'],
    'burn'       : ['burn-1', 'burn-2'],
    'chok'       : ['chok'],
    'classmate'  : ['classmate'],
    'cloud'      : ['cloud'],
    'creativity' : ['creativity'],
    'de'         : ['de'],
    'diamond'    : ['diamond'],
    'dkhj'       : ['dkhj'],
    'dksl'       : ['dksl'],
    'donot'      : ['donot-1', 'donot-2'],
    'ec'         : ['ec'],
    'friend'     : ['friend'],
    'gay'        : ['gay-1', 'gay-2', 'gay-3', 'gay-4'],
    'haha'       : ['haha'],
    'hole'       : ['hole'],
    'i'          : ['i'],
    'is'         : ['is'],
    'ji'         : ['ji'],
    'kd'         : ['kd'],
    'ke'         : ['ke-1', 'ke-2', 'ke-3'],
    'ldzy'       : ['ldzy'],
    'love'       : ['love'],
    'mist'       : ['mist'],
    'momo'       : ['momo'],
    'ng'         : ['ng-1', 'ng-2'],
    'nohole'     : ['nohole'],
    'nong'       : ['nong'],
    'ohno'       : ['ohno'],
    'qs'         : ['qs'],
    'sorry'      : ['sorry'],
    'then'       : ['then'],
    'thatis'     : ['thatis'],
    'tien'       : ['tien'],
    'total'      : ['total'],
    'uh'         : ['uh'],
    'we'         : ['we-1', 'we-2'],
    'wehaveto'   : ['wehaveto'],
    'wl'         : ['wl'],
    'wow'        : ['wow-1', 'wow-2'],
    'wrong'      : ['wrong'],
    'ws'         : ['ws'],
    'yousee'     : ['yousee'],
    'youseesee'  : ['youseesee'],
    'zs'         : ['zs'],
    'zy'         : ['zy']
};

function renderButtons(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            obj.each(function(j, path) {
                var button = $('<button data-token="' + key + '">' + key + '</button>');
                button.on('mousedown', function() {
                    var filename = 'convert/' + path;
                    var sound = new Howl({
                        urls: [filename + '.ogg', filename + '.mp3'],
                        onend: function() {
                            this.unload();
                        }
                    });
                    sound.play();
                })
                .mousedown(holdTimer(), holdHandler());
                $('#buttons').append(button);
            });
        }
    });
}

function holdTimer() {
    return function(clicked) {
        return setTimeout(
            function() {
                $('#tokens')
                    .val(function(index, valueCurrent) {
                        return $.trim(valueCurrent
                            + ' '
                            + $(clicked).data('token'))
                    })
            },
            1500);
    };
}

function holdHandler() {
    return function(eventDown) {
        $(eventDown.target).mouseup(
            eventDown.data(eventDown.target),
            function(eventUp) {
                clearTimeout(eventUp.data);

                return false;
            }
        );

        return false;
    };
}

function sayTokens() {
    $('#tokens').val($('#tokens').val().replace(/_/g, ' ').replace(/#/, ''));
    var tokens = $('#tokens').val().trim().split(' ');
    var sentence = [];
    $(tokens).each(function(i, key) {
        var tokenSet = clips[key];
        if ('undefined' !== typeof(tokenSet)) {
            var token = tokenSet[Math.floor(Math.random()*tokenSet.length)];
            sentence.push(token);
        }
    });

    if (sentence.length > 0) {
        $(sentence).each(function(i, path) {
            filename = 'convert/' + path;
            sentence[i] = new Howl({
                urls: [filename + '.ogg', filename + '.mp3'],
                onend: function() {
                    if ((i+1) < sentence.length) {
                        sentence[i+1].play();
                    } else {
                        $(sentence).each(function(i, obj) {
                            obj.unload();
                        });
                    }
                }
            });
        });

        sentence[0].play();

    }
}

$(document).ready(function() {
    renderButtons(clips);
    var string = window.location.hash.substr(1);
    if (string.length > 0) {
        $('#tokens').val(string);
        sayTokens();
    }
});
