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
        case '/ContentOrigin':
            theUrl = 'ContentOrigin.html'
            break;
        case '/footer':
            theUrl = 'Footer.html'
            break;
        case '/Battle':
            theUrl = 'Battle.html'
            break
    }
    console.log(request.url)
    var cssFile = request.url.match(/\/(.*\.css)/);
    var ttfFile = request.url.match(/\/(.*\.TTF)/)
    if(/\/(.*\.css)/.test(request.url)){
        console.log(cssFile)
        fs.readFile(cssFile[1], function(err, page) {
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(page);
            response.end();
        });
    }
    else if(/\/(.*\.TTF)/.test(request.url)){
        console.log(ttfFile)
        fs.readFile(ttfFile[1], function(err, page) {
            response.writeHead(200, {'Content-Type': 'application/octet-stream'});
            response.write(page);
            response.end();
        });
    }
    else{
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
                retPokeArray = [getID, result.name, result.imgUrl, result.level, result.maxHp, result.attack, result.defense, result.special, result.speed];
            });

            gettingStarter.on('end', function(result){
                socket.emit('setStarters', retPokeArray);
                //callback();
            });
        })
    })

    socket.on('transferPokemon', function(tID, wID){
        connection.query('CALL transferPokemon(' + tID + ', ' + wID + ')');
    })

    socket.on('getChallenger', function(){
        var wildArr = [];
        var pokemon = Math.random() * 151
        connection.query('CALL createWildPokemon(' + pokemon + ', 5)')
        getUniqueID(function(wID){
            var wildPokemon = connection.query('SELECT pokemon.name, pokemon.imgUrl, wildPokemon.level, wildPokemon.maxHp, ' +
                'wildPokemon.curHp, move1, move2, move3, move4, move1PP, move2PP, move3PP, move4PP, ' +
                '(SELECT name FROM moves JOIN wildPokemon WHERE wildPokemon.move1=moves.id AND wildPokemon.thisPokemon='+ wID + ') AS move1N, ' +
                '(SELECT name FROM moves JOIN wildPokemon WHERE wildPokemon.move2=moves.id AND wildPokemon.thisPokemon='+ wID + ') AS move2N, ' +
                '(SELECT name FROM moves JOIN wildPokemon WHERE wildPokemon.move3=moves.id AND wildPokemon.thisPokemon='+ wID + ') AS move3N, ' +
                '(SELECT name FROM moves JOIN wildPokemon WHERE wildPokemon.move4=moves.id AND wildPokemon.thisPokemon='+ wID + ') AS move4N ' +
                'FROM wildPokemon JOIN pokemon WHERE wildPokemon.thisPokemon=' + wID + ' AND pokemon.id=(SELECT generalPokemon from wildPokemon WHERE thisPokemon=' + wID + ')')
            wildPokemon.on('error', function(err){
                console.log('error:', err);
            });

            wildPokemon.on('result', function(result){
                wildArr = [wID, result.name, result.imgUrl, result.level, result.maxHp, result.curHp,
                    result.move1, result.move2, result.move3, result.move4,
                    result.move1N, result.move2N, result.move3N, result.move4N,
                    result.move1PP, result.move2PP, result.move3PP, result.move4PP];
            });

            wildPokemon.on('end', function(result){
                socket.emit('returnedWild', wildArr);
                //callback();
            });
        });
    })
    socket.on('getYourPokemon', function(tID){
        var yourArr = []
        var yourPokemon = connection.query('SELECT pokemon.name, pokemon.imgUrl, trainerPokemon.level, trainerPokemon.maxHp,' +
            ' trainerPokemon.curHp, move1, move2, move3, move4, (SELECT name from moves JOIN trainerPokemon where trainerPokemon.move1=moves.id AND' +
            ' trainerPokemon.trainerID=' + tID + ') AS move1N, (SELECT name from moves JOIN trainerPokemon where ' +
            'trainerPokemon.move2=moves.id AND trainerPokemon.trainerID=' + tID + ') AS move2N, (SELECT name from moves' +
            ' JOIN trainerPokemon where trainerPokemon.move3=moves.id AND trainerPokemon.trainerID=' + tID + ') AS move3N, ' +
            '(SELECT name from moves JOIN trainerPokemon where trainerPokemon.move4=moves.id AND trainerPokemon.trainerID=' +
            tID + ') AS move4N, trainerPokemon.move1PP, trainerPokemon.move2PP, trainerPokemon.move3PP, trainerPokemon.move4PP, ' +
            'trainerPokemon.thisPokemon FROM trainerPokemon JOIN pokemon WHERE trainerPokemon.thisPokemon=(SELECT thisPokemon FROM trainerPokemon WHERE ' +
            'trainerID=' + tID + ' LIMIT 1) AND pokemon.id=trainerPokemon.generalPokemon')
        yourPokemon.on('error', function(err){
            console.log('error:', err);
        });

        yourPokemon.on('result', function(result){
            console.log(result.imgUrl)
            yourArr = [result.name, result.imgUrl, result.level, result.maxHp, result.curHp,
                result.move1, result.move2, result.move3, result.move4,
                result.move1N, result.move2N, result.move3N, result.move4N,
                result.move1PP, result.move2PP, result.move3PP, result.move4PP, result.thisPokemon];
        });

        yourPokemon.on('end', function(result){
            socket.emit('returnedYours', yourArr);
            //callback();
        });
    })
    socket.on('doDmg', function(AttackingPokemon, ReceivingPokemon, moveID, wOrT){
        var hps = [];
        connection.query('CALL getDmgW(' + AttackingPokemon + ', ' + ReceivingPokemon + ', ' + moveID + ', ' + wOrT + ')');
        if(wOrT == 0)
            var newHps = connection.query('SELECT trainerPokemon.curHp, wildPokemon.curHp AS curHp2 FROM trainerPokemon JOIN wildPokemon WHERE trainerPokemon.thisPokemon=' + AttackingPokemon + ' AND wildPokemon.thisPokemon=' + ReceivingPokemon);
        else
            var newHps = connection.query('SELECT trainerPokemon.curHp, wildPokemon.curHp AS curHp2 FROM trainerPokemon JOIN wildPokemon WHERE trainerPokemon.thisPokemon=' + ReceivingPokemon + ' AND wildPokemon.thisPokemon=' + AttackingPokemon);
        newHps.on('error', function(err){
            console.log("error: " + err)
        });

        newHps.on('result', function(result){
            hps[0] = result.curHp;
            hps[1] = result.curHp2;
        });

        newHps.on('end', function(result){
            socket.emit('updateHp', hps);
        });

    })

    socket.on('deletePokemon', function(wPokeID){
        connection.query('DELETE FROM wildPokemon WHERE thisPokemon=' + wPokeID);
    })

    socket.on('winBattleW', function(tPokeID, wPokeID){
        connection.query('CALL winBattleW(' + tPokeID + ', ' + wPokeID + ')')
        connection.query('DELETE FROM wildPokemon WHERE thisPokemon=' + wPokeID);
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
