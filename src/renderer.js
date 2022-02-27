const remote = require('electron').remote
const electron = require("electron");
const { app, BrowserWindow } = require('electron');
const path = require('path');;
window.$ = window.jQuery = require('jquery');
var nodeConsole = require('console'); //debug
var myConsole = new nodeConsole.Console(process.stdout, process.stderr); //debug
var fs = require('fs');
const { settings } = require('cluster');
var API=undefined;
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
    $("#restart_label").hide();
    var settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings.json'), 'utf8'));
    scaleWindow(settings.scale);
    $("#zoom-rate").text(settings.scale);
    $("#zoom-slider").val(parseFloat(settings.scale)*10);
    getApi();

});
function fade_loop_label(){
        $("#restart_label").fadeToggle(1200,fade_loop_label);
}
$('#zoom-slider').on('change', function(){
    let val = parseInt($("#zoom-slider").val());
    $("#zoom-slider").val(val);
    $("#zoom-rate").text(val/10);
    settings.scale=val/10;
    saveSettings();
    fade_loop_label();
});  
function saveSettings(){
    fs.writeFile(path.resolve(__dirname, 'settings.json'), JSON.stringify(settings), 'utf8',function(){void(0)});

} 
function scaleWindow(scale){
    
    document.body.style.zoom = scale;


}
function getApi(){
    $.get('https://superauto.pet/api.json', function (data, textStatus, jqXHR) {  // success callback
        API=data;
        createAnimalDatalist(data);
        fillFoodsRow(data);
});
}
function createAnimalDatalist(data){
    let animals=data['pets'];
    for (var animal in animals) {
        $('#animal-list').append("<option value='" +animals[animal]['name'] + "'>");
    }
}
$('#search-animal').on('change', function(){
    let name=$(this).val().toLowerCase();
    name='pet-'+name.replace(" ","-");
    getPetIcon(name);
    getPetStats(name);
    getPetAbilities(name);
});
function isSummoned(name){
    return  API['pets'][name]['tier']=="Summoned";
}
function getPetIcon(name){
    let url='https://raw.githubusercontent.com/bencoveney/super-auto-pets-db/main/docs/assets/'+name+".svg";
    $("#pet-img").attr("src",url);
}
function getPetStats(name){
    let animal_stats=API['pets'][name]['baseAttack']+" ⚔️ "+API['pets'][name]['baseHealth']+" 💖 "+API['pets'][name]['tier']+" 🎲";
    $("#stats-span").text(animal_stats);
}
function getPetAbilities(name){
    let descriptions;
    if (isSummoned(name)) {
        descriptions=["","",""];
        $(".ability-lvl").css("border-bottom", "0px solid var(--darker-orange)");
    }
    else {
        descriptions=[API['pets'][name]['level1Ability']['description'],API['pets'][name]['level2Ability']['description'],API['pets'][name]['level3Ability']['description']];
        $(".ability-lvl").css("border-bottom", "1px solid var(--darker-orange)");
    }
    $(".ability-lvl").each(function(index){
        $(this).text(descriptions[index]);
    });

}
function fillFoodsRow(data){
    let foods=data['foods'];

    for (var food in foods) {
        let tier=(parseInt(foods[food]['tier'])-1);
        if (isNaN(tier)) continue; //if milk -> skip 
        
        let src="https://raw.githubusercontent.com/bencoveney/super-auto-pets-db/main/docs/assets/"+foods[food]['id']+".svg";
        myConsole.log(src);
        $(".foods-row:eq("+tier+")").append('<img width="20" height="20" src='+src+'></img>');

    }
}