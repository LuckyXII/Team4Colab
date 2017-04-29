/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global fetch*/

//=======================================================
//GLOBALS
var searchBtn = document.getElementById("searchBtn");
var list = document.getElementById("list");
var radioBtns = document.getElementsByClassName("radio");
var input = document.getElementById("searchInput");
var artistBio = document.getElementById("artistBio");


//=======================================================
//MAIN




//=======================================================
//CALLBACKS
searchBtn.addEventListener("click", findResult);
//=======================================================
//FUNCTIONS

function getArtistBio(e){
    
    
    
    let elm;
    if(e.target !== this){
        
        if(e.target.class === "table listItem"){
            elm = e.target.parentNode;
        }
        else if(e.target.class === "tableRow listItem"){
            elm = e.target.parentNode.parentNode;
        }else{
            elm = e.target.parentNode.parentNode.parentNode;
        }
        
    }else{
        elm = e.target.children[0];
    }
    
    
    let artist = elm.children[0].children[0].children[1].textContent;
    let bioImg = document.getElementById("bioCover");
    let bioInfo = document.getElementById("bioInfo");
    let bioTitle = document.getElementById("bioTitle");
    
    let url = `http://ws.audioscrobbler.com/2.0/?api_key=b971e5066edbb8974e0bb47164fd33a4&method=artist.getinfo&artist=${artist}&format=json`;
    
    fetch(url)
    .then((response)=> {
    	return response.json();
    })
    .then((result)=> {
    	console.log(result);
        
        let art = result.artist;
        let bio = art.bio.summary;
        let cover = art.image[0]["#text"];
        let name = art.name;
        let similar = art.similar.artist;
        
        let similarArtists ="";
        for(let i = 0; i < similar.length; i++){
            similarArtists+=similar[i].name;
        }
        
        bioTitle.textContent = name;
        bioImg.src = cover;
        bioInfo.children[1].textContent = similarArtists;
        bioInfo.children[3].innerHTML = bio;
        
    });
    
    artistBio.style.display = "flex";
    
}

function findResult(){
    
    list.textContent = "";
    
    let searchType;
    let inputValue = "";
    let title = "";
    let artist = "";
    let album = "";
    let cover = "";
    
    if(input !== ""){
        inputValue = input.value;    
    }
    
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
    .then((result)=> {  // objekt
        console.log(result);
        
        if(searchType === "track"){
            
            let tracks = result.tracks.items;
            
            for(let i = 0; i < tracks.length; i++){
                
                let item = document.createElement("li");
                item.class="list";
                
                title = tracks[i].name;
                artist = tracks[i].artists[0].name;
                album = tracks[i].album.name;
                
                if(tracks[i].album.images.length !== 0){
                    cover = tracks[i].album.images[0].url;    
                }
                
                
               item.innerHTML = `<div class="table listItem">
                                    <div class="tableRow listItem">
                                        <img class="listItem cover" src=${cover} 
                                        <div class="tableCell song listItem">${title}</div>
                                        <div class="tableCell artist listItem">${artist}</div>
                                        <div class="tableCell album listItem">${album}</div>
                                    </div>
                                </div>`;
                list.appendChild(item);
                
                
                item.addEventListener("click",getArtistBio);
                
            }
        }
        else if(searchType === "artist"){
            
            let artists = result.artists.items;
            
            for(let i = 0; i < artists.length; i++){
                let item = document.createElement("li");
                item.class="list";
                artist = artists[i].name;
                
                
                if(artists[i].images.length !== 0){
                    cover = artists[i].images[0].url;    
                }
            
                item.innerHTML = `<div class="table listItem">
                                    <div class="tableRow listItem">
                                        <img class="listItem cover" src=${cover} alt="cover"/>
                                        <div class="tableCell artist listItem">${artist}</div>

                                    </div>
                                </div>`; 
                list.appendChild(item);
                item.addEventListener("click",getArtistBio);
            }
            
            
        }
        else if(searchType === "album"){
            
            let albums = result.albums.items;
            
            for(let i = 0; i < albums.length; i++){
                let item = document.createElement("li");
                item.class="list";
                artist = albums[i].artists[0].name;
                album = albums[i].name;
                
                if(albums[i].images.length !== 0){
                    cover = albums[i].images[0].url;    
                }
                
                
                item.innerHTML = `<div class="table listItem">
                                    <div class="tableRow listItem">
                                        <img class="listItem cover" src=${cover} alt="cover"/>
                                        <div class="tableCell artist listItem">${artist}</div>
                                        <div class="tableCell album listItem">${album}</div>
                                    </div>
                                </div>`; 
                
                list.appendChild(item);
                item.addEventListener("click",getArtistBio);
            }
        }
        
        
        inputValue = "";
    });
        
}

