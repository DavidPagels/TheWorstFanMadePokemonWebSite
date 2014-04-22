'use strict';
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var PokeArray = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran-f", "nidorina", "nidoqueen", "nidoran-m", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr. mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew"];

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


    var loop = setInterval(function(){
        var pokemon = PokeArray[index];
        var url = 'http://bulbapedia.bulbagarden.net/wiki/' + pokemon + '_(Pok%C3%A9mon)/Generation_I_learnset#By_leveling_up';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                //var moveloop = setInterval(function (){


                var rightthings = 0;
                var stat = $('[style$="display:none"]').each(function ()
                {
                    if(rightthings % 3 == 0)
//                    setTimeout(function(){
                        console.log($(this).first().text())
//                    }, 125)
                    rightthings++;


                })
//                    var pattern = /\s([^*\n%]+)%*[\n]*|[*]/;
//                    var other = stat.match(pattern)[1]
                console.log(stat);
//                    if(other == '—' || other == undefined)
//                        connection.query('UPDATE moves SET accuracy=' + 1337 + ' WHERE id=' + i)
//                    else
//                        connection.query('UPDATE moves SET accuracy=' + other + ' WHERE id=' + i)
//                    i++;
//                    if(i==2)
//                        clearInterval(loop);
                // }, 125)
            }
        })
        index++;
    }, 500)
    index++;
    if(index == 152)
        window.clearInterval(theLoop);

    //}, 1500);
})

app.listen('3000')
console.log('Magic happens on port 3000');
var exports = module.exports = app;