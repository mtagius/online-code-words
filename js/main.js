var token = 0;
var codeMaster = false;
var code = "";

function drawBoard() {
    $.getJSON("data/board.json?nocache="+new Date(), function(json) {
        var board = json;
        var htmlBoard = "<table><tr>";
        if(code != board.code) {
            codeMaster = false;
        }
        for(var i = 0; i < board.main.length; i++) {
            if(codeMaster) {
                if(board.main[i].flipped == "true") {
                    htmlBoard += "<td class='" + board.main[i].status + "'>" + board.main[i].word + "</td>";
                } else {
                    htmlBoard += "<td class='" + board.main[i].status + "' onclick='flipTile(" + i + ")'><span class='not-flipped'>" + board.main[i].word + "</span></td>";
                }
            } else {
                if(board.main[i].flipped == "true") {
                    htmlBoard += "<td class='" + board.main[i].status + "'>" + board.main[i].word + "</td>";
                } else {
                    htmlBoard += "<td class='default'>" + board.main[i].word + "</td>";
                }
            }
            if((i + 1) % 5 == 0) {
                htmlBoard += "</tr><tr>";
            }
        }
        htmlBoard += "</tr></table>";
        $("#mainContainer").html(htmlBoard);
    });
}

function flipTile(tile) {
    $.getJSON("data/board.json?nocache="+new Date(), function(json) {
        var board = json;
        board.main[tile].flipped = "true";

        $.ajax({
            url: "php/updateBoard.php",
            type: "POST",
            data: board,
            success: function(result){
                updateToken();
            }
        });
    });
}

function updateToken() {
    $.getJSON("data/token.json", function(json) {
        json.token = parseInt(json.token) + 1;
        $.ajax({
            url: "php/updateToken.php",
            type: "POST",
            data: json
        });
    });
}

function checkToken() {
    $.getJSON("data/token.json?nocache="+new Date(), function(json) {
        if(token != json.token) {
            token = json.token;
            drawBoard();
        }
    });
}

function showCodeModal() {
    $("#codeModal").modal("show");
    $("#enterCodeMasterCode").on('click touchstart', function() {
        $.getJSON("data/board.json?nocache="+new Date(), function(json) {
            if($("#codeMasterCode").val() == json.code) {
                code = $("#codeMasterCode").val();
                codeMaster = true;
                $("#codeModal").modal("hide");
                drawBoard();
            }
        });
    });
}

$(document).ready(function() {
    drawBoard();
    $("#codeModalButton").on('click touchstart', function() {
        showCodeModal();
    });
    setInterval(function() {
        checkToken();
    }, 1000);
});