var mysql = require('mysql'),
    app = require('http').createServer(handleRequest),
    fs = require('fs');
var io = require('socket.io').listen(app);

var PokeArray = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew"];

var connection = mysql.createConnection({
    user: "Pagels",
    password: "373pagel093",
    host: '50.83.244.38',
    port: 1338,
    database: "Pagels"
});

app.listen(3000, function () {
    console.log('Listening on port 3000.');
});

function handleRequest(request, response){
    var theUrl = 'HomePage.html';
    switch(request.url){
        case '/':
            theUrl = 'HomePage.html';
            break;
        case '/Pokedex':
            theUrl = 'MainPage.html'
            break;
    }
    fs.readFile(theUrl, function(err, page) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(page);
        response.end();
    });
}


io.sockets.on('connection', function (socket){
    update(socket);
    socket.on('doDatabaseStuff', function(){
        var pokeID = 1;
        PokeArray.forEach(function(pokemon){
            var theUrl = 'http://bulbapedia.bulbagarden.net/wiki/' + pokemon + '(Pok%C3%A9mon)';
            $.ajax({
                url : theUrl,
                success : function(result){
                    console.log(result);
                }
            });
        });
    });

    socket.on('getPicture', function(id){
        console.log('id')
        var label = connection.query('SELECT imgUrl, dexDat FROM pokemon WHERE id=' + id);
        var theUrl;
        var theDat;
        label.on('error', function(err){
            console.log('error:', err);
        });

        label.on('result', function(result){
            theUrl = result.imgUrl;
            theDat = result.dexDat;
            console.log(theUrl);
        });

        label.on('end', function(result){
            socket.emit('setPicture', theUrl, theDat);
            //callback();
        });
    })
});

function update(socket){
    var retPokemon = new Array();
    var retIds = new Array()
    var label = connection.query('SELECT id, name FROM pokemon');

    label.on('error', function(err){
        console.log('error:', err);
    });

    label.on('result', function(result){
        retPokemon.push(result.name);
        retIds.push(result.id);
    });

    label.on('end', function(result){
        socket.emit('updateDropDown', retPokemon, retIds);
        //callback();
    });

}
