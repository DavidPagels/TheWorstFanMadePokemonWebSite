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
        case '/ChooseTeam':
            theUrl = 'ChooseTeam.html'
            break;
    }
    var cssFile = request.url.match(/\/(.*\.css)/);
    var ttfFile = request.url.match(/\/(.*\.TTF)/)
    if(/\/(.*\.css)/.test(request.url)){
        fs.readFile(cssFile[1], function(err, page) {
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(page);
            response.end();
        });
    }
    else if(/\/(.*\.TTF)/.test(request.url)){
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
            correctPass = false;
            if(result.password === pass){
                trainerId = result.trainerID
                correctPass = true;
            }
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
        var getUrls = connection.query('SELECT imgUrl, pokemon.name, trainerPokemon.level, trainerPokemon.curHp, trainerPokemon.maxHp, trainerPokemon.attack, trainerPokemon.defense, trainerPokemon.special, trainerPokemon.speed FROM pokemon JOIN trainerPokemon WHERE trainerPokemon.teamOrder>0 AND pokemon.id = trainerPokemon.generalPokemon AND trainerPokemon.trainerID=' + trainerID + ' ORDER BY teamOrder LIMIT 6');
        getTrainerName(socket, trainerID);

        getUrls.on('error', function(err){
            console.log('error:', err);
        });

        getUrls.on('result', function(result){
            retPokeArray.push([result.imgUrl, result.name, result.level, result.curHp, result.maxHp, result.attack, result.defense, result.special, result.speed]);
        });

        getUrls.on('end', function(result){
            socket.emit('returnedPokemon', retPokeArray);
            //callback();
        });
    })

    socket.on('getAllTrainerPokemon', function(trainerID){
        var retPokeArray = new Array();
        var retPokeArray2 = new Array();
        var getUrls = connection.query('SELECT imgUrl, thisPokemon, teamOrder FROM pokemon JOIN trainerPokemon WHERE pokemon.id = trainerPokemon.generalPokemon AND trainerPokemon.trainerID=' + trainerID + ' ORDER BY teamOrder');
        getTrainerName(socket, trainerID);

        getUrls.on('error', function(err){
            console.log('error:', err);
        });

        getUrls.on('result', function(result){
            if(result.teamOrder ==  -1){
                retPokeArray2.push([result.imgUrl, result.thisPokemon]);
            }else{
                retPokeArray.push([result.imgUrl, result.thisPokemon]);
            }
        });

        getUrls.on('end', function(result){
            socket.emit('returnedPokemon', retPokeArray, retPokeArray2);
            //callback();
        });
    })

    socket.on('healPokemon', function(trainerID){
        connection.query('UPDATE trainerPokemon SET curHp=maxHp WHERE trainerID=' + trainerID);
    })

    socket.on('getStarters', function(pokeID){
        retPokeArray = [];
        connection.query('CALL createWildPokemon(' + ((pokeID - 1) * 3 + 1 ) + ', 5)');
        getUniqueID(function(getID){
            var gettingStarter = connection.query('Select wildPokemon.level, wildPokemon.maxHp, wildPokemon.attack, wildPokemon.defense, wildPokemon.special, wildPokemon.speed, pokemon.imgUrl, pokemon.name FROM wildPokemon JOIN pokemon WHERE thisPokemon=' + getID + ' AND pokemon.id=wildPokemon.generalPokemon');

            gettingStarter.on('error', function(err){
                console.log('error:', err);
            });

            gettingStarter.on('result', function(result){
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

    socket.on('getChallenger', function(tID){
        var wildArr = [];
        var pokemon = Math.random() * 151
        getLevel(tID, function(generatedLvl){
            connection.query('CALL createWildPokemon(' + pokemon + ', ' + generatedLvl + ')')

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
        });
    })

    socket.on('getYourPokemon', function(pID){
        getPokemon(socket, pID);
    })

    socket.on('doDmg', function(AttackingPokemon, ReceivingPokemon, moveID, wOrT){
        var hps = [];
        var retMes;
        connection.query('SET @messages=0');
        connection.query('CALL getDmgW(' + AttackingPokemon + ', ' + ReceivingPokemon + ', ' + moveID + ', ' + wOrT + ', @messages)');
        if(wOrT == 0)
            var newHps = connection.query('SELECT @messages AS retMess, trainerPokemon.curHp, wildPokemon.curHp AS curHp2 FROM trainerPokemon JOIN wildPokemon WHERE trainerPokemon.thisPokemon=' + AttackingPokemon + ' AND wildPokemon.thisPokemon=' + ReceivingPokemon);
        else
            var newHps = connection.query('SELECT @messages AS retMess, trainerPokemon.curHp, wildPokemon.curHp AS curHp2 FROM trainerPokemon JOIN wildPokemon WHERE trainerPokemon.thisPokemon=' + ReceivingPokemon + ' AND wildPokemon.thisPokemon=' + AttackingPokemon);
        newHps.on('error', function(err){
            console.log("error: " + err)
        });

        newHps.on('result', function(result){
            hps[0] = result.curHp;
            hps[1] = result.curHp2;
            retMes= result.retMess
        });

        newHps.on('end', function(result){
            socket.emit('updateHp', hps, retMes);
        });

    })

    socket.on('deletePokemon', function(wPokeID){
        connection.query('DELETE FROM wildPokemon WHERE thisPokemon=' + wPokeID);
    })

    socket.on('winBattleW', function(tPokeID, wPokeID){
        connection.query('CALL winBattleW(' + tPokeID + ', ' + wPokeID + ')')
        connection.query('DELETE FROM wildPokemon WHERE thisPokemon=' + wPokeID);
    })

    socket.on('getTrainerPokemonBattle', function(trainerID){
        var retPKMN = [];
        var getPKMN = connection.query('SELECT name, thisPokemon FROM trainerPokemon JOIN pokemon WHERE teamOrder>0 AND pokemon.id=trainerPokemon.generalPokemon AND trainerID=' + trainerID + ' ORDER BY teamOrder');

        getPKMN.on('error', function(err){
            console.log("error: " + err)
        });

        getPKMN.on('result', function(result){
            retPKMN.push([result.name, result.thisPokemon]);
        });

        getPKMN.on('end', function(result){
            socket.emit('setPKMN', retPKMN);
        });
    })

    socket.on('getYourFirstPokemon', function(tID){
        var firstPokemon;
        var getPKMN = connection.query('SELECT thisPokemon FROM trainerPokemon JOIN pokemon WHERE teamOrder>0 AND pokemon.id=trainerPokemon.generalPokemon AND trainerID=' + tID + ' ORDER BY teamOrder LIMIT 1');

        getPKMN.on('error', function(err){
            console.log("error: " + err)
        });

        getPKMN.on('result', function(result){
            firstPokemon = result.thisPokemon;
        });

        getPKMN.on('end', function(result){
            getPokemon(socket, firstPokemon);
        });
    })

    socket.on('setOrder', function(trainerID, pokeTeam, otherPoke){
        for(var i=0; i<pokeTeam.length;i++){
            connection.query('UPDATE trainerPokemon SET teamOrder=' + (i + 1) + ' WHERE thisPokemon=' + pokeTeam[i]);
        }
        for(var i=0; i<otherPoke.length;i++){
            connection.query('UPDATE trainerPokemon SET teamOrder=' + -1 + ' WHERE thisPokemon=' + otherPoke[i]);
        }
    });
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
        callback(theID);
    });
}

function getLevel(tID, callback){
    var gettingID = connection.query('SELECT level FROM trainerPokemon JOIN pokemon WHERE teamOrder>0 AND pokemon.id=trainerPokemon.generalPokemon AND trainerID=' + tID + ' ORDER BY teamOrder LIMIT 1');
    var theLevel
    gettingID.on('error', function(err){
        console.log('error:', err);
    });

    gettingID.on('result', function(result){
        theLevel = result.level;
    });

    gettingID.on('end', function(result){
        callback(theLevel);
    });
}

function getPokemon(socket, pID){
    var yourArr = []
    var yourPokemon = connection.query('SELECT pokemon.name, pokemon.imgUrl, trainerPokemon.level, trainerPokemon.maxHp,' +
        ' trainerPokemon.curHp, move1, move2, move3, move4, ' +
        '(SELECT name from moves WHERE id=(SELECT move1 FROM trainerPokemon WHERE thisPokemon=' + pID + ')) AS move1N, ' +
        '(SELECT name from moves WHERE id=(SELECT move2 FROM trainerPokemon WHERE thisPokemon=' + pID + ')) AS move2N, ' +
        '(SELECT name from moves WHERE id=(SELECT move3 FROM trainerPokemon WHERE thisPokemon=' + pID + ')) AS move3N, ' +
        '(SELECT name from moves WHERE id=(SELECT move4 FROM trainerPokemon WHERE thisPokemon=' + pID + ')) AS move4N, ' +
        'trainerPokemon.move1PP, trainerPokemon.move2PP, trainerPokemon.move3PP, trainerPokemon.move4PP ' +
        'FROM trainerPokemon JOIN pokemon WHERE trainerPokemon.thisPokemon=' + pID + ' AND pokemon.id=trainerPokemon.generalPokemon')
    yourPokemon.on('error', function(err){
        console.log('error:', err);
    });

    yourPokemon.on('result', function(result){
        yourArr = [result.name, result.imgUrl, result.level, result.maxHp, result.curHp,
            result.move1, result.move2, result.move3, result.move4,
            result.move1N, result.move2N, result.move3N, result.move4N,
            result.move1PP, result.move2PP, result.move3PP, result.move4PP, pID];
    });

    yourPokemon.on('end', function(result){
        socket.emit('returnedYours', yourArr);
        //callback();
    });

}
