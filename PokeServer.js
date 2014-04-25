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
            theUrl = 'PokedexPage.html'
            break;
        case '/template':
            theUrl = 'NavBarAndHeader.html'
            break;
        case '/TrainerPage':
            theUrl = 'TrainerPage.html'
            break;
        case '/BattlePage':
            theUrl = 'BattlePage.html'
            break;
        case '/SelectStarter':
            theUrl = 'SelectStarter.html'
            break;
    }
    var cssFile = request.url.match(/\/(.*\.css)/);
    if(/\/(.*\.css)/.test(request.url)){
        console.log(cssFile)
        fs.readFile(cssFile[1], function(err, page) {
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(page);
            response.end();
        });
    }else{
        fs.readFile(theUrl, function(err, page) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(page);
            response.end();
        });
    }
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
        var label = connection.query('SELECT name, imgUrl, dexDat, heightFt, heightIn, weight FROM pokemon WHERE name="' + id + '"');
        var theName;
        var theUrl;
        var theDat;
        var theHeightFt;
        var theHeightIn;
        var theWeight;
        label.on('error', function(err){
            console.log('error:', err);
        });

        label.on('result', function(result){
            theName = result.name;
            theUrl = result.imgUrl;
            theDat = result.dexDat;
            theHeightFt = result.heightFt;
            theHeightIn = result.heightIn;
            theWeight = result.weight;

            console.log(theUrl);
        });

        label.on('end', function(result){
            socket.emit('setPokeData', theName, theUrl, theDat, theHeightFt, theHeightIn, theWeight);
            //callback();
        });
    })

    socket.on('checkTrainers', function(username){
        var retVal
        var numrows = connection.query('SELECT count(username) AS isTaken FROM trainer WHERE username="' + username + '"');

        numrows.on('error', function(err){
            console.log('error:', err);
        });

        numrows.on('result', function(result){
            retVal = result.isTaken
            console.log(result.isTaken + '   asdfsd');
        });

        numrows.on('end', function(result){
            socket.emit('checkResult', retVal);
            //callback();
        });
    })

    socket.on('checkCredentials', function(username, pass){
        var correctPass = false;
        var trainerId;
        var password = connection.query('SELECT trainerID, password FROM trainer WHERE username="' + username + '"')

        password.on('error', function(err){
            console.log('error:', err);
        });

        password.on('result', function(result){
            console.log(result.password)
            console.log(pass)
            correctPass = false;
            if(result.password === pass){
                trainerId = result.trainerID
                correctPass = true;
            }
            console.log(correctPass)
        });

        password.on('end', function(result){
            socket.emit('logIn', correctPass, trainerId);
            //callback();
        });

    })

    socket.on('addUser', function(username, password, name){
        connection.query('INSERT INTO trainer (username, password, name) VALUES("' + username + '", "' + password + '", "' + name + '")');

    })

    socket.on('getTrainerPokemon', function(trainerID){
        var retPokeArray = new Array();
        var getUrls = connection.query('SELECT imgUrl, pokemon.name, trainerPokemon.level, trainerPokemon.curHp, trainerPokemon.maxHp, trainerPokemon.attack, trainerPokemon.defense, trainerPokemon.special, trainerPokemon.speed FROM pokemon JOIN trainerPokemon WHERE pokemon.id = trainerPokemon.generalPokemon AND trainerPokemon.trainerID=' + trainerID);
        getTrainerName(socket, trainerID);

        getUrls.on('error', function(err){
            console.log('error:', err);
        });

        getUrls.on('result', function(result){
            retPokeArray.push([result.imgUrl, result.name, result.level, result.curHp, result.maxHp, result.attack, result.defense, result.special, result.speed]);
            console.log(retPokeArray);
        });

        getUrls.on('end', function(result){
            socket.emit('returnedPokemon', retPokeArray);
            //callback();
        });
    })
    socket.on('heal', function(pokeID){
        connection.query('UPDATE trainerPokemon SET curHp=maxHp WHERE thisPokemon=' + pokeID);
    })
    socket.on('getStarters', function(pokeID){
        retPokeArray = [];
        connection.query('CALL createWildPokemon(' + ((pokeID - 1) * 3 + 1 ) + ', 5)');
        getUniqueID(function(getID){
            console.log(getID);
            var gettingStarter = connection.query('Select wildPokemon.level, wildPokemon.maxHp, wildPokemon.attack, wildPokemon.defense, wildPokemon.special, wildPokemon.speed, pokemon.imgUrl, pokemon.name FROM wildPokemon JOIN pokemon WHERE thisPokemon=' + getID + ' AND pokemon.id=wildPokemon.generalPokemon');

            gettingStarter.on('error', function(err){
                console.log('error:', err);
            });

            gettingStarter.on('result', function(result){
                console.log(result.speed);
                retPokeArray = [pokeID, result.name, result.imgUrl, result.level, result.maxHp, result.attack, result.defense, result.special, result.speed];
            });

            gettingStarter.on('end', function(result){
                socket.emit('setStarters', retPokeArray);
                //callback();
            });
        })
    })
});

function getTrainerName(socket, trainerID){
    var trainerName;
    var trainerN = connection.query('SELECT name FROM trainer WHERE trainerID=' + trainerID)

    trainerN.on('error', function(err){
        console.log("error: " + err)
    });

    trainerN.on('result', function(result){
        trainerName = result.name
    });

    trainerN.on('end', function(result){
        socket.emit('setTitle', trainerName);
    });
}

function update(socket){
   socket.emit('updateDropDown', PokeArray);
}

function getUniqueID(callback){
    var gettingID = connection.query('SELECT LAST_INSERT_ID() AS id');
    var theID
    gettingID.on('error', function(err){
        console.log('error:', err);
    });

    gettingID.on('result', function(result){
        theID = result.id
    });

    gettingID.on('end', function(result){
        console.log(theID)
        callback(theID);
    });
}
