
// NAME: sensibletify
// AUTHOR: Callum Jones
// DESCRIPTION: Improvements to the new Spotify UI

(function sensibletify(){
    if (!Spicetify.Platform || !Spicetify.Platform.LibraryAPI) {
        setTimeout(sensibletify, 200);
        return;
    }

    // remove lazy loading from getAlbums.
    const getAlbums = Spicetify.Platform.LibraryAPI.getAlbums;

    Spicetify.Platform.LibraryAPI.getAlbums = function(e) {
        e.limit = -1;
        e.offset = 0;
        return getAlbums.apply(Spicetify.Platform.LibraryAPI, [e]);
    };

    console.log("[sensibletify] getAlbums lazy load removed");

    // remove lazy loading from getArtists.
    const getArtists = Spicetify.Platform.LibraryAPI.getArtists;

    Spicetify.Platform.LibraryAPI.getArtists = function(e) {
        e.limit = -1;
        e.offset = 0;
        return getArtists.apply(Spicetify.Platform.LibraryAPI, [e]);
    };

    console.log("[sensibletify] getArtists lazy load removed");
})();