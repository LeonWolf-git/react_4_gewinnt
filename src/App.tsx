import * as React from "react";
import "./App.css";

enum Player {
  None = null,
  One = 1,
  Two = 2
}

enum GameState {
  Ongoing = -1,
  Draw = 0,
  PlayerOneWin = Player.One,
  PlayerTwoWin = Player.Two
}

type Board = Player[];

interface State {
  board: Board;
  playerTurn: Player;
  gameState: GameState | Player
}

const intitializeBoard = () => {
  const board = [];
  for (let i = 0; i < 42; i++) {
    board.push(Player.None);
  }
  return board;
};

const getPrettyPlayer = (player: Player) => {
  if (player === Player.None) return "noPlayer";
  if (player === Player.One) return "playerOne";
  if (player === Player.Two) return "playerTwo";
};


const getLowestIndex = (board: Board, column: number) => {
  for (let i = 35 + column; i >= 0; i -= 7) {
    if (board[i] === Player.None) return i;
  }
  return -1;
};


const togglePlayerTurn = (player: Player) => {
  return player === Player.One ? Player.Two : Player.One;
};


const getGameState = (board: Board) => {
  // Überprüfen auf Horizontal
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c <= 4; c++) {
      const index = r * 7 + c;
      const boardSlice = board.slice(index, index + 4);

      const winningResult = checkForRow(boardSlice);
      if (winningResult !== false) return winningResult;
    }
  }

  // Überprüfen auf Vertikal
  for (let r = 0; r <= 2; r++) {
    for (let c = 0; c < 7; c++) {
      const index = r * 7 + c;
      const boardSlice = [
        board[index],
        board[index + 7],
        board[index + 7 * 2],
        board[index + 7 * 3]
      ];

      const winner = checkForRow(boardSlice);
      if (winner !== false) return winner;
    }
  }

  // Überprüfen auf Diagonal
  for (let r = 0; r <= 2; r++) {
    for (let c = 0; c < 7; c++) {
      const index = r * 7 + c;

      // Überprüfen auf Diagonal nach unten links
      if (c >= 3) {
        const boardRow = [
          board[index],
          board[index + 7 - 1],
          board[index + 7 * 2 - 2],
          board[index + 7 * 3 - 3]
        ];

        const winner = checkForRow(boardRow);
        if (winner !== false) return winner;
      }

      //Überprüfen auf Diagonal nach unten rechts
      if (c <= 3) {
        const boardRow = [
          board[index],
          board[index + 7 + 1],
          board[index + 7 * 2 + 2],
          board[index + 7 * 3 + 3]
        ];

        const winner = checkForRow(boardRow);
        if (winner !== false) return winner;
      }
    }
  }

  if (board.some(cell => cell === Player.None)) {
    return GameState.Ongoing
  } else {
    return GameState.Draw
  }
};


const checkForRow = (board: Player[]) => {
  if (board.some(cell => cell === Player.None)) return false;

  if (
    board[0] === board[1] &&
    board[1] === board[2] &&
    board[2] === board[3]
  ) {
    return board[1];
  }

  return false;
};


class App extends React.Component<{}, State> {

  state: State = {
    board: intitializeBoard(),
    playerTurn: Player.One,
    gameState: GameState.Ongoing
  };

  public renderCells = () => {
    const { board } = this.state;
    return board.map((player, index) => this.renderCell(player, index));
  };

  public handleOnClick = (index: number) => () => {
    const {gameState} = this.state

    if (gameState !== GameState.Ongoing) return

    const column = index % 7;

    this.makeMove(column);
  };

  public makeMove(column: number) {
    const {board, playerTurn} = this.state;
    console.log(playerTurn)

    const index = getLowestIndex(board, column);

    if (index < 0) {
      this.setState({
        board: board,
        playerTurn: playerTurn,
        gameState: getGameState(board)
      })
    } else {
      const newBoard = board.slice();
      newBoard[index] = playerTurn;

      const gameState = getGameState(newBoard);

      this.setState({
        board: newBoard,
        playerTurn: togglePlayerTurn(playerTurn),
        gameState
      })
    }
  };

  public renderCell = (player: Player, index: number) => {
    return (
      <div
        className="cell"
        key={index}
        onClick={this.handleOnClick(index)}
        data-player={getPrettyPlayer(player)}
      />
    );
  };

  public renderGameStatus = () => {
    let textStyle;

    const { playerTurn, gameState } = this.state

    const styleGameEnded = {
      fontSize: 50,
      padding: 20
    }

    const styleGameOngoing = {
      fontSize: 50,
      padding: 20
    }

    let text
    if (gameState === GameState.Ongoing) {
      text = 'Spiel läuft noch! - Spieler ' +  playerTurn + ' ist dran!';
      textStyle = styleGameOngoing;
    } else if (gameState === GameState.Draw) {
      text = 'Spiel ist unentschieden!';
      textStyle = styleGameEnded;
    } else if (gameState === GameState.PlayerOneWin) {
      text = 'Spieler 1 hat gewonnen!';
      textStyle = styleGameEnded;
    } else if (gameState === GameState.PlayerTwoWin) {
      text = 'Spieler 2 hat gewonnen!'
      textStyle = styleGameEnded;
    }

    return (
        <div style={textStyle}>
          {text}
          <div>
          <span style={{color: 'yellow', textShadow: '0px 0px 4px black'}}> Spieler 1</span>
          <span style={{color: 'red', textShadow: '0px 0px 4px black' }}> Spieler 2 </span>
          </div>
        </div>
    )
  }

  public render() {

    return (
      <div className="App">
        {this.renderGameStatus() }
        <div className="board">{this.renderCells()}</div>
      </div>
    );
  }
}

export default App;
