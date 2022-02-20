const remote = require('electron').remote
var nodeConsole = require('console'); //debug
const { app } = require('electron');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr); //debug
const path = require('path');
//const fs = require('fs');
//PAGE ELEMENTS
var close_btn= document.getElementById("close");
close_btn.addEventListener('click', function(e) {
    window.close();
});
