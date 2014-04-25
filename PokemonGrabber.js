'use strict';
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var movesArr = Array();

var PokeArray = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran♀", "nidorina", "nidoqueen", "nidoran♂", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetch%27d", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr._Mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew"];

var connection = mysql.createConnection({
    user: "Pagels",
    password: "373pagel093",
    host: '50.83.244.38',
    port: 1338,
    database: "Pagels"
});

app.get('/', function(req, res){

    console.log('in scrape')
    var index = 0;
    //var theLoop = setInterval(function(){

    var overallIndex = 1;
    var loop = setInterval(function(){
        var pokemon = PokeArray[index];
        var url = 'http://bulbapedia.bulbagarden.net/wiki/' + pokemon + '_(Pok%C3%A9mon)/Generation_I_learnset#By_leveling_up';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                //var moveloop = setInterval(function (){


                var rightthings = 0;
                //console.log($('[style$="display:none"]'))
                var stat = $('[style$="border-collapse:collapse;"]').children().children('[style$="background:#FFFFFF; border:1px solid #D8D8D8;"]').each(function ()
               {
                   var other = $(this).children('a').first().text()
                   //console.log(other);
                   if(other == 'Y'){
                       console.log(index + 1);
                   }
//                    if((rightthings + 4) % 5 == 0){
                })
                index++;
                if(index == 152){
                    doneLoop()
                    clearInterval(theLoop);
                }
            }
            //}, 1500);
        })
    }, 750)

})

function doneLoop(){
    for(var i=1; i < 152; i++){
        movesArr[i].forEach(function(level){ console.log(i + " " + level)})
    }
}

app.listen('3000')
console.log('Magic happens on port 3000');
var exports = module.exports = app;