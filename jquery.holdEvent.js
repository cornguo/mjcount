(function($) {

function holdClearer(isTimeout) {
    return function(event) {
        isTimeout ?
            clearTimeout(event.data)
            : clearInterval(event.data);
    }
}

function holdEventDelayedLoop(element, handler, time) {
    element.on(
        'mouseup mouseout',
        setTimeout(
            function() {
                element.on(
                    'mouseup mouseout',
                    setInterval(function() { handler(element); }, time / 10),
                    holdClearer(false)
                );
            },
            time / 2
        ),
        holdClearer(true)
    );
}

$.fn.holdEvent = function(options) {
    var settings = $.extend(
        {
            handler: function() {},
            time: 500
        },
        options),
        element = this;

    this.mousedown(
        function() {
            return setTimeout(
                function() {
                    settings.handler(element);
                    holdEventDelayedLoop(element, settings.handler, settings.time)
                },
                settings.time);
        },
        function(eventDown) {
            $(eventDown.target).on(
                'mouseup mouseout',
                eventDown.data(),
                holdClearer(true)
            );

            return false;
        });

    return this;
}

})(jQuery)
