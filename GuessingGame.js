//--------------- GENERATE WINNING NUMBER ---------------//

function generateWinningNumber(){
  return Math.floor(Math.random() * 100 + 1);
}

//--------------- SHUFFLED ARRAY ---------------//

function shuffle(arr){
  let length = arr.length,
      selectedVal,
      removedFromBack;
  while(length){
    selectedVal = Math.floor(Math.random() * length--);
    removedFromBack = arr[length];
    arr[length] = arr[selectedVal];
    arr[selectedVal] = removedFromBack;
  }
  return arr;
}

//--------------- GAME CLASS ---------------//

function Game(playersGuess){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  
}

//--------------- GAME CLASS METHODS ---------------//

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  // return this.playersGuess < this.winningNumber ? true : false;
  if(this.playersGuess > this.winningNumber){
    return 'Guess Lower';
  }
  return 'Guess Higher';
}

Game.prototype.playersGuessSubmission = function(num){
  // this.playersGuess = num;
  if(typeof num === 'number' && num >= 1 && num <= 100){
    this.playersGuess = num;
  } else {
    throw 'That is an invalid guess.'
  }
  return this.checkGuess();
}

Game.prototype.checkGuess = function(){
  // WINNING GUESS
  
  if(this.playersGuess === this.winningNumber){
    $('#title').text('YOU WON!!!!');
    $('#subtitle').text('Click Reset to play again!');
    $('#submit, #hint, #player-input').prop('disabled',true);    
  }
  // NOT WINNING GUESS
  else {
    if(this.pastGuesses.indexOf(this.playersGuess) >= 0){
      return $('#subtitle').text('You have already guessed that number.');
      
    } 
    else {
      this.pastGuesses.push(this.playersGuess);
      $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    }
    // GAME OVER
    if(this.pastGuesses.length === 5){
      $('#title').text('YOU LOSE. It was ' + this.winningNumber);
      $('#subtitle').text('Click Reset to play again!');
      $('#submit, #hint, #player-input').prop('disabled',true);
     }
    // HINTS
    else {
      if(this.difference() < 5){$('#subtitle').text('You\'re burning up! ' + this.isLower())}
      else if(this.difference() < 15){$('#subtitle').text('You\'re lukewarm. ' + this.isLower())}
      else if(this.difference() < 25){$('#subtitle').text('You\'re a bit chilly. ' + this.isLower())}
      else {$('#subtitle').text('You\'re ice cold! ' + this.isLower())}
    }
  }
}

function newGame(){
  return new Game;
}

Game.prototype.provideHint = function(){
  let hintArr = [];
  hintArr.push(this.winningNumber,generateWinningNumber(),generateWinningNumber());
  return shuffle(hintArr);
}

//--------------- JQUERY EVENT HANDLERS ---------------//

function playersGuess(game){
  let guess = $('#player-input').val();
  $('#player-input').val('');
  let response = game.playersGuessSubmission(parseInt(guess));
  console.log(response);
}

$(document).ready(function() {
  let game = new Game();
  $('#submit, #hint, #player-input').prop('disabled',false);  

  $('#submit').click(function(e) {
    playersGuess(game);
  })

  $('#player-input').keypress(function(event){
    if(event.which == 13){
      playersGuess(game);
    }
  })

  $('#hint').click(function(){
    let hints = game.provideHint();
    $('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
  })
  
  $('#reset').click(function(){
    game = newGame();
    $('#title').text('GUESSING GAME');
    $('#subtitle').text('Pick any number between 1 and 100');
    $('.guess').text('-');
    $('#submit, #hint, #player-input').prop('disabled',false);
  })

})