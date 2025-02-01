import { useState } from 'react'
import '../css/game.css'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Game(){
    const [snakeCoordinates, setSnakeCoordinates] = useState([{x:5, y:5},{x:4, y:5},{x:3, y:5}]);
    const [gameState, setGameState] = useState(false);
    const [gamePause, setGamePaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [highScoreSet, setHighScoreSet] = useState(false);
    const direction =  useRef('right');
    const fruitCoordinatesRef = useRef({});
    const score = useRef(0);
    const highScore = useRef(localStorage.getItem('highScore') || 0);
    const [showPauseDialog, setShowPauseDialog] = useState(false);
    const [showGameOverDialog, setShowGameOverDialog] = useState(false);
    const navigate = useNavigate();

    const handleResume = () => {
        setGamePaused(!gamePause);
        setShowPauseDialog(false);
    };

    const handleRestart = () => {
        navigate(0);
    };

    function renderFruit(snakeCoordinates, boardWidth, boardHeight) {
        const occupiedCoordinates = new Set();
        for (const { x, y } of snakeCoordinates) {
          occupiedCoordinates.add(`${x},${y}`);
        }
      
        let fruitCoordinates;
        do {
          fruitCoordinates = {
            x: Math.floor(Math.random() * boardWidth),
            y: Math.floor(Math.random() * boardHeight),
          };
        } while (occupiedCoordinates.has(`${fruitCoordinates.x},${fruitCoordinates.y}`));
        if(fruitCoordinatesRef.current.x || fruitCoordinatesRef.current.x === 0 || fruitCoordinatesRef.current.y === 0){
            document.querySelector(`#box${fruitCoordinatesRef.current.x}${fruitCoordinatesRef.current.y}`).classList.remove('fruit');
        }
        fruitCoordinatesRef.current.x = fruitCoordinates.x;
        fruitCoordinatesRef.current.y = fruitCoordinates.y;
        document.querySelector(`#box${fruitCoordinates.x}${fruitCoordinates.y}`).classList.add('fruit');
    }

    function calcSnakeHeadNext(dir){
        let newC = {};
       switch (dir) {
        case 'right':
            newC.x = (snakeCoordinates[0].x + 1);
            newC.y = snakeCoordinates[0].y;
            break;
        case 'down':
            newC.x = snakeCoordinates[0].x;
            newC.y = (snakeCoordinates[0].y + 1);
            break;
        case 'left':
            newC.x = (snakeCoordinates[0].x - 1);
            newC.y = snakeCoordinates[0].y;
            break;
        case 'up':
            newC.x = snakeCoordinates[0].x;
            newC.y = (snakeCoordinates[0].y - 1);
            break;
        default:
            break;
       }
       return newC;
    }

    function detectOutOfBoundry(newC){
        if(!(0 <= newC.x && newC.x <= 9 && 0 <= newC.y && newC.y <= 9)){
            console.log("Went Out of boundry");
            if (score.current > highScore.current) {
                highScore.current = score.current;
                localStorage.setItem('highScore', highScore.current);
                setHighScoreSet(true); 
            }
            setGameOver(true);
            return true
        } else return false;
    }

    function detectSnakeBody(newC){
        if(snakeCoordinates.some(
            (coord) => coord.x === newC.x && coord.y === newC.y
          )){
            if (score.current > highScore.current) {
                highScore.current = score.current;
                localStorage.setItem('highScore', highScore.current);
                setHighScoreSet(true);  
            }
            setGameOver(true);
            console.log("Ate its Body");
            return true
        } else{
            return false
        }
    }

    function detectFruit(newC, snakeCoordinates){
        if((fruitCoordinatesRef.current.x === newC.x)&&(fruitCoordinatesRef.current.y === newC.y)){
            renderFruit(snakeCoordinates, 9, 9);
            return true;
        } else {
            return false;
        }
    }

    function countDown() {
        let count = 2;
        const intervalId = setInterval(() => {
            document.querySelector('.game-info-div').textContent = `Game Starts in ${count}`
            count--;      
            if (count < 0) {
            clearInterval(intervalId);
            document.querySelector('.game-info-div').textContent = `Score ${score.current}`
            setGameState(true)
            }
        }, 1000);
    }

    const handleKeyDown = (event) => {
        window.removeEventListener('keydown', handleKeyDown);
        switch (event.key) {
            case 'ArrowRight':
                if(!(direction.current === 'left')) {direction.current =  'right' };
                break;
            case 'ArrowLeft':
                if(!(direction.current === 'right')) {direction.current = 'left' };
                break;
            case 'ArrowUp':
                if(!(direction.current === 'down')) {direction.current = 'up'};
                break;
            case 'ArrowDown':
                if(!(direction.current === 'up')) { direction.current = 'down' };            
                break;
            default:
                break;
        }
    };

    function runGameLoop(){
        const newC = calcSnakeHeadNext(direction.current);
       
        //render snake
        snakeCoordinates.forEach((coordinate ,i, array)=>{
            switch (i) {
                case 0:
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake-head");
                    break;
                case (array.length -1):
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.remove("snake");
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.remove("snake-head");
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake-tail");
                    break;
                default:
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.remove("snake-head");
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake");
                    break;
            }
        });
        if((!detectOutOfBoundry(newC)) && (!detectSnakeBody(newC))){
            setTimeout(() => {
                document.querySelector(`#box${snakeCoordinates[snakeCoordinates.length-1].x}${snakeCoordinates[snakeCoordinates.length-1].y}`).classList.remove("snake-tail");
            }, 300);
            let newSnakeArray  = [...snakeCoordinates]
            if(detectFruit(newC, snakeCoordinates)){
                score.current = score.current + 1;
                document.querySelector('.game-info-div').textContent = `Score ${score.current}`
            } else {
                newSnakeArray = snakeCoordinates.toSpliced(snakeCoordinates.length-1,1);
            }
            newSnakeArray.unshift(newC);
            setSnakeCoordinates(newSnakeArray);
        }
    }

    //initial game render
    useEffect(()=>{
      
        //render timer
        countDown();

        //render playboard
        const container = document.querySelector('#canvas-div');
        let count = 0
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const box = document.createElement('div');
                box.classList.add('canvas-box');
                box.setAttribute('id',`box${x}${y}`);
                count++;
                container.appendChild(box);
            }   
        }

        //render initial fruit
        renderFruit(snakeCoordinates, 9, 9);
    },[]);
    // game loop
    useEffect(()=>{
        if(gameState && !gameOver && !gamePause){
            window.addEventListener('keydown', handleKeyDown);
            setTimeout(()=>{
                runGameLoop()
            },300);
        } else if(gameState && !gameOver && gamePause){
            setShowPauseDialog(true)        }
        else if(gameState && gameOver && !gamePause){
            setShowGameOverDialog(true);
        }
        
        return () => window.removeEventListener('keydown', handleKeyDown);
    },[snakeCoordinates, gameState, gameOver, gamePause]);


    return (
        <div id='game-main-div'>
            <div className='game-header'>
                <div className='game-info-div'>Game Starts in 3</div>
                <button onClick={()=> setGamePaused(!gamePause)}>{gamePause ? "Resume": "Pause" }</button>
            </div>
            <div id='canvas-div'></div>
            <div className='game-controls'>
                <button className='left-button'  value={'ArrowLeft'}
                onClick={(e)=>{handleKeyDown({key:e.target.value})}}
                >⬅</button>
                <button className='up-button'    value={'ArrowUp'}
                onClick={(e)=>{handleKeyDown({key:e.target.value})}}
                >⬆</button>
                <button className='right-button' value={'ArrowRight'}
                onClick={(e)=>{handleKeyDown({key:e.target.value})}}
                >➡</button>
                <button className='down-button'  value={'ArrowDown'}
                onClick={(e)=>{handleKeyDown({key:e.target.value})}}
                >⬇</button>
            </div>
            <Dialog 
                isOpen={showPauseDialog} 
                title="Game Paused"
            >
                <p>Game is currently paused.</p>
                <button onClick={handleResume}>Resume</button>
            </Dialog>

            <Dialog 
                isOpen={showGameOverDialog} 
                title="Game Over"
            >
                {highScoreSet ? <p>Congrulations! You Set a New High Score of {highScore.current}</p> :<p>You Score: {score.current}</p>}
                <button onClick={handleRestart}>Restart</button>
            </Dialog>
        </div>
        
    )
}

const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div 
        className='game-dialog'
      >
        <h2>{title}</h2>
        {children}
      </div>
    );
  };