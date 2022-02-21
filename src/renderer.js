const remote = require('electron').remote
const electron = require("electron");
const { app, BrowserWindow } = require('electron');
const path = require('path');;
window.$ = window.jQuery = require('jquery');
var nodeConsole = require('console'); //debug
var myConsole = new nodeConsole.Console(process.stdout, process.stderr); //debug
var fs = require('fs');


//const fs = require('fs');
//PAGE ELEMENTS

$("#close").click(function() {
    window.close();

});
$("#animals-btn").click(function() {
    if($("#settings-window").is(":visible")){
        $("#settings-window").hide();
    }
    $("#animals-window").toggle();

});
$("#food-btn").click(function() {
    if($("#settings-window").is(":visible")){
        $("#settings-window").hide();
    }
    $("#food-window").toggle();

});
$("#settings-btn").click(function() {
    if($("#settings-window").is(":visible")){
        $("#settings-window").hide();
    }
    else{
        $("#animals-window").hide();
        $("#food-window").hide();
        $("#settings-window").show();

    }

});

$(document).ready(function(){
    $(".window").hide();
    var settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings.json'), 'utf8'));
    scaleWindow(settings.scale);
});
function scaleWindow(scale){
    
    document.body.style.zoom = scale;


}

