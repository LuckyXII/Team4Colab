/*jshint esnext: true, moz: true*/
/*jslint browser:true */
/*global fetch */

//=======================================================
//GLOBALS
var searchBtn = document.getElementById("searchBtn");
var list = document.getElementById("list");
var radioBtns = document.getElementsByClassName("radio");
var input = document.getElementById("searchInput");


//=======================================================
//MAIN

//=======================================================
//CALLBACKS
searchBtn.addEventListener("click", findResult);
//=======================================================
//FUNCTIONS

function findResult(){
    let val = input.value;
    let url = `http://ws.audioscrobbler.com/2.0/?api_key=b971e5066edbb8974e0bb47164fd33a4&method=artist.getinfo&artist=${val}&format=json`;
    
    fetch(url)
    .then((response)=> {
    	return response.json();
    })
    .then((json)=> {
    	console.log(json);
    });
    
}