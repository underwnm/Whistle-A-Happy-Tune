var userSearch;
var totalPages;
var currentPage;
var resultsPerPage = 24;
$(document).ready(function() {


    topSongs();

    $('#search-button').click(function(){
        currentPage = 1;
        userSearch = $('#search-word').val();
        doSearch(userSearch, currentPage, resultsPerPage);
    });

    $('#search-word').bind("enterKey", function(){
        currentPage = 1;
        userSearch = $('#search-word').val();
        doSearch(userSearch, currentPage, resultsPerPage);
    });

    $('#search-word').keyup(function(e){
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

    $('#previous-button').click(function(){
        if (currentPage > 1) {
            currentPage--;
            doSearch(userSearch, currentPage, resultsPerPage);
        }
    });

    $('#next-button').click(function(){
        if (currentPage < totalPages){
            currentPage++;
            doSearch(userSearch, currentPage, resultsPerPage);
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

    function doSearch(userSearch, myPage, resultsPerPage){
        let itunesAPI = 'https://itunes.apple.com/search?media=music&entity=musicTrack&sort=recent&callback=?&term=';
        resetPage();
        $.getJSON(itunesAPI + userSearch, function(data){
            if (data.results.length === 0) {
                $('#music-container').append('<li>No matches for ' + userSearch + '. Try another search.</li>');
            } else {
                let results = pagination(data.results, myPage, resultsPerPage);
                $.each(results, function(index, result){
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
            delayResults();
            toggleButtons();
        });
    }

    function pagination(results, currentPage, resultsPerPage){
        let startingIndex = (currentPage-1) * resultsPerPage;
        let endingIndex = ((startingIndex + resultsPerPage) > results.length) ? results.length : (startingIndex + resultsPerPage);
        var pageItems = [];
        totalPages = numberOfPages(results, resultsPerPage);
        for (let i = startingIndex; i < endingIndex; i++){
            pageItems.push(results[i]);
        }
        return pageItems;
    }
    function buildHtml(index, searchArtwork, searchArtist, searchTrackName, searchAlbum, searchPreview) {
        let html = '<div class="music-img"><img src="' + searchArtwork + '"></div>\n';
        html +='<audio controls> <source src="' + searchPreview + '"></audio>\n';
        html += '<div class="music-title"><span class="music-artist">' + searchArtist + '</span><br />' + searchTrackName + '<br />'  + searchAlbum + '</div>\n';
        let allHtml = $('<li id="' + index + '"class="results col-lg-2 col-md-2 col-sm-3 col-xs-6">' + html + '</li>');
        $('#music-container').append(allHtml);
    }

    function toggleButtons(){
        $('#previous-button').show();
        $('#next-button').show();
    }

    function delayResults() {
        $(function() {
            $('.results').each(function(index) {
                $(this).delay(index * 190).fadeTo(1000, 1);
            });
        });
        $('.footer').show();
    }

    function numberOfPages(object, resultsPerPage){
        return Math.ceil(object.length / resultsPerPage);
    }

    function resetPage() {
        $('#music-container').empty();
        $('#previous-button').hide();
        $('#next-button').hide();
        $('.footer').hide();
    }
});