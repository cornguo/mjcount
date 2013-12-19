clips = $(document).data('clips');

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
                });
                $('#buttons').append(button);
            });
        }
    });
}

function tokenUpdater(clicked) {
    return function() {
        $('#tokens')
            .val(function(index, valueCurrent) {
                return $.trim(valueCurrent
                    + ' '
                    + $(clicked).data('token'))
            });
    }
}

function holdTimer(time) {
    return function(clicked) {
        return setTimeout(tokenUpdater(clicked), time);
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
