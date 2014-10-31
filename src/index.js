import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const winningStyle = {
    color: 'blue'
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={props.isWinning ? winningStyle : null}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinning={this.props.winningSquares.includes(i)}
            />
        );
    }

    render() {
        let board = [];
        for (let row = 0; row < 3; row++) {
            let squares = []
            for (let col = 0; col < 3; col++) {
                let i = row * 3 + col;
                squares.push(<span key={i}>{this.renderSquare(i)}</span>);
            }
            board.push(<div key={row} className="board-row">{squares}</div>)  
        }

        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moveLocation: null
            }],
            xIsNext: true,
            stepNumber: 0,
            sortByAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveLocation: calculateRowCol(i)
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }

    toggleSort() {
        this.setState({
            sortByAscending: !this.state.sortByAscending
        });
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = isDraw(current.squares, stepNumber);

        const moves = history.map((step, i) => {
            const isCurrentStep = i === stepNumber;
            const desc = i ?
                'Go to move ' + i + ': (' + step.moveLocation + ')':
                'Go to game start';
            return (
                <li key={i}>
                    <button onClick={() => this.jumpTo(i)}>
                        {isCurrentStep
                            ? <b>{desc}</b>
                            : desc
                        }
                    </button>
                </li>
            );
        });
        if (!this.state.sortByAscending) {
            moves.reverse();
        }

        let status;
        let winningSquares;
        if (winner) {
            status = 'Winner: ' + winner[0];
            winningSquares = winner[1];
        } else if (draw) {
            status = 'Draw';
            winningSquares = [...Array(10).keys()];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            winningSquares = [];
        }

        let sortOrder = 'Sort by ' + (this.state.sortByAscending ? 'descending' : 'ascending');

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <div>
                        <button onClick={() => this.toggleSort()}>{sortOrder}</button>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [x, y, z] = lines[i];
        if (squares[x] && squares[x] === squares[y] && squares[x] === squares[z]) {
            return [squares[x], lines[i]];
        }
    }
    return null;
}

function isDraw(squares, stepNumber) {
    return stepNumber === 9 && !calculateWinner(squares);
}

function calculateRowCol(i) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return [row, col];
}
