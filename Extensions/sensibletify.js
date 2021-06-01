
// NAME: sensibletify
// AUTHOR: Callum Jones
// DESCRIPTION: Better spotify

// set this to true if you use Spotify Podcasts.
const SHOW_PODCASTS_IN_SIDEBAR = false;

(function sensibletify(){
    const mainMenu = document.querySelector(".main-navBar-entryPoints");

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
        svg.innerHTML = '<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">' + icon + '</svg>';

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

    const lastVisitedLocation = Spicetify.Platform.History.location.pathname;

    addToMenu("Albums", Spicetify.SVGIcons["album"], (e) => {
        //document.querySelector("a[href='/collection']").click();
        //document.querySelector("a[href='/collection/albums']").click();
        Spicetify.Platform.History.push({pathname: "/collection/albums", search: "", hash: "", state: null});
    }, lastVisitedLocation === "/collection/albums");
    addToMenu("Artists", Spicetify.SVGIcons["artist"], (e) => {
        Spicetify.Platform.History.push({pathname: "/collection/artists", search: "", hash: "", state: null});
    }, lastVisitedLocation === "/collection/artists");
    addToMenu("Playlists", Spicetify.SVGIcons["playlist"], (e) => {
        Spicetify.Platform.History.push({pathname: "/collection/playlists", search: "", hash: "", state: null});
    }, lastVisitedLocation === "/collection/playlists");

    if (SHOW_PODCASTS_IN_SIDEBAR) {
        addToMenu("Podcasts", Spicetify.SVGIcons["podcasts"], (e) => {
            Spicetify.Platform.History.push({pathname: "/collection/podcasts", search: "", hash: "", state: null});
        }, lastVisitedLocation === "/collection/podcasts");
    }

    // remove library link
    document.querySelector("a[href='/collection']").parentElement.parentElement.style.display = "none";

    console.log("[sensibletify] improved collection navigation.");

    // add search css
    const searchCSSURL = "https://xpui.app.spotify.com/xpui-routes-search.css";
    addCSS(searchCSSURL);

    let addSearchBar = (path) => {
        const topBarContentWrapper = document.querySelector(".main-topBar-topbarContentWrapper");

        if (!topBarContentWrapper) {
            return;
        }

        const className = "sensibletify-search";
        const searchInput = document.querySelector("."+className);

        if (path === "/search") {
            console.log("[sensibletify] on search page, removing our search input");
            let ourSearch = document.querySelector(".sensibletify-search");

            if (ourSearch) {
                ourSearch.remove();
            }

            return;
        }

        if (searchInput) {
            return;
        }

        const searchTemplate = `<div class="main-topBar-topbarContent sensibletify-search"><div class="x-searchInput-searchInput"><form role="search"><input class="x-searchInput-searchInputInput main-type-mesto" maxlength="80" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Artists, songs, or podcasts" data-testid="search-input" value=""></form><div class="x-searchInput-searchInputIconContainer"><span class="x-searchInput-searchInputSearchIcon"><svg height="24" role="img" width="24" viewBox="0 0 512 512" class="x-searchInput-searchInputIcon" aria-hidden="true"><path d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z" fill="currentColor"></path></svg></span></div></div></div>`;

        const searchBar = document.createElement("template");
        searchBar.innerHTML = searchTemplate;
        searchBar.content.firstChild.addEventListener("click", () => {
            Spicetify.Platform.History.push({pathname: "/search", search: "", hash: "", state: null});

            function focusOnSearch() {
                const searchInput = document.querySelector(".x-searchInput-searchInputInput:not(.sensibletify-search)");

                if (!searchInput) {
                    setTimeout(focusOnSearch, 100);
                    return
                }

                searchInput.focus();
            }

            focusOnSearch();
        });

        topBarContentWrapper.appendChild(searchBar.content.firstChild);
    }

    addSearchBar(lastVisitedLocation);

    // hook navigation
    const pushHistory = Spicetify.Platform.History.push;

    Spicetify.Platform.History.push = function(e, t) {
        addSearchBar(e.pathname);

        return pushHistory.apply(Spicetify.Platform.History, [e, t]);
    };

    console.log("[sensibletify] added search back everywhere");
})();

function addCSS(fileName) {
    let head = document.head;
    let link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;

    head.appendChild(link);
}
