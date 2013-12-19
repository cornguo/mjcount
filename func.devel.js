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

var names = {
    '0'          : '零',
    '1'          : '一',
    '10'         : '十',
    '2'          : '二',
    '2s'         : '兩',
    '3'          : '三',
    '4'          : '四',
    '5'          : '五',
    '6'          : '六',
    '7'          : '七',
    '8'          : '八',
    '9'          : '九',
    'ahy'        : '哎～唷',
    'allare'     : '都是',
    'ay'         : '哎唷',
    'bcjl'       : '保持距離',
    'beautiful'  : '真的很亮很漂亮',
    'become'     : '變成',
    'bei'        : '倍',
    'bless'      : '祝福',
    'bu'         : '不',
    'buddy'      : '巴滴巴底',
    'burn'       : '燒毀',
    'chok'       : '(咳嗽)',
    'classmate'  : '同學',
    'cloud'      : '雲',
    'creativity' : '創意',
    'de'         : '的',
    'diamond'    : '鑽石',
    'dkhj'       : '斷開魂結',
    'dksl'       : '斷開鎖鏈',
    'donot'      : '不要',
    'ec'         : '恩寵',
    'friend'     : '朋友',
    'gay'        : '同性戀',
    'haha'       : '呵哈哈哈',
    'hole'       : '洞',
    'i'          : '我',
    'is'         : '是',
    'ji'         : '機',
    'kd'         : '砍斷',
    'ke'         : '顆',
    'ldzy'       : '零的轉移',
    'love'       : '愛',
    'mist'       : '霧',
    'momo'       : '摸摸',
    'ng'         : '那個',
    'nohole'     : '沒有洞啊',
    'nong'       : '弄',
    'ohno'       : 'oh, no',
    'qs'         : '權勢',
    'sorry'      : 'sorry',
    'then'       : '然後',
    'thatis'     : '那是',
    'tien'       : '天',
    'total'      : '一共',
    'uh'         : '呃',
    'we'         : '我們',
    'wehaveto'   : '我們要',
    'wl'         : '網羅',
    'wow'        : '(讚嘆聲)',
    'wrong'      : '錯了',
    'ws'         : '巫術',
    'yousee'     : '你看',
    'youseesee'  : '你看看',
    'zs'         : '重視',
    'zy'         : '轉移'
};

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

$(document).ready(function() {
    renderTags(clips);
    $('.draggable ul li').draggable({ revert: true });
    $('.droppable').droppable({
        drop: function(e, obj) {
            var key = obj.draggable.data('token');
            var token = $('<li data-token="' + key + '">' + names[key] + '</li>').on('click', function() {$(this).remove()});
            $('#tokens').append(token);
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
