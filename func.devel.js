var clips = $(document).data('clips');
var names = $(document).data('names');

function renderTags(objs) {
    $(Object.keys(objs)).each(function(i, key) {
        var obj = $(objs[key]);
        if (obj.length > 0) {
            obj.each(function(j, path) {
                var tag = $('<li data-token="' + key + '">' + names[key] + '</li>');
                tag.on('click', function() {
                    var filename = 'convert/' + path;
                    var sound = new Howl({
                        urls: [filename + '.ogg', filename + '.mp3'],
                        onend: function() {
                            this.unload();
                        }
                    });
                    sound.play();
                });
                $('#tags').append(tag);
            });
        }
    });
    $('#tags').append('<hr class="clear"></hr>');
}

function sayTokens() {
    var tokens = $('#tokens li');
    var sentence = [];
    $(tokens).each(function(i, obj) {
        var key = $(obj).data('token');
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

function tokenMake(key) {
    return $('<li data-token="' + key + '">' + names[key] + '</li>').on('click', function() {$(this).remove()});
}

$(document).ready(function() {
    renderTags(clips);
    $('.draggable ul li').draggable({ revert: true });
    $('.droppable').droppable({
        drop: function(e, obj) {
            var key = obj.draggable.data('token');
            $('#tokens').append(tokenMake(key));
        }
    });
    var string = window.location.hash.substr(1);
    if (string.length > 0) {
        var tokens = string.replace(/_/g, ' ').trim().split(' ');
        $(tokens).each(function(i, key) {
            if ('undefined' !== typeof(names[key])) {
                var token = $('<li data-token="' + key + '">' + names[key] + '</li>').on('click', function() {$(this).remove()});
                $('#tokens').append(token);
            }
        });
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
