// Addapted from
//...
// Color Blast!
// License MIT
// © 2014 Nate Wiley
//...

(function (window) {

  /*
   *  ================================================================================
   *  GAME CONFIGURATION
   *  This section constructs the game.
   *  You can set the background colour and other game variables here.
   *  ================================================================================
   */
  var Game = {
    init: function () {
      this.canvas = document.getElementById("paddle");
      this.canvas.width = this.canvas.width;
      this.canvas.height = this.canvas.height;
      this.ctx = this.canvas.getContext("2d");
      this.color = "rgba(20,20,20,.7)";
      this.binding();
      this.player = new Player();
      console.log("create ball");
      this.ball = new Ball();
      console.log("done");
      this.score = 0;
      this.gameIsOver = false;
      this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

      // Begin game render loop.
      this.loop();
    },

    // Setup listeners to control the game.
    binding: function() {
      window.addEventListener("keydown", this.buttonDown);
      window.addEventListener("keyup", this.buttonUp);
      window.addEventListener("keypress", this.keyPressed);
      // add listener to the context of the canvas.
      this.canvas.addEventListener("click", this.clicked);
    },

    // When player press spacebar, restart the game.
    keyPressed: function(e) {
      e.preventDefault();
      if (e.keyCode === 32) {
        if (Game.gameIsOver) {
          Game.init();
        }
      }
    },

    // If player release left or right keys, stop player from moving in that direction.
    buttonUp: function(e) {
      e.preventDefault();
      if (e.keyCode === 37 || e.keyCode === 65) {
        Game.player.movingLeft = false;
      }
      if (e.keyCode === 39 || e.keyCode === 68) {
        Game.player.movingRight = false;
      }
    },

    //If player press left, move left indefinitly.
    // If player press right, move right indefinitly.
    buttonDown: function(e) {
      if (e.keyCode === 37 || e.keyCode === 65) {
        Game.player.movingLeft = true;
      }
      if (e.keyCode === 39 || e.keyCode === 68) {
        Game.player.movingRight = true;
      }
    },

    // Random number generator.
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    // Check if paddle hits ball.
    // Using the x and y coordinates on the canvas.
    hit: function(paddle, ball) {
      var coll = false;
      if ( ((ball.y + ball.radius) > (paddle.y)) &&
           ((ball.x + ball.radius) > (paddle.x)) &&
           ((ball.x) < (paddle.x  + paddle.width)) ){
        coll = true;
        Game.score += 10;
      }
      return coll;
    },

    // Clear the canvas by painting it white, up to the width and height specified in the configuration.
    clear: function() {
      this.ctx.fillStyle = Game.color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // When the game is over. Clear the game canvas. Display game over message along with the high score.
    gameOver: function() {
      this.gameIsOver = true;
      this.clear();
      var message = "Game Over";
      var message2 = "Score: " + Game.score;
      var message3 = "Click or press Spacebar to Play Again";
      this.ctx.fillStyle = "white";
      this.ctx.font = "bold 20px Lato, sans-serif";
      this.ctx.fillText(message, this.canvas.width /2, this.canvas.height / 2 - 50);
      this.ctx.fillText(message2, this.canvas.width / 2, this.canvas.height / 2 );
      this.ctx.fillText(message3, this.canvas.width / 2, this.canvas.height / 2 + 50);
      delete this.ball;
      delete this.player;
    },

    // Every game frame redraw the game score and the player's life.
    updateScore: function() {
      this.ctx.fillStyle = "white";
      this.ctx.font = "16px Lato, sans-serif";
      this.ctx.fillText("Score: " + this.score, 8, 20);
    },

    // Main game loop that draws multiple balls and the player on the canvas.
    loop: function() {
      if (Game.gameIsOver) {
        Game.gameOver;
      } else {
        // Clear the canvas.
        Game.clear();
        // Draw & update ball.
        Game.ball.draw();
        Game.ball.update();
        // Every frame update the player's position, score and change to the next frame.
        // At the end of the loop.
        Game.player.draw();
        Game.player.update();
        Game.updateScore();
        Game.requestAnimationFrame.call(window, Game.loop);
      }
    }

  }; // END OF GAME CONFIGURATION

  /*
   *  ================================================================================
   *  PLAYER CONFIGURATION
   *  ================================================================================
   */
  var Player = function() {
    this.width = 60;
    this.height = 10;
    this.x = Game.canvas.width / 2 - this.width / 2;
    this.y = Game.canvas.height - this.height;
    this.movingLeft = false;
    this.movingRight = false;
    this.speed = 10;
    this.color = "white";
  };

  // Draws the player on the canvas by drawing and painting the player white.
  Player.prototype.draw = function() {
    Game.ctx.fillStyle = this.color;
    Game.ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  // Updates the player location.
  Player.prototype.update = function() {
    if (this.movingLeft && this.x > 0) {
      this.x -= this.speed;
    }
    if (this.movingRight && this.x + this.width < Game.canvas.width) {
      this.x += this.speed;
    }
  };// END OF PLAYER CONFIGURATION

  /*
   *  ================================================================================
   *  BALL CONFIGURATION
   *  ================================================================================
   */
  var Ball = function() {
    this.radius = 10;
    this.startAngle = 0;
    this.endAngle = 360;
    this.anticlockwise = true;
    this.x = Game.canvas.width / 2 - this.radius / 2;
    this.y = Game.random(10, 40);
    this.vy = Game.random(1, 3) * .1;
    this.rightwardsSpeed = 1;
    this.downwardsSpeed = 2;
    this.color = "hsl(" + Game.random(0, 360) + ", 60%, 50%)";
    this.hitHeight = Game.canvas.height - Game.player.height;
  };

  // Draw the ball on the canvas.
  Ball.prototype.draw = function() {
    Game.ctx.fillStyle = this.color;
    Game.ctx.fillRect(this.x, this.y, this.radius, this.radius);
  };

  // Update the ball location on the canvas.
  // bounces on left, right and upper limits.
  // Checks if it had collided with the player
  // If so bounce
  Ball.prototype.update = function() {
    if (this.rightwardsSpeed < 0) {
      if (this.x > 0) {
        this.x += this.rightwardsSpeed;
      } else {
        this.hBounce();
      }
    } else if (this.rightwardsSpeed > 0){
      if (this.x + this.radius < Game.canvas.width) {
        this.x += this.rightwardsSpeed;
      } else {
        this.hBounce();
      }
    }

    if (this.downwardsSpeed > 0) {
        this.y += this.downwardsSpeed;
    } else if(this.downwardsSpeed < 0) {
      if (this.y > 0) {
        this.y += this.downwardsSpeed;
      } else {
        this.vBounce();
      }
    }

    if (Game.hit( Game.player, this)) {
      this.vBounce();
    }

    //check if ball is off botom of the screen
    if (this.y + this.downwardsSpeed > this.hitHeight) {
      Game.gameOver();
    }

  };


  // on hBounce negate the rightwards speed
  Ball.prototype.hBounce = function() {
    this.rightwardsSpeed = this.rightwardsSpeed*-1;
    this.x += this.rightwardsSpeed;
  }

// on vBounce negate the downwardswards speed
  Ball.prototype.vBounce = function() {
    this.downwardsSpeed = this.downwardsSpeed*-1;
    this.y += this.downwardsSpeed;
  }

  // Begin the game.
  Game.init();

}(window));
