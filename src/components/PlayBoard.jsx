import React, { Component } from "react";
import Square from "./Square";

class PlayBoard extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      gameType: this.props.gameType,
      playerOneToken: this.props.playerOneToken,
      playerTwoToken: this.props.playerTwoToken,
      computerToken: this.props.computerToken,
      // scores: {
      //   playerOne: 0, 
      //   playerTwo: 0, 
      //   computerPlayer: 0
      // },
      moveBoard: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ],
      winningCombos: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ],
      turn: 'playerOne',
      winningArr: [],
      turnCount: 1
    }
    // this.move = this.move.bind(this);
  }

  move = (id) => {
    // TODO: jan 15 - wait to reset after TIE screen
    const theMoveBoard = this.state.moveBoard;
    let turnCount = this.state.turnCount;
    if (this.state.gameType === '1-player') {
      if (this.state.turn === 'playerOne' && this.isEmpty(id)) {
        theMoveBoard[id] = this.state.playerOneToken;
        !this.win() ? this.setState({ turn: 'computer', turnCount: turnCount += 1 }) : false;
        setTimeout(() => {
          this.computerMove();
        }, 1000);
      } 
    } else {
      if (this.state.turn === 'playerOne' && this.isEmpty(id)) {
        theMoveBoard[id] = this.state.playerOneToken;
        !this.win() ? this.setState({ turn: 'playerTwo', turnCount: turnCount += 1 }) : false;
      } else if(this.state.turn === 'playerTwo' && this.isEmpty(id)) {
        theMoveBoard[id] = this.state.playerTwoToken;
        !this.win() ? this.setState({ turn: 'playerOne', turnCount: turnCount += 1 }) : false;
      }
    }
    this.setState({ moveBoard: theMoveBoard });
    setTimeout(() => {
      
      if (this.win()) {
        console.log('someone won'); 
        // ADD OVERLAY
        // CALL UPDATE SCOREBOARD
  
        this.updateScore();
        // CALL RESET
        setTimeout(() => this.reset(), 1000);
      } else if (this.tie()) {
        console.log('there is a tie');
        // ADD OVERLAY
        // CALL RESET
        this.reset();
      }
    }, 1000);
  }

  // Check if square is available for a move
  isEmpty = (id) => {
    if (this.state.moveBoard[id] === ' ') {
      return true;
    } else {
      return false;
    }
  }
 
  computerMove = () => {
    const arrayToBlock = this.closeToWin();
    let computerIndex;
    const cToken = this.state.computerToken;
    const pToken = this.state.playerOneToken;
    const mBoard = this.state.moveBoard;
    let turnCount = this.state.turnCount;
    // If playerOne is not close to winning
    console.log('array to block', arrayToBlock);
    if (arrayToBlock === undefined) {
      this.state.winningCombos.forEach(wc => {
        let index1 = wc[0];
        let index2 = wc[1];
        let index3 = wc[2];
        // If middle square is unoccupied, claim it first
        if (mBoard[4] === ' ') {
          computerIndex = 4;
          return;
        }
        // If two squares of a winning combo are selected, pick the third
        if (mBoard[index1] === cToken && mBoard[index2] === cToken && mBoard[index3] === ' ' ) {
          computerIndex = index3;
          return;
        } else if (mBoard[index1] === cToken && mBoard[index2] === ' ' && mBoard[index3] === cToken) {
          computerIndex = index2;
          return;
        } else if (mBoard[index1] === ' ' && mBoard[index2] === cToken && mBoard[index3] === cToken) {
          computerIndex = index1;
          return;
        }
        // If one square in a winning combo is selected, pick the adjacent
        if (mBoard[index1] === ' ' && mBoard[index2] === ' ' && mBoard[index3] === cToken) {
          computerIndex = index2;
          return;
        } else if (mBoard[index1] === ' ' && mBoard[index2] === cToken && mBoard[index3] === ' ') {
          computerIndex = index3;
          return;
        } else if (mBoard[index1] === cToken && mBoard[index2] === ' ' && mBoard[index3] === ' ') {
          computerIndex = index2;
          return;
        }
        // If one square in a winning combo is selected by playerOne, pick the adjacent
        if (mBoard[index1] === ' ' && mBoard[index2] === ' ' && mBoard[index3] === pToken) {
          computerIndex = index2;
          return;
        } else if (mBoard[index1] === ' ' && mBoard[index2] === pToken && mBoard[index3] === ' ') {
          computerIndex = index3;
          return;
        } else if (mBoard[index1] === pToken && mBoard[index2] === ' ' && mBoard[index3] === ' ') {
          computerIndex = index2;
          return;
        }
        // If no squares are occupied, pick one
        if (mBoard[index1] === ' ' && mBoard[index2] === ' ' && mBoard[index3] === ' ') {
          computerIndex = index3;
          return;
        }
      });
    } else  {
      // Block playerOne from winning
      arrayToBlock.forEach(i => {
        if (mBoard[i] === ' ') {
          computerIndex = i;
        }
      });
    }
    // Update the moveBoard
    mBoard[computerIndex] = cToken;
    this.setState({ moveBoard: mBoard });

    // Check for a win & tie

    setTimeout(() => {
      if (this.win()) {
        console.log('computer won');
        // TODO ADD OVERLAY
        // TODO CALL UPDATE SCOREBOARD
        // TODO CALL RESET
        this.reset();
      } else if (this.tie()) {
        console.log('there is a tie');
        // ADD OVERLAY
        // CALL RESET
        this.reset();
      } else {
        this.setState({ turn: 'playerOne',  turnCount: turnCount += 1  });
      }
    }, 1000);
  }

  closeToWin = () => {
    let blockCombo;
    const mBoard = this.state.moveBoard;
    // If playerOne occupies two squares in a winning combo return that combo
    this.state.winningCombos.forEach(wc => {
      let counter = 0;
      wc.forEach(i => {
        if (mBoard[i] === this.state.playerOneToken) {
          counter += 1;
        } else if (mBoard[i] === this.state.computerToken) {
          counter -= 1;
        }
      });
      if (counter === 2) {
        blockCombo = wc; 
        return;
      }
    });
    return blockCombo;
  }

  win = () => {
    let win = false;
    const moveBoard = this.state.moveBoard;
    this.state.winningCombos.forEach(wc => {
      const index1 = wc[0];
      const index2 = wc[1];
      const index3 = wc[2];
      if ((moveBoard[index1] === 'X' && moveBoard[index2] === 'X' && moveBoard[index3] === 'X') || 
        (moveBoard[index1] === 'O' && moveBoard[index2] === 'O' && moveBoard[index3] === 'O')) {
        win = true;
        this.setState({ winningArr: wc });
        this.updateScore()
      }
    });
    return win;
  }

  tie = () => {
    if (this.state.turnCount === 9 && !this.win('X') && !this.win('O')) {
      return true;
    } else {
      return false;
    }
  }

  updateScore = () => {
    // UPDATE SCORE HERE
     /*
  - Board is PARENT to Screens & Settings
  - Screens is parallel to Settings
  - Playboard is within Screens
  - Scoreboard is within Settings
  
  - Board holds state of score 
  - Board has a function that sets the state of the score
  - Board passes this function this.setScore to Screens then onSetScore to Playboard as props
    - Playboard will call function onSetThisScore when the score is decided
  - Board also passes the state of the score to Screens, Playboard, Settings & Scoreboard
  PlayBoard => Screens => Board 
  Board => Settings => Scoreboard
  */

    const { onSetScore, scores } = this.props;
    const winner = this.state.turn;
    // Make copy of scores
    const theScores = scores;
    
    if (winner === 'playerOne') {
      theScores.playerOne = theScores.playerOne += 1;
    } else if (winner === 'playerTwo') {
      theScores.playerTwo = theScores.playerTwo += 1;
    } else {
      theScores.computerPlayer = theScores.computerPlayer += 1;
    }
    // Pass updated theScores object to onSetScore
    onSetScore(theScores);
  }

  reset = () => {
    // Reset board, turn, turnCount
    this.setState({ 
      moveBoard: [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
      ],
      turn: 'playerOne',
      turnCount: 1
    }); 
    // REMOVE OVERLAY
  }

  render() {
    const { moveBoard } = this.state;

    return(
      <div className="play-area chalkboard">
        <div id="row-1" className="row bottom-border">
          <div onClick={() => this.move(0)} id="0" className="top-right-border square">
            <Square val={moveBoard[0]} />
          </div>
          <div onClick={() => this.move(1)} id="1" className="top-right-border square">
            <Square val={moveBoard[1]}/>
          </div>
          <div onClick={() => this.move(2)} id="2" className="top-right-corner square">
            <Square val={moveBoard[2]}/>
          </div>
        </div>
        <div id="row-2" className="row bottom-border">
          <div onClick={() => this.move(3)} id="3" className="right-border square">
            <Square val={moveBoard[3]}/>
          </div>
          <div onClick={() => this.move(4)} id="4" className="right-border square">
            <Square val={moveBoard[4]}/>
          </div>
          <div onClick={() => this.move(5)} id="5" className="square">
            <Square val={moveBoard[5]}/>
          </div>
        </div>
        <div id="row-3" className="row">
          <div onClick={() => this.move(6)} id="6" className="bottom-right-border square">
            <Square val={moveBoard[6]}/>
          </div>
          <div onClick={() => this.move(7)} id="7" className="bottom-right-border square">
            <Square val={moveBoard[7]}/>
          </div>
          <div onClick={() => this.move(8)} id="8" className="bottom-right-corner square">
            <Square val={moveBoard[8]}/>
          </div>
        </div>
      </div>
    )
  }
}

export default PlayBoard;

