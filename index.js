/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global firebase, fetch */

//=======================================================
//GLOBALS
const logInButton = document.getElementById('log-in');
const userContainer = document.getElementById('container');
const searchInput = document.getElementById("main-search");
const radioBtns = document.getElementsByClassName("radio-btn");
const resultTable = document.getElementById("resultTable");
const searchBtn = document.getElementById("searchBtn");

//=======================================================
//MAIN


//=======================================================
//CALLBACKS
searchBtn.addEventListener("click", findResults);

//=======================================================
//FIREBASE


//Login / logout
var provider = new firebase.auth.GithubAuthProvider();

logInButton.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider).then(result => {
        let user = result.user;
        console.log(user);
        userContainer.innerHTML = `<div class="user-box">
                <img src=${user.photoURL} alt="" class="profile-picture">
                <h4>${user.displayName}</h4>
                <hr class="divider">
                <span class="favorites"><i class="material-icons">favorite_border</i>Favorites</span>
                <span class="log-out" id="log-out">Log out</span>
            </div>`;
        document.getElementById('log-out').addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                console.log('Du är utloggad.');
                userContainer.innerHTML = `<button type="button" class="btn" id="log-in">Log in</button>`;
            }).catch(error => {
                console.log(error);
            });
        });
    }).catch(error => {
        console.log(error);
    });
});
//END login/logout

//=======================================================
//FUNCTIONS

//------------------------------------
//SPOTIFY

function findResults(){
    
    
    let searchType;
    let inputValue = "";
    let title = "";
    let artist = "";
    let album = "";
    let cover = "";
    
    //if empty search
    if(searchInput !== ""){
        inputValue = searchInput.value;    
    }
    
    //check for selected radioBtn
    for(let i = 0; i < radioBtns.length; i++){
        if(radioBtns[i].checked === true){
            searchType = radioBtns[i].value;
        }

    }
    
    let url = `https://api.spotify.com/v1/search?q=${inputValue}&type=${searchType}&limit=5`;
    
    fetch(url)
    .then((response)=> {
    	return response.json();
    })
    .then((result)=> {
    	console.log(result);
        
        //Track
        if(searchType === "track"){
            
            let tracks = result.tracks.items;
            
            for(let i = 0; i < tracks.length; i++){
                
                let item = document.createElement("tr");
                title = tracks[i].name;
                artist = tracks[i].artists[0].name;
                album = tracks[i].album.name;
                
                if(tracks[i].album.images.length !== 0){
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
                resultTable.appendChild(item);
                
            }
            
        }
        //Artist
        else if(searchType === "artist"){
            let artists = result.artists.items;
            
            for(let i = 0; i < artists.length; i++){
                let item = document.createElement("tr");
                artist = artists[i].name;
                
                if(artists[i].images.length !== 0){
                    cover = artists[i].images[0].url;    
                }
                
                item.innerHTML = `
                                    <td><img class="coverPic" src="${cover}" alt="cover"/></td>
                                    <td>${artist}</td>
                                    <td>YouTube</td>
                                    <td>Spotify</td>
                                `;
               resultTable.appendChild(item);
            }
        
            
        }
        //Album
        else if(searchType === "album"){
            let albums = result.albums.items;
            
            for(let i = 0; i < albums.length; i++){
                let item = document.createElement("tr");
                artist = albums[i].artists[0].name;
                album = albums[i].name;
                
                if(albums[i].images.length !== 0){
                    cover = albums[i].images[0].url;    
                }
                
                item.innerHTML = `

                                    <td><img class="coverPic" src="${cover}" alt="cover"/></td>
                                    <td>${artist}</td>
                                    <td>${album}</td>
                                    <td>YouTube</td>
                                    <td>Spotify</td>
                                `;
                
                resultTable.appendChild(item);
            }
            
        }
        
        
        inputValue = "";
        
        
    });
    
}



