/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global firebase, React, React.Component */

//======================================================
//CLASSES

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: {
                name: '',
                photo: ''
            },
            results: []
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.findResults = this.findResults.bind(this);
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
                    photo: user.photoURL
                }
            });
            setTimeout(() => {
                console.log(this.state.user);
            }, 1)
        }).catch(error => {
            console.log(error);
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

                        let item = document.createElement("tr");
                        title = tracks[i].name;
                        artist = tracks[i].artists[0].name;
                        album = tracks[i].album.name;

                        if (tracks[i].album.images.length !== 0) {
                            cover = tracks[i].album.images[0].url;
                        }

                        item.innerHTML = `
                                        <td>${title}</td>
                                        <td>${artist}</td>
                                        <td>${album}</td>
                                        <td>YouTube</td>
                                        <td>Spotify</td>
                                        <td><i class="material-icons">favorite_border</i></td>
                                    `;
                        resultTable.push(item);

                    }

                }
                //Artist
                else if (searchType === "artist") {
                    let artists = result.artists.items;

                    for (let i = 0; i < artists.length; i++) {
                        let item = document.createElement("tr");
                        artist = artists[i].name;

                        if (artists[i].images.length !== 0) {
                            cover = artists[i].images[0].url;
                        }

                        item.innerHTML = `
                                        <td><img class="coverPic" src="${cover}" alt="cover"/></td>
                                        <td>${artist}</td>
                                        <td></td>
                                        <td>YouTube</td>
                                        <td>Spotify</td>
                                    `;
                        resultTable.push(item);
                    }


                }
                //Album
                else if (searchType === "album") {
                    let albums = result.albums.items;

                    for (let i = 0; i < albums.length; i++) {
                        let item = document.createElement("tr");
                        artist = albums[i].artists[0].name;
                        album = albums[i].name;

                        if (albums[i].images.length !== 0) {
                            cover = albums[i].images[0].url;
                        }

                        item.innerHTML = `

                                        <td><img class="coverPic" src="${cover}" alt="cover"/></td>
                                        <td>${artist}</td>
                                        <td>${album}</td>
                                        <td>YouTube</td>
                                        <td>Spotify</td>
                                    `;

                        resultTable.push(item);
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
                    userName={this.state.user.name}
                    userPicture={this.state.user.photo}
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
                        <div className="suggestions">
                            <ul>
                                <li>Resultat 1</li>
                                <li>Resultat 2</li>
                                <li>Resultat 3</li>
                                <li>Resultat 4</li>
                                <li>Resultat 5</li>
                            </ul>
                        </div>
                    </div>
                    {/* <!-- Boxen som visas när man har sökt -->*/}
                    <div className="results-container">
                        <div className="row">
                            <div className="col-xs-offset-3 col-lg-6 col-md-6 col-xs-12 search">
                                <div id="searchResults" className="search-results">
                                    {/*SEARCH RESULTS*/}
                                    <SearchResults results={this.state.results}/>
                                    <div className="quote">
                                        <h3>Random quote from Artist</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut
                                            labore et dolore magna aliqua.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-xs-6 bio">
                                <div className="biography">
                                    <h3>Artist</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor
                                        incididunt ut
                                        labore
                                        et dolore magna aliqua.
                                        <br/><br/>
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip
                                        ex ea commodo
                                        consequat.</p>
                                    <img src="./rescources/lastfm_black_small.gif" alt="lastFM"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//END APP


class SearchResults extends React.Component {
    render() {
        let results = this.props.results;
        let tableBody = document.getElementById("tableBody");

        if (tableBody !== null) {
            tableBody.textContent = "";
        }

        for (let i = 0; i < results.length; i++) {
            tableBody.appendChild(results[i]);
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

                    </tbody>

                </table>
            </div>
        );
    }
}


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
        } else {
            return (
                <header className="header">
                    <img src="./rescources/logo.png" alt="MusicSearch" className="logo"/>
                    {/*<!-- Boxen som visas när man är inloggad -->*/}
                    <div className="log-in-container">
                        <div className="user-box">
                            <img src={this.props.userPicture} alt="userPicture" className="profile-picture"/>
                            <h4>{this.props.userName}</h4>
                            <hr className="divider"/>
                            <span className="favorites"><i
                                className="material-icons">favorite_border</i>Favorites</span>
                            <span className="log-out" id="log-out">Log out</span>
                        </div>
                    </div>
                    {/*<!----------------------------------->
                     <!-- Favoriter -->*/}
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
                    {/*<!----------------------------------->*/}
                </header>
            );
        }
    }
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