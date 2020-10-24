$(document).ready(function () {
    var $pswp = $('.pswp')[0];
    var image = [];

    $('.photos').each(function () {
        $(this).find('a').each(function (e, el) {
            $(el).attr('data-index', e);
        })
    })

    $('.photos').each(function () {
        var $pic = $(this),
                getItems = function () {
                    var items = [];
                    $pic.find('a').each(function () {
                        var $href = $(this).attr('href'),
                                $size = $(this).data('size').split('x'),
                                $width = $size[0],
                                $height = $size[1];

                        var item = {
                            src: $href,
                            w: $width,
                            h: $height
                        }
                        if ($(this).parent().find('.title').length) {
                            item.title = $(this).parent().find('.title').html();
                        }

                        items.push(item);
                    });
                    return items;
                }

        var items = getItems();

        $.each(items, function (index, value) {
//            image[index] = new Image();
//            image[index].src = value['src'];
        });

        $pic.on('click', 'a', function (event) {
            event.preventDefault();

            var $index = $(this).data('index');
            var options = {
                index: $index,
                bgOpacity: 0.7,
                showHideOpacity: true,
                history: false,
//                tapToClose: true,
                closeEl: true,
                shareEl: false,
            }

            var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
            lightBox.init();
            return false;
        });
    });
})

