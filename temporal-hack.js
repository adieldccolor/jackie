var _request, hack;

//simulate a $_GET/REQUEST vars from url
_request = function( a ) {
    var index, items, result, tmp, i, len;
    result = null;
    tmp = [];
    items = location.search.substr(1).split("&");
    for (i = 0, len = items.length; i < len; i++) {
        index = items[i];
        tmp = index.split("=");
        if (tmp[0] === a) {
            result = decodeURIComponent(tmp[1]);
        }
    }
    return result;
};


hack = function(){
    if( _request("p") != null && _request('p').length > 0 )
    {


    } else{

        //homepage
        if( _request("p") == null ){
            //if jquery is present, do it with jquery
            if (typeof jQuery != 'undefined') {

                var shortApp = $(".mav-plug").length>0;
                if(shortApp){
                    $('.btn.btn-default[href*="docs/1003new.pdf"], ' +
                        '.btn.btn-default[href*="default.aspx?s=TEMP_AAA&p=applynow.ascx&type=full"]').remove();
                }

            }
        }

    }


}

function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
r(hack);