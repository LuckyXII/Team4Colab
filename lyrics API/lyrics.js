/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global fetch*/

//=======================================================
//GLOBALS
var list = document.getElementById("list");

//=======================================================
//MAIN
getLyrics();
//=======================================================
//CALLBACKS

//=======================================================
//FUNCTIONS

function getLyrics(){
    let lyricsBtn = document.getElementsByClassName("lyricsBtn");
    
    for(let i = 0; i < lyricsBtn.length; i++){
        lyricsBtn[i].addEventListener("click", (e)=>{
            let row = e.target.parentNode.parentNode;
            let song = row.children[0].textContent;
            let artist = row.children[1].textContent;
            let album = row.children[2].textContent;
            //${song}${artist}${album}
            
            let url = `http://api.musixmatch.com/ws/1.1/tracking.url.get?domain=https:https://luckyxii.github.io&apikey=cb1a9fa1ee061d28c825353a2d43c7c2&format=json`;
            
            fetch(url)
            .then((response)=> {
            	return response.json();
            })
            .then((json)=> {  // objekt
            	console.log(`response ${json}`);
            });
            
            
            
        });
        
    }
}