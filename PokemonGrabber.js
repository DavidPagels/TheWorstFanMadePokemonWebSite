'use strict';
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var PokeArray = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew"];

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
        var url = 'http://bulbapedia.bulbagarden.net/wiki/' + pokemon + '_(Pok%C3%A9mon)';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                //var moveloop = setInterval(function (){


                var rightthings = 0;
                //console.log($('[style$="display:none"]'))
                var stat = $('img[alt="' + pokemon + '"]').attr('src')
                console.log(stat)
                connection.query('UPDATE pokemon SET imgUrl="' + stat + '" WHERE id=' + index);

//                    var pattern = /\s([^*\n%]+)%*[\n]*|[*]/;
//                    var other = stat.match(pattern)[1]
                //console.log(stat);
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
    }, 1000)
    if(index == 152)
        window.clearInterval(theLoop);

    //}, 1500);
})

app.listen('3000')
console.log('Magic happens on port 3000');
var exports = module.exports = app;