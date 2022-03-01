const path = require('path');
window.$ = window.jQuery = require('jquery');
var nodeConsole = require('console'); //debug
var myConsole = new nodeConsole.Console(process.stdout, process.stderr); //debug
var fs = require('fs');
var API=undefined;
var settings=undefined;
const Statistics = require('statistics.js/statistics.js');
var data = [];
var columns = {};
var settings = {};
var stats = new Statistics(data, columns, settings);
$("#close").click(function() {
    window.close();

});
$("#animals-btn").add($("#food-btn")).add($("#settings-btn")).click(function(){
    let win;
    
    if ($(this).val()=="Animals") win=$("#animals-window");
    else if ($(this).val()=="Food") win=$("#food-window");
    else win=$("#settings-window");
    if($(win).is(":visible")){
        $(win).hide();
    }
    else{
        $(".window").hide();
        $(win).show();
    }

});

$("#calc-btn-animal").click(function(){
    toggleCards();
});
function toggleCards(){
    if($("#abilities").is(":visible")){
        $("#abilities").hide();
        $("#calculate-card").show();
        $("#calc-btn-animal").children('i').removeClass('fa-arrow-circle-right').addClass('fa-arrow-circle-left');

    }
    else{
        $("#calc-btn-animal").children('i').removeClass('fa-arrow-circle-left').addClass('fa-arrow-circle-right');
        $("#abilities").show();
        $("#calculate-card").hide();
    }
}
$(document).ready(function(){
    $(".window").hide();
    $("#restart_label").hide();
    toggleCards();
    settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings.json'), 'utf8'));
    scaleWindow(settings.scale);
    highlightPack(settings.pack);
    $("#zoom-rate").text(settings.scale);
    $("#zoom-slider").val(parseFloat(settings.scale)*10);
    getApi();

});
function highlightPack(pack_name){
    
    if (pack_name=="ExpansionPack1"){
        $(".pack").css("background-color","var(--bright-orange)");
        $(".pack").children().css("background-color","var(--bright-orange)");
        $("#pack-expansion1").css("background-color","var(--pinky)");
        $("#pack-expansion1").children().css("background-color","var(--pinky)");
    }
    else{
        $(".pack").css("background-color","var(--bright-orange)");
        $(".pack").children().css("background-color","var(--bright-orange)");
        $("#pack-standard").css("background-color","var(--pinky)");
        $("#pack-standard").children().css("background-color","var(--pinky)");

    }
}
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
        createAnimalDatalist();
        fillFoodsRow(data);
});
}
function createAnimalDatalist(){
    let animals=API['pets'];
    $('#animal-list').empty();
    for (var animal in animals) {
        if(animals[animal]['packs']['0']==settings.pack || animals[animal]['packs']['1']==settings.pack){
            $('#animal-list').append("<option value='" +animals[animal]['name'] + "'>");
        }
    }
}
$('#search-animal').on('change', function(){
    $("#selected-animal").text($(this).val());
    let name=$(this).val().toLowerCase();
    name='pet-'+name.replace(" ","-");
    let animals=API['pets'];
    if(!animals.hasOwnProperty(name)) { $("#pet-img").css('filter','opacity(0)');return;}
    if(!(animals[name]['packs']['0']==settings.pack || animals[name]['packs']['1']==settings.pack)){ $("#pet-img").css('filter','opacity(0)');return;}
    $("#pet-img").css('filter','');
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
    let descriptions=[];
    if (isSummoned(name)) {
        descriptions=["","",""];
        $(".ability-lvl").css("border-bottom", "0px solid var(--darker-orange)");
    }
    else {
        //this is for animals that have lvl 1 and 2 abilities but not at lvl 3 (example: fish)
        if(API['pets'][name].hasOwnProperty('level1Ability'))descriptions.push(API['pets'][name]['level1Ability']['description']);
        else descriptions.push("");
        if(API['pets'][name].hasOwnProperty('level2Ability'))descriptions.push(API['pets'][name]['level2Ability']['description']);
        else descriptions.push("");
        if(API['pets'][name].hasOwnProperty('level3Ability'))descriptions.push(API['pets'][name]['level3Ability']['description']);
        else descriptions.push("");

        //descriptions=[API['pets'][name]['level1Ability']['description'],API['pets'][name]['level2Ability']['description'],API['pets'][name]['level3Ability']['description']];
        //$(".ability-lvl").css("border-bottom", "1px solid var(--darker-orange)");
    }
    $(".ability-lvl").each(function(index){
        if(descriptions[index].length>1)
            $(this).css("border-bottom", "1px solid var(--darker-orange)");
        else
            $(this).css("border-bottom", "0px solid var(--darker-orange)");
        $(this).text(descriptions[index]);
    });

}
function fillFoodsRow(data){
    let foods=data['foods'];

    for (var food in foods) {
        let tier=(parseInt(foods[food]['tier'])-1);
        if (isNaN(tier)) continue; //if milk -> skip 
        
        let src="https://raw.githubusercontent.com/bencoveney/super-auto-pets-db/main/docs/assets/"+foods[food]['id']+".svg";
        $(".foods-row:eq("+tier+")").append('<img width="20" height="20" src='+src+'></img>');

    }
}
$(".pack").click(function(){

    if ($(this).attr('id')=="pack-expansion1"){
        highlightPack("ExpansionPack1");
        settings.pack="ExpansionPack1";
    }
    else{
        highlightPack("StandardPack");
        settings.pack="StandardPack";
    }
    saveSettings();
    createAnimalDatalist();
});

$(".calculate-elements").siblings().add('#selected-at-least').add('#pet-img').on('change load',function(){
    updateProbability($("#selected-at-least").val(),$("#selected-animal").text(),$("#selected-gold").val(),$("#selected-turns").val(),$("#selected-animal-slots").val(),$("#selected-slots").val());
});
function updateProbability(at_least,animal,gold,turn,animal_slots,food_slots){
    let name=animal.toLowerCase();
    name='pet-'+name.replace(" ","-");

    food_slots=parseInt(API['turns']['turn-'+turn]['foodShopSlots'])-food_slots;
    animal_slots=parseInt(API['turns']['turn-'+turn]['animalShopSlots'])-animal_slots;

    let probabilityAtTurn=0;
    let probabilities =API['pets'][name]['probabilities'];
    for (var index in probabilities) {
        if(API['pets'][name]['probabilities'][index]['kind']=="shop" && probabilities[index]['turn']==('turn-'+turn))
        {
            probabilityAtTurn=API['pets'][name]['probabilities'][index]['perSlot'][settings.pack];  
        }
    }

    let chocolateAtTurn=0;
    let chocoProbs =API['foods']["food-chocolate"]['probabilities'];
    for (var index in chocoProbs) {
        if(chocoProbs[index]['turn']==('turn-'+turn))
        { 
            chocolateAtTurn=API['foods']["food-chocolate"]['probabilities'][index]['perSlot'][settings.pack];
        }
    }
    let raw_shop = stats.binomialCumulativeDistribution(animal_slots*gold,1- probabilityAtTurn)[animal_slots*gold-at_least];
    let raw_choco = stats.binomialCumulativeDistribution(food_slots*gold,1- chocolateAtTurn)[food_slots*gold-at_least];

    let value_combine=Math.max(0,1-((1-raw_shop)*(1-raw_choco)));
    raw_shop=(raw_shop*100).toFixed(1);
    raw_choco=(raw_choco*100).toFixed(1);
    value_combine=(value_combine*100).toFixed(1);
    if(isNaN(raw_shop)) raw_shop=(0).toFixed(1);
    if(isNaN(raw_choco)) raw_choco=(0).toFixed(1);
    if(isNaN(value_combine)) value_combine=(0).toFixed(1);
    let raw_shop_display='<span>inside shop: <span>'+raw_shop+'%</span></span>';
    let raw_choco_display='<span>using chocolate: <span>'+raw_choco+'%</span></span>';
    let value_combine_display='<span>total: <span>'+value_combine+'%</span></span>';
    $("#probability-lbl").html(raw_shop_display+'<br>'+raw_choco_display+'<br>'+value_combine_display);

}