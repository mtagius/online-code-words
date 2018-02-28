var codeMaster = true;
var token = 0;

function drawBoard() {
    $.getJSON("../data/board.json?nocache="+new Date(), function(json) {
        var board = json;
        var htmlBoard = "<table><tr>";
        for(var i = 0; i < board.main.length; i++) {
            if(codeMaster) {
                if(board.main[i].flipped == "true") {
                    htmlBoard += "<td class='" + board.main[i].status + "'>" + board.main[i].word + "</td>";
                } else {
                    htmlBoard += "<td class='" + board.main[i].status + " not-flipped' onclick='flipTile(" + i + ")'>" + board.main[i].word + "</td>";
                }
            } else {
                if(board.main[i].flipped == "true") {
                    htmlBoard += "<td class='" + board.main[i].status + "'>" + board.main[i].word + "</td>";
                } else {
                    htmlBoard += "<td class='default'>" + board.main[i].word + "</td>";
                }
            }
            if(((i + 1) % 5 == 0) && (i + 1 != 25)) {
                htmlBoard += "</tr><tr>";
            }
        }
        htmlBoard += "</tr></table>";
        $("#codeMasterCode").html("Game Code: " + board.code);
        $("#mainContainer").html(htmlBoard);
    });
}

function flipTile(tile) {
    $.getJSON("../data/board.json?nocache="+new Date(), function(json) {
        var board = json;
        board.main[tile].flipped = "true";

        $.ajax({
            url: "../php/updateBoard.php",
            type: "POST",
            data: board,
            success: function(result){
                updateToken();
            }
        });
    });
}

function updateToken() {
    $.getJSON("../data/token.json", function(json) {
        json.token = parseInt(json.token) + 1;
        $.ajax({
            url: "../php/updateToken.php",
            type: "POST",
            data: json
        });
    });
}

function checkToken() {
    $.getJSON("../data/token.json?nocache="+new Date(), function(json) {
        if(token != json.token) {
            token = json.token;
            drawBoard();
        }
    });
}

function generateBoard() {
    var alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";
    var code = "";
    for(var i = 0; i < 5; i++) {
        code += alphabet[ Math.floor(Math.random() * alphabet.length)];
    }

    var newBoard = {"main": [], "code":code};

    var words = [];

    if($("#codeMaster").prop('checked') == true) {
        codeMaster = true;
    } else {
        codeMaster = false;
    }

    $.ajax({
        url: "../php/generateWords.php",
        type: "GET",
        data: {},
        success: function(result){
            words = result;

            words = words.replace(/\\n/g, "");
            words = words.replace(/\[/g, "");
            words = words.replace(/\]/g, "");
            words = words.replace(/\"/g, "");
            words = words.split(",");
            
            for(var i = 0; i < 25; i++) {
                newBoard.main.push({"word": words[i], "status":"civ", "flipped":"false"});
            }

            if($("#whichTeamStarts").prop('checked') == true) {
                var blueTiles = 9;
                var redTiles = 8;
            } else {
                var blueTiles = 8;
                var redTiles = 9;
            }

            for(var i = 0; i < blueTiles; i++) {
                do {
                tile = Math.floor(Math.random() * newBoard.main.length);
                } while(newBoard.main[tile].status != "civ");
                newBoard.main[tile].status = "blue";
            }

            for(var i = 0; i < redTiles; i++) {
                do {
                tile = Math.floor(Math.random() * newBoard.main.length);
                } while(newBoard.main[tile].status != "civ");
                newBoard.main[tile].status = "red";
            }

            do {
                tile = Math.floor(Math.random() * newBoard.main.length);
            } while(newBoard.main[tile].status != "civ");
            newBoard.main[tile].status = "ass";

            $.ajax({
                url: "../php/updateBoard.php",
                type: "POST",
                data: newBoard,
                success: function(result){
                    drawBoard();
                }
            });
            updateToken();
        },
    });        
}

$(document).ready(function() {
    drawBoard();
    $("#generateBoard").on('click touchstart', function() {
        generateBoard();
    });
    setInterval(function() {
        checkToken();
    }, 1000);
});