(function($){
    $(document).ready(function(){
        var cards = $('[class^=card]');
        cards.parent().each(function(){
            var wrapper = $(this);
            if(wrapper.children('[class^=card]').length > 1){
                wrapper.css({
                    'webkitTransition': 'none',
                    'transition': 'none'
                })

                wrapper.children('[class^=card]').css({
                    'margin': '0'
                });

                wrapper.packery({
                    // options
                    itemSelector: '[class^=card]',
                    gutter: 16,
                    columnWidth: '[class^=card]'
                });
            }
        });
    });
})(jQuery);
