/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global firebase, React, React.Component, fetch, console, ReactDOM */

//======================================================
//CLASSES

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: {
                name: '',
                photo: '',
                uid: ''
            },
            results: [],
            headerAction: '',
            favorites: [],
            originalFavorites: [],
            favoritesFilter: '',
            bioName: "",
            bioSimilar: [],
            bioSummary: "",
            bioImg: ""
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleFavorites = this.handleFavorites.bind(this);
        this.closeFavorites = this.closeFavorites.bind(this);
        this.removeFavorite = this.removeFavorite.bind(this);
        this.filterFavorites = this.filterFavorites.bind(this);
        this.findResults = this.findResults.bind(this);
        this.getArtistBio = this.getArtistBio.bind(this);
        this.getQuotes = this.getQuotes.bind(this);

    }

    handleLogIn() {
        const provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider).then(result => {
            let user = result.user;
            console.log(user);
            this.setState({
                loggedIn: true,
                user: {
                    name: user.displayName,
                    photo: user.photoURL,
                    uid: user.uid
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleLogOut() {
        firebase.auth().signOut().then(() => {
            console.log('Du är utloggad.');
            this.setState({
                loggedIn: false
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleFavorites() {
        console.log('klick');
        this.setState({
            headerAction: 'favorites'
        });

        const database = firebase.database();
        //LÄSA DATA FRÅN DATABASEN
        database.ref('users/' + this.state.user.uid + '/favorites/').on('value', snapshot => {
            let data = snapshot.val();
            let allFavorites = [];
            for (let favorite in data) {
                allFavorites.push({
                    track: data[favorite].track,
                    album: data[favorite].album,
                    artist: data[favorite].artist,
                    youtube: 'YouTube',
                    spotify: 'Spotify',
                    id: favorite
                });
            }
            this.setState({
                favorites: allFavorites,
                originalFavorites: allFavorites
            });
            /*
             setTimeout(() => {
             console.log('state', this.state.favorites);
             this.state.favorites.map(favorite => {
             console.log('map', favorite);
             });
             }, 1);
             */
        });
    }

    closeFavorites() {
        this.setState({
            headerAction: ''
        });
    }
    getArtistBio(e){
        console.log("testbio");
        let artist = e.target.textContent; 
        let url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=b971e5066edbb8974e0bb47164fd33a4&format=json`;
        
        fetch(url)
        .then((response)=> {
        	return response.json();
        })
        .then((result)=> {
        	console.log(result);
            
            let art = result.artist;
            let summary = art.bio.summary;
            let img = art.image.length > 0 ? art.image[0]["#text"] : "";
            let similar = art.similar.artist; 
            let name = art.name;
            let similarNames =[];
            
            for (let x =0; x < similar.length; x++){
                similarNames.push(similar[x].name);
            }
            
            this.setState({
                bioName : name,
                bioImg : img,
                bioSimilar : similarNames,
                bioSummary : summary
            });
        });
            
            
        
    }

    removeFavorite(event) {
        let targetId = event.target.parentNode.parentNode.attributes['data-id'].value;
        console.log(targetId);
        const database = firebase.database();
        database.ref('users/' + this.state.user.uid + '/favorites/' + targetId).set(null);
    }

    filterFavorites(event) {
        this.setState({
            filterFavorites: event.target.value
        });

        let allFavorites = this.state.originalFavorites;
        //console.log(allFavorites);
        let filteredList = [];
        allFavorites.filter(obj => {
            if (obj.track.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ||
                obj.artist.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ||
                obj.album.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                filteredList.push(obj);
            }
        });
        console.log(filteredList);
        this.setState({
            favorites: filteredList
        });
    }

    componentDidMount() {
        
        //find quote
        this.getQuotes();
        
        let _this = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log(user);
                _this.setState({
                    loggedIn: true,
                    user: {
                        name: user.displayName,
                        photo: user.photoURL,
                        uid: user.uid
                    }
                });

                let uid = user.uid;
                const database = firebase.database();

                database.ref('users/' + uid + '/favorites/').push({
                    track: 'Testar1',
                    album: 'Testalbum1',
                    artist: 'Testartist',
                    youtube: 'YouTube',
                    spotify: 'Spotify'
                });
                // ...
            } else {
                // User is signed out.
                // ...
            }
        });
    }
    
    
    //GETQOUTES
    getQuotes(){
        
        let url = `http://quotes.rest/qod.json?category=inspire`;
        
        fetch(url)
        .then((response)=> {
        	return response.json();
        })
        .then((result)=> {
        	console.log(result); 
            
            let quote = result.contents.quotes[0];
            let title = quote.title;
            let author = quote.author;
            let quoteContent = quote.quote;
            
            this.setState({
                quoteTitle:title,
                quoteAuthor:author,
                quote:quoteContent
            });
            
        });
        
    }

    //FINDRESULTS
    findResults() {
        let searchInput = document.getElementById("main-search");
        let searchType;
        let inputValue = "";
        let title = "";
        let artist = "";
        let album = "";
        let cover = "";
        let resultTable = [];

        //if empty search
        if (searchInput !== "") {
            inputValue = searchInput.value;
        }

        //check for selected radioBtn
        for (let i = 0; i < radioBtns.length; i++) {
            if (radioBtns[i].checked === true) {
                searchType = radioBtns[i].value;
            }

        }

        let url = `https://api.spotify.com/v1/search?q=${inputValue}&type=${searchType}&limit=5`;

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log(result);

                //Track
                if (searchType === "track") {

                    let tracks = result.tracks.items;

                    for (let i = 0; i < tracks.length; i++) {
                        title = tracks[i].name;
                        artist = tracks[i].artists[0].name;
                        album = tracks[i].album.name;

                        let obj = {searchType:searchType,track:title,artist:artist,album:album};
                        resultTable.push(obj);

                    }

                }
                //Artist
                else if (searchType === "artist") {
                    let artists = result.artists.items;

                    for (let i = 0; i < artists.length; i++) {
                        artist = artists[i].name;

                        if (artists[i].images.length !== 0) {
                            cover = artists[i].images[0].url;
                        }
                        
                        let obj = {searchType:searchType,cover:cover,artist:artist};
                        resultTable.push(obj);
                    }


                }
                //Album
                else if (searchType === "album") {
                    let albums = result.albums.items;

                    for (let i = 0; i < albums.length; i++) {
                        artist = albums[i].artists[0].name;
                        album = albums[i].name;

                        if (albums[i].images.length !== 0) {
                            cover = albums[i].images[0].url;
                        }
                        let obj = {searchType:searchType,cover:cover,artist:artist,album:album};
                        resultTable.push(obj);
                    }

                }


                inputValue = "";
                searchInput.value = "";

                this.setState({results: resultTable});
            });
    }//END FINDRESULTS

    render() {
        return (
            <div className="container-fluid">
                <Header
                    loginStatus={this.state.loggedIn}
                    handleLogIn={this.handleLogIn}
                    handleLogOut={this.handleLogOut}
                    userName={this.state.user.name}
                    userPicture={this.state.user.photo}
                    handleFavorites={this.handleFavorites}
                    headerAction={this.state.headerAction}
                    closeFavorites={this.closeFavorites}
                    favorites={this.state.favorites}
                    removeFavorite={this.removeFavorite}
                    filterInput={this.filterFavorites}
                />
                {/*<!-- SEARCH CONTAINER -->*/}
                <div className="search-container">
                    <h1>Search for music</h1>
                    <form className="radio">
                        <input type="radio" name="type" value="track" id="track" className="radio-btn"/>
                        <label htmlFor="track" className="radio-label">Track</label>
                        <input type="radio" name="type" value="album" id="album" className="radio-btn"/>
                        <label htmlFor="album" className="radio-label">Album</label>
                        <input type="radio" name="type" value="artist" id="artist" className="radio-btn"/>
                        <label htmlFor="artist" className="radio-label">Artist</label>
                    </form>
                    <div className="search-field-container">
                        {/*<!-- SEARCH INPUT -->*/}
                        <input type="text" id="main-search" placeholder="Search"/>
                        <i onClick={this.findResults} id="searchBtn" className="material-icons">search</i>
                        {/*<!--<button type="button" className="btn">Search</button>-->*/}
                        {/*<div className="suggestions">
                         <ul>
                         <li>Resultat 1</li>
                         <li>Resultat 2</li>
                         <li>Resultat 3</li>
                         <li>Resultat 4</li>
                         <li>Resultat 5</li>
                         </ul>
                         </div>*/}
                    </div>
                    {/* <!-- Boxen som visas när man har sökt -->*/}
                    <div className="results-container">
                        <div className="row">
                            <div className="col-lg-offset-3 col-lg-6 col-md-6 col-md-offset-3 col-xs-12 search">
                                <div id="searchResults" className="search-results">
                                    {/*SEARCH RESULTS*/}
                                    <SearchResults getBio={this.getArtistBio} results={this.state.results}/>
                                    {/*QOUTE OF THE DAY*/}
                                    <Quote title={this.state.quoteTitle} quote={this.state.quote} author={this.state.quoteAuthor} />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-xs-6 bio">
                                 {/*BIOGRAPHY*/}
                                 <Bio similar={this.state.bioSimilar} summary={this.state.bioSummary}  name={this.state.bioName} coverImg={this.state.bioImg}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//END APP

//QUOTES
class Quote extends React.Component{
    render(){
        
        console.log(this.props);        
        return(
            <div className="quote">
                <h3>{this.props.title}.</h3>
                <p>{this.props.quote}</p>
                <h5>By: {this.props.author}</h5>
                  <span className="spanStyle">
                      <img src="https://theysaidso.com/branding/theysaidso.png" height="20" width="20" alt="theysaidso.com"/>
                      <a href="https://theysaidso.com" title="Powered by quotes from theysaidso.com"
                        className="anchorStyle"
                      >theysaidso.com</a>
                  </span>
            </div>
        );
    }
}

//BIOGRAPHY
class Bio extends React.Component {
    render() {
        
        return (
            <div className="biography">
                <img src={this.props.coverImg} alt="cover"/>
                <h2>{this.props.name}</h2>
                <div>
                    <h3>Similar Artists:</h3>
                    <p>{this.props.similar}</p>
                    <h3>Band Biography</h3>
                    <p>{this.props.summary}</p>
                </div>
                <img src="./rescources/lastfm_black_small.gif" alt="lastFM"/>
            </div>
        );
    }
}


//SEARCHRESULTS
class SearchResults extends React.Component {
    render() {
        let results = this.props.results;
        let tableBody = document.getElementById("tableBody");

        if (tableBody !== null) {
            tableBody.textContent = "";
        }

        return (
            <div className="table-container">
                <table id="resultTable">
                    <thead>
                    <tr>
                        <th>Track<i className="material-icons">arrow_drop_down</i></th>
                        <th>Artist<i className="material-icons">arrow_drop_down</i></th>
                        <th>Album<i className="material-icons">arrow_drop_down</i></th>
                    </tr>
                    </thead>
                    <tbody id="tableBody">

                        {
                            this.props.results.map((result, index) => {
                                console.log(result);
                                if(result.searchType === "track"){
                                    return(
                                        <tr key={index}>
                                            <td>{result.track}</td>
                                            <td onClick={this.props.getBio}>{result.artist}</td>
                                            <td>{result.album}</td>
                                            <td>youtube</td>
                                            <td>spotify</td>

                                        </tr>
                                        );
                                }
                                else if(result.searchType === "album"){
                                    return(
                                        <tr key={index}>
                                            <td><img src={result.cover} alt="cover"/></td>
                                            <td onClick={this.props.getBio}>{result.artist}</td>
                                            <td>{result.album}</td>
                                            <td>youtube</td>
                                            <td>spotify</td>
                                        </tr>
                                        );
                                }
                                else if(result.searchType === "artist"){

                                    return(
                                        <tr key={index}>
                                            <td>{result.cover}</td>
                                            <td onClick={this.props.getBio}>{result.artist}</td>
                                            <td></td>
                                            <td>youtube</td>
                                            <td>spotify</td>
                                        </tr>
                                        );
                                }
                            
                            })
                        }
                    </tbody>

                </table>
            </div>
        );
    }
}

//HEADER
class Header extends React.Component {
    render() {
        if (!this.props.loginStatus) {
            return (
                <header className="header">
                    <img src="./rescources/logo.png" alt="MusicSearch" className="logo"/>
                    <div className="log-in-container" id="container">
                        <button type="button" className="btn" id="log-in" onClick={this.props.handleLogIn}>Log in
                        </button>
                    </div>
                </header>
            );
        } else if (this.props.loginStatus) {
            return (
                <header className="header">
                    <img src="./rescources/logo.png" alt="MusicSearch" className="logo"/>
                    {this.props.headerAction !== 'favorites' &&
                    <div className="log-in-container">
                        <div className="user-box">
                            <img src={this.props.userPicture} alt="userPicture" className="profile-picture"/>
                            <h4>{this.props.userName}</h4>
                            <hr className="divider"/>
                            <span className="favorites" onClick={this.props.handleFavorites}><i
                                className="material-icons">favorite_border</i>Favorites</span>
                            <span className="log-out" id="log-out" onClick={this.props.handleLogOut}>Log out</span>
                        </div>
                    </div>
                    }
                    {this.props.headerAction === 'favorites' &&
                    <div className="log-in-container">
                        <div className="user-box">
                            <img src={this.props.userPicture} alt="userPicture" className="profile-picture"/>
                            <h4>{this.props.userName}</h4>
                            <i className="material-icons" onClick={this.props.closeFavorites}>close</i>
                            <hr className="divider"/>
                            <h3>Favorites</h3>
                            <div className="favorite-search-wrap">
                                <input type="text" className="filter-favorites" placeholder="Search"
                                       onChange={this.props.filterInput}/>
                                <i className="material-icons">search</i>
                            </div>
                            {this.props.favorites.length === 0 &&
                            <h3 className="smaller">Du har inga favoriter :(</h3>
                            }
                            {this.props.favorites.length > 0 &&
                            <div className="table-container">
                                <table>
                                    <tbody>
                                    <tr>
                                        <th>Track<i className="material-icons">arrow_drop_down</i></th>
                                        <th>Artist<i className="material-icons">arrow_drop_down</i></th>
                                        <th>Album<i className="material-icons">arrow_drop_down</i></th>
                                    </tr>
                                    {this.props.favorites.map((favorite, index) =>
                                        <tr key={index} data-id={favorite.id}>
                                            <td>{favorite.track}</td>
                                            <td>{favorite.artist}</td>
                                            <td>{favorite.album}</td>
                                            <td>{favorite.youtube}</td>
                                            <td>{favorite.spotify}</td>
                                            <td><i className="material-icons" onClick={this.props.removeFavorite}>favorite</i>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            }
                        </div>
                    </div>
                    }

                </header>
            );
        }
    }

    /*
     {<!----------------------------------->
     <!-- Favoriter -->}
     <div className="log-in-container">
     <div className="user-box">
     <img src="http://placehold.it/50x50" alt="" className="profile-picture"/>
     <h4>Robert Åhlund</h4>
     <i className="material-icons">close</i>
     <hr className="divider"/>
     <h3>Favorites</h3>
     <div className="favorite-search-wrap">
     <input type="text" className="filter-favorites" placeholder="Search"/>
     <i className="material-icons">search</i>
     </div>
     <div className="table-container">
     <table>
     <tbody>
     <tr>
     <th>Track<i className="material-icons">arrow_drop_down</i></th>
     <th>Artist<i className="material-icons">arrow_drop_down</i></th>
     <th>Album<i className="material-icons">arrow_drop_down</i></th>
     </tr>
     <tr className="active">
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     <tr>
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     <tr>
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     <tr>
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     <tr>
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     <tr>
     <td>Låttitel</td>
     <td>Artist</td>
     <td>Album</td>
     <td>YouTube</td>
     <td>Spotify</td>
     <td>Lyrics</td>
     <td><i className="material-icons">favorite</i></td>
     </tr>
     </tbody>
     </table>
     </div>
     </div>
     </div>
     {<!----------------------------------->}
     */
}


//=======================================================
//GLOBALS
var AppComp = document.getElementById("App");
const radioBtns = document.getElementsByClassName("radio-btn");

//=======================================================
//MAIN

ReactDOM.render(<App/>, AppComp);

//=======================================================
//CALLBACKS


//=======================================================
//FIREBASE
/*
 //Login / logout
 var provider = new firebase.auth.GithubAuthProvider();

 logInButton.addEventListener('click', () => {
 firebase.auth().signInWithPopup(provider).then(result => {
 let user = result.user;
 console.log(user);
 console.log(userContainer);
 userContainer.innerHTML = `<div className="user-box">
 <img src=${user.photoURL} alt="" className="profile-picture">
 <h4>${user.displayName}</h4>
 <hr className="divider">
 <span className="favorites"><i className="material-icons">favorite_border</i>Favorites</span>
 <span className="log-out" id="log-out">Log out</span>
 </div>`;
 document.getElementById('log-out').addEventListener('click', () => {
 firebase.auth().signOut().then(() => {
 console.log('Du är utloggad.');
 userContainer.innerHTML = `<button type="button" className="btn" id="log-in">Log in</button>`;
 }).catch(error => {
 console.log(error);
 });
 });
 }).catch(error => {
 console.log(error);
 });
 });
 //END login/logout
 */
//=======================================================
//FUNCTIONS