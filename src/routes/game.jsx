import { useState } from 'react'
import '../css/game.css'
import { useEffect } from 'react';
import { useRef } from 'react';

export default function Game(){
    const [snakeCoordinates, setSnakeCoordinates] = useState([{x:5, y:5},{x:4, y:5},{x:3, y:5}]);
    const [gameSate, setGameState] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const direction =  useRef('right');
    const boxArray = []
    const score = useRef(0);


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
        if(!((0 >= newC.x <=9)&&(0 >= newC.y <=9))){
            console.log("Wnt Out of boundry");
            gameOver(true);
        }
    }

    function detectSnakeBody(newC){
        if(snakeCoordinates.some(
            (coord) => coord.x === newC.x && coord.y === newC.y
          )){
            setGameOver(true);
            console.log("Ate its Body");
        }
    }

    function runGameLoop(){
         //render snake
         setTimeout(() => {
            document.querySelector(`#box${snakeCoordinates[snakeCoordinates.length-1].x}${snakeCoordinates[snakeCoordinates.length-1].y}`).classList.remove("snake-tail");
         }, 500);
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
        
        const newC = calcSnakeHeadNext(direction.current);
        const newSnakeArray = snakeCoordinates.toSpliced(snakeCoordinates.length-1,1);
        newSnakeArray.unshift(newC);
        setSnakeCoordinates(newSnakeArray);
        detectOutOfBoundry(newC);
        detectSnakeBody(newC);
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
                boxArray[count] = box;
                count++;
                container.appendChild(box);
            }   
        }

        //render initial fruit
        renderFruit(snakeCoordinates, 9, 9);

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    },[]);

    useEffect(()=>{
        if(gameSate && !gameOver){setTimeout(()=>{
            runGameLoop()
        },500);}
    },[snakeCoordinates, gameSate, gameOver]);
    return (
        <div id='game-main-div'>
            <div className='game-info-div'>Game Starts in 3</div>
            <div id='canvas-div'>
            </div>
        </div>
    )
}