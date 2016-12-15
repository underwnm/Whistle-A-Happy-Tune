$(document).ready(function() {
    topSongs();
    
    $('button').click(function(){
        let userSearch = $('#search-word').val();
        doSearch(userSearch);
    });

    $('#search-word').bind("enterKey", function(){
        let userSearch = $('#search-word').val();
        doSearch(userSearch);
    });

    $('#search-word').keyup(function(e){
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

    function topSongs(){
        let itunesAPI = "https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=50/json?callback-?";
        resetPage();
        $.getJSON(itunesAPI, function(data){
            $.each(data.feed.entry, function(index, result){
                let searchArtwork = result["im:image"][2].label.replace('170x170','600x600');
                let searchArtist = result["im:artist"].label;
                let searchTrackName = result["im:name"].label;
                let searchAlbum = result["im:collection"]["im:name"].label;
                let searchPreview = result.link[1].attributes.href;                
                if (searchArtwork) {
                    buildHtml(index, searchArtwork, searchArtist, searchTrackName, searchAlbum, searchPreview);
                }
            });
            delayResults();
        });
    }

    function doSearch(userSearch){
        let itunesAPI = 'https://itunes.apple.com/search?media=music&entity=musicTrack&sort=recent&callback=?&term=';
        resetPage();
        $.getJSON(itunesAPI + userSearch, function(data){
            if (data.results.length === 0) {
                $('#music-container').append('<li>No matches for ' + userSearch + '. Try another search.</li>');
            } else {
                $.each(data.results, function(index, result){
                    let searchArtwork = result.artworkUrl100.replace('100x100','600x600');
                    let searchArtist = result.artistName;
                    let searchTrackName = result.trackName;
                    let searchAlbum = result.collectionName;
                    let searchPreview = result.previewUrl;
                    if (searchArtwork) {
                        buildHtml(index, searchArtwork, searchArtist, searchTrackName, searchAlbum, searchPreview);
                    }
                });
            }
        });
    }

    function buildHtml(index, searchArtwork, searchArtist, searchTrackName, searchAlbum, searchPreview) {
        let html = '<div class="music-img"><img src="' + searchArtwork + '"></div>\n';
        html +='<audio controls> <source src="' + searchPreview + '"></audio>\n';
        html += '<div class="music-title"><span class="music-artist">' + searchArtist + '</span><br />' + searchTrackName + '<br />'  + searchAlbum + '</div>\n';
        let allHtml = $('<li id="' + index + '" class="results col-lg-2 col-md-2 col-sm-3 col-xs-6">' + html + '</li>');
        $('#music-container').append(allHtml);
    }

    function resetPage() {
        $('#music-container').empty();
    }
});