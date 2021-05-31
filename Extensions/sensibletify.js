
// NAME: sensibletify
// AUTHOR: Callum Jones
// DESCRIPTION: Better spotify

// set this to true if you use Spotify Podcasts.
const SHOW_PODCASTS_IN_SIDEBAR = false;

(function sensibletify(){
    let mainMenu = document.querySelector(".main-navBar-entryPoints");

    if (!Spicetify.Platform || !Spicetify.Platform.LibraryAPI || !mainMenu) {
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

    const activeClass = "main-navBar-navBarLinkActive";
    const sensibletifyClass = "main-navBar-navBarLink-sensibletify";

    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains(sensibletifyClass)) {
            document.querySelectorAll("." + sensibletifyClass).forEach((elem) => {
                elem.classList.remove(activeClass);
            });
        }
    });

    let addToMenu = function(name, icon, clickHandler, selected = false) {
        const li = document.createElement("li");
        li.classList.add("main-navBar-navBarItem");

        const anchor = document.createElement("a");
        anchor.classList.add("link-subtle", "main-navBar-navBarLink", sensibletifyClass);
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            clickHandler(e);

            document.querySelectorAll(".main-navBar-navBarLink").forEach((elem) => {
                elem.classList.remove(activeClass);
            });

            anchor.classList.add(activeClass);

            return false;
        });

        if (selected) {
            anchor.classList.add(activeClass);
        }

        anchor.setAttribute("href", "#");

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("icon");
        iconWrapper.setAttribute("style", "margin-top: 8px;");

        const svg = document.createElement("template");
        svg.innerHTML='<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">' + icon + '</svg>';

        iconWrapper.appendChild(svg.content.firstChild);

        anchor.appendChild(iconWrapper);

        const span = document.createElement("span");
        span.classList.add("ellipsis-one-line", "main-type-mestoBold");
        span.setAttribute("as", "span");
        span.appendChild(document.createTextNode(name));
        anchor.appendChild(span);

        li.appendChild(anchor);
        mainMenu.appendChild(li);
    };

    Spicetify.Platform.UserAPI.getUser().then((user) => {
        const lastVisitedLocation = Spicetify.LocalStorage.get(user.username + ":lastVisitedLocation");

        addToMenu("Albums", Spicetify.SVGIcons["album"], (e) => {
            document.querySelector("a[href='/collection']").click();
            document.querySelector("a[href='/collection/albums']").click();
        }, lastVisitedLocation === "/collection/albums");
        addToMenu("Artists", Spicetify.SVGIcons["artist"], (e) => {
            document.querySelector("a[href='/collection']").click();
            document.querySelector("a[href='/collection/artists']").click();
        }, lastVisitedLocation === "/collection/artists");
        addToMenu("Playlists", Spicetify.SVGIcons["playlist"], (e) => {
            document.querySelector("a[href='/collection']").click();
            document.querySelector("a[href='/collection/playlists']").click();
        }, lastVisitedLocation === "/collection/playlists");

        if (SHOW_PODCASTS_IN_SIDEBAR) {
            addToMenu("Podcasts", Spicetify.SVGIcons["podcasts"], (e) => {
                document.querySelector("a[href='/collection']").click();
                document.querySelector("a[href='/collection/podcasts']").click();
            }, lastVisitedLocation === "/collection/podcasts");
        }

        // remove library link
        document.querySelector("a[href='/collection']").parentElement.parentElement.style.display = "none";


        console.log("[sensibletify] improved collection navigation.");
    });
})();