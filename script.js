var origBoard;
const Player = 'O';
const AI = 'X';
const green = "#90ee90";
const red = "#ff3f5a";
const yellow = "#fffd8d";
const winCombos = [
    [0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame(){
    document.querySelector(".kraj").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, Player);
        if (!CheckTie()) turn(bestSpot(), AI); 
    }
   
}

function turn(squareId, p){
    origBoard[squareId] = p;
    document.getElementById(squareId).innerText = p;
    let gameWon = CheckWin(origBoard, p);
    if (gameWon) gameOver(gameWon);

}

function CheckWin(board, p){
    let plays = board.reduce((a,e,i,) => (e=== p) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let[index,win] of winCombos.entries()){
        if (win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, p: p};
            break;
        };
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor= 
        gameWon.p == Player ? green : red;
    }
    for(var i = 0; i < cells.length; i++)
    {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.p == Player ? "YOU WON!" : "YOU LOST!")
}

function declareWinner(who){
    document.querySelector(".kraj").style.display = "block";
    document.querySelector(".kraj .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return miniMax(origBoard, AI).index;
}

function CheckTie(){
    if (emptySquares().length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = yellow;
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("IT'S A TIE!");
        return true;
    }
    return false;
}

function miniMax(newBoard, p){
    var availableSpots = emptySquares(newBoard);

    if (CheckWin(newBoard, Player)){
        return {score:-10};
    }
    else if (CheckWin(newBoard, AI)) {
        return{score:10};
    }
    else if (availableSpots.length === 0){
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availableSpots.length; i++){
        var move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = p;

        if (p == AI ){
            if (CheckWin(newBoard, AI)) {
                move.score = 10;
                newBoard[availableSpots[i]] = move.index;
                return move;
              }
            var result = miniMax(newBoard, Player);
            move.score = result.score;
        }
        else{
            var result = miniMax(newBoard, AI);
            move.score = result.score;
        }
        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }
    var bestMove;
    if(p === AI){
        var bestScore = -10000;
        for(var i = 0; i< moves.length; i++){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        var bestScore = 10000;
        for(var i = 0; i< moves.length; i++){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}