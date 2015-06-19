var isGallery = isGallery || true;
var found = false;

function parseAlbum(data){

    var albumTemplate = '<div class="col-xs-4 gallery-column ' +
        ( data.hidden ? ' album-hidden " style="display:none' : '' ) + '">' +
        '<div class="gallery-item album-item" data-id="' + data.id + '">' +
        '<a class="item-anchor" href="' +
        (data.static != false && data.static != undefined ? data.static : '') +
        '#/album/' + data.id + '"></a>' +
        '<div class="item-cover" style="min-height: 50px;padding-bottom: 60.5%;overflow: hidden; position: relative">' +
        '<img src="' + data.thumb + '" style="position:absolute; height: auto;"></div>' +
        '<div class="item-title">' + data.title + '</div>' +
        '<div class="item-count">' + data.photosCount + '</div>' +
        '</div>' +
        '</div>';

    return albumTemplate;
}

function parsePhoto(data){
    var photoTemplate = '<div class="col-xs-4 gallery-column ' +
        ( data.hidden ? ' photo-hidden " style="display:none' : '' ) + '">' +
        '<div class="gallery-item photo-item">' +
        '<a class="item-anchor" href="' + data.image + '" ' +
        'data-lightbox="page-gallery" ' +
        'data-title="' + data.title + '"></a> ' +
        '<div class="item-cover" style="min-height: 50px;padding-bottom: 60.5%;overflow: hidden; position: relative">' +
        '<div class="icon zoomIcon"></div><div class="bg-overlay"></div> ' +
        '<img src="' + data.thumb + '" style="position:absolute; height: auto;"></div> ' +
        '<div class="hidden description">' + data.title + '</div>' +
        '</div></div>';
    return photoTemplate;
}

function checkPhotoSize(photoSize) {
    var $allowedSizes = [94, 110, 128, 200, 220, 288, 320, 400, 512, 576, 640, 720, 800, 912, 1024, 1152, 1280, 1440, 1600];
    if (settings.photoSize === "auto") {
        var $windowHeight = $(window).height();
        var $windowWidth = $(window).width();
        var $minSize = ($windowHeight > $windowWidth) ? $windowWidth : $windowHeight;
        for (var i = 1; i < $allowedSizes.length; i++) {
            if ($minSize < $allowedSizes[i]) {
                return $allowedSizes[i-1];
            }
        }
    }
    else {
        return photoSize;
    }
}

function parseAlbumURL(id){
    return 'http://picasaweb.google.com/data/feed/api/user/109887510032959700040/albumid/' + id + '?alt=json&imgmax=d&thumbsize=200c,200';
}


var albumsStored = [],
    albumsLoaded = false,
    photoAlbum = [];

function albumIsLoaded(id){
    return (
        typeof photoAlbum[id] != "undefined"
    );
}

function showLayer(layer){
    $('.mount-layer[rel="'+layer+'"]').show().siblings('.mount-layer').hide();
}

function loadAlbums(){

    if( albumsLoaded )
    {
        showLayer('all_allbums');
    }
    else{

        showLayer('loading');

        var settings = {
            username: 'jackierobinsonfoundation',
            offset: 9,
            startOffset: 0
        };

        $(".gallery-container").pwi(settings);

        $('.showMoreAlbums-btn').hide();
    }

}

function loadAlbum(id){

    $('html,body').scrollTop(0);

    if( albumIsLoaded(id) )
    {
        showLayer('single_album');
    }
    else {
        showLayer('loading');

        //console.log( parseAlbumURL(id) );
        loadPicasaAlbum(id);
    }
}


function loadPicasaAlbum(id, limit){
    var c = $('.album-container'),
        title = $('.album-title-t');
    c.empty();

    limit = limit != undefined ? limit : 9;

    $('html,body').scrollTop(0);

    $.getJSON(parseAlbumURL(id), function(data){
        if( typeof data == "object" )
        {
            title.text( data.feed.title.$t );
            //console.log(data);

            var $picsToShow = data.feed.entry;

            if($picsToShow.length < (limit+1))
            {
                $('.showMorePhotos-btn').hide();
            }
            else{
                $('.showMorePhotos-btn').show();
            }

            $.each($picsToShow, function(i, photo){
                var newPhoto = parsePhoto({
                    title: photo.media$group.media$description.$t,
                    thumb: photo.media$group.media$thumbnail[0].url,
                    image: photo.media$group.media$content[0].url,
                    hidden: ( i > (limit-1) )
                });

                c.append(newPhoto);

            });

            showLayer('single_album');

        }else{
            alert('Error occured. The album doesn\'t exists in this Picasa Account');
            showLayer('all_albums');
        }
    });
}



function enableButtons(){
    $('body')
        .on('click', '.showMoreAlbums-btn', function(){
            var $c = $('.gallery-container'),
                items = $c.find('.gallery-column'),
                totalItems = items.length,
                hiddenItems = $c.find('.gallery-column.album-hidden'),
                totalHiddenItems = hiddenItems.length,
                noHiddenItems = items.not('.album-hidden'),
                totalNoHiddenItems = noHiddenItems.length,
                button = $('.showMoreAlbums-btn'),
                i;


            for( i = 0; i < 9; i++ )
            {
                hiddenItems.eq(i).show().removeClass('album-hidden');
            }

            if( totalHiddenItems < 9 )
            {
                button.hide();
            } else {
                button.show();
            }
        }).on('click', '.showMorePhotos-btn', function(){
            var $c = $('.album-container'),
                items = $c.find('.gallery-column'),
                totalItems = items.length,
                hiddenItems = $c.find('.gallery-column.photo-hidden'),
                totalHiddenItems = hiddenItems.length,
                noHiddenItems = items.not('.photo-hidden'),
                totalNoHiddenItems = noHiddenItems.length,
                button = $('.showMorePhotos-btn'),
                i;


            for( i = 0; i < 9; i++ )
            {
                hiddenItems.eq(i).show().removeClass('photo-hidden');
            }

            if( totalHiddenItems < 9 )
            {
                button.hide();
            } else {
                button.show();
            }
        });
}


function startRouting(){
    var routes = {
        '/albums': function(){
           //I will show the albums
           // console.log('show albums');

            loadAlbums(0, 9);

        },
        '/album/:album': function(album){
            //I will show an specific album
            //console.log('show single album', album);

            loadAlbum(album);
        }
    };

    router = Router(routes);



    var $url=window.location.href.split("?", 2);
    if ($url.length == 2) {
        var $queryParams = $url[1].split("&");
        for ($queryParam in $queryParams) {
            var $split = $queryParams[$queryParam].split("=", 2);
            if ($split[0] === "album") {
                window.location = $url[0] + '#/album/' + $split[1];
                found = true;
            }
        }

    }

    if( !found )
    {
        if(typeof window.location.hash != "undefined"&&window.location.hash.length<1){
            //window.location = "#/albums/0/9";
            router.setRoute('/albums');
        }
    }


    router.init();

    enableButtons();
}




$(window).on('load', function(){
    if( isGallery )
    {
        startRouting();
    }
});