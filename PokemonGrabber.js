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
    var theLoop = setInterval(function(){
        var pokemon = PokeArray[index];
        var url = 'http://pokemondb.net/pokedex/' + pokemon;

        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);

                $('.vitals-table').first().filter(function(){
                    var data = $(this);
                    data.children().children().eq(1).children().eq(1).children().each(function()
                    {
                        console.log($(this).text())
                        connection.query('INSERT INTO pokeTypes (pokeId, typeId) VALUES ((Select id from pokemon where name = "' + pokemon + '"), (select id from types where type = "' + $(this).text() + '"))');
                    });
                   // var pattern = /(.*) lbs/;
                    //catchRate = catchRate.text().match(pattern)
                    //var feet = catchRate;
                    //console.log(pokemon + " " + type);
//                    connection.query('INSERT INTO pokeTypes (pokeId, typeId) VALUES ((Select id from pokemon where name = ' + name + '), (select id from types where type = ' + type + '))');
                })

            }
        })
        index++;
        if(index == 152)
            window.clearInterval(theLoop);

    }, 1500);
})

app.listen('3000')
console.log('Magic happens on port 3000');
var exports = module.exports = app;