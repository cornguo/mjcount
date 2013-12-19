var clips = $(document).data('clips');
var names = $(document).data('names');

function renderButtons(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            var path = obj[0];
            var button = $('<button data-token="' + key + '">' + names[key] + '</button>');
            button.on('mousedown', function() {
                var filename = 'convert/' + path;
                var sound = new Howl({
                    urls: [filename + '.ogg', filename + '.mp3'],
                    onend: function() {
                        this.unload();
                    }
                });
                sound.play();
            }).mousedown(holdTimer(), holdHandler());
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

function getTimeString() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var retStr = '';

    if (hour - 10 >= 0) {
        retStr += parseInt(hour/10) + ' ';
        retStr += '10 ';
    }
    retStr += hour % 10 + ' dian ';

    if (0 == minute) {
        retStr += 'whole';
        return retStr;
    }

    if (minute - 10 >= 0) {
        retStr += parseInt(minute/10) + ' ';
        retStr += '10 ';
    }
    if (0 != minute % 10) {
        retStr += minute % 10 + ' ';
    }
    retStr += 'fen';

    return retStr;
}
