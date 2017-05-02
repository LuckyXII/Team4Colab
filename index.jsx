/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global firebase, React, React.Component */

//======================================================
//CLASSES

class App extends React.Component{
    constructor(props){
        super(props);
        
        this.state={};
    }
    
    render(){
        return(
       
        <div className="container-fluid">
            <header className="header">
                <img src="./rescources/logo.png" alt="MusicSearch" className="logo"/>
                <div className="log-in-container" id="container">
                    <button type="button" className="btn" id="log-in">Log in</button>
                </div>
                {/*<!-- Boxen som visas när man är inloggad -->*/}
                <div className="log-in-container" >
                    <div className="user-box">
                        <img src="http://placehold.it/50x50" alt="" className="profile-picture"/>
                        <h4>Robert Åhlund</h4>
                        <hr className="divider" />
                        <span className="favorites"><i className="material-icons">favorite_border</i>Favorites</span>
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

                {/*<!-- SEARCH CONTAINER -->*/}
            <div className="search-container">
                <h1>Search for music</h1>
                <form className="radio">
                    <input type="radio" name="type" value="track" id="track" className="radio-btn" />
                    <label htmlFor="track" className="radio-label">Track</label>
                    <input type="radio" name="type" value="album" id="album" className="radio-btn"/>
                    <label htmlFor="album" className="radio-label">Album</label>
                    <input type="radio" name="type" value="artist" id="artist" className="radio-btn"/>
                    <label htmlFor="artist" className="radio-label">Artist</label>
                </form>
                <div className="search-field-container">

                    {/*<!-- SEARCH INPUT -->*/}
                    <input type="text" id="main-search" placeholder="Search"/>
                    <i id="searchBtn" className="material-icons">search</i>
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
            </div>
            {/* <!-- Boxen som visas när man har sökt -->*/}
            <div className="results-container">
                <div className="row">
                    <div className="col-xs-offset-3 col-lg-6 col-md-6 col-xs-12 search">
                        <div id="searchResults" className="search-results">



                            <div className="table-container">
                                <table id="resultTable">
                                    <tbody>
                                        <tr>
                                            <th>Track<i className="material-icons">arrow_drop_down</i></th>
                                            <th>Artist<i className="material-icons">arrow_drop_down</i></th>
                                            <th>Album<i className="material-icons">arrow_drop_down</i></th>
                                        </tr>

                                        <tr>
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                        <tr className="active">
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                        <tr>
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                        <tr>
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                        <tr>
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                        <tr>
                                            <td>Låttitel</td>
                                            <td>Artist</td>
                                            <td>Album</td>
                                            <td>YouTube</td>
                                            <td>Spotify</td>
                                            <td>Lyrics</td>
                                            <td><i className="material-icons">favorite_border</i></td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                            <div className="quote">
                                <h3>Random quote from Artist</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labore et dolore magna aliqua.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-xs-6 bio">
                        <div className="biography">
                            <h3>Artist</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore
                                et dolore magna aliqua.
                                <br/><br/>
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.</p>
                            <img src="./rescources/lastfm_black_small.gif" alt="lastFM"/>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>

        
        );
    }
}


//=======================================================
//GLOBALS
var AppComp = document.getElementById("App");


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