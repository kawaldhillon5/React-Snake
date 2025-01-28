import { useState } from 'react'
import '../css/game.css'
import { useEffect } from 'react';

export default function Game(){
    const snakeCoordinates = [{x:5, y:5},{x:4, y:5},{x:3, y:5}]
    const [direction, setDirection] = useState('right');
    const boxArray = []

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
    useEffect(()=>{
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
        //render snake
        snakeCoordinates.forEach((coordinate ,i, array)=>{
            switch (i) {
                case 0:
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake-head");
                    break;
                case (array.length -1):
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake-tail");
                    break;
                default:
                    document.querySelector(`#box${coordinate.x}${coordinate.y}`).classList.add("snake");
                    break;
            }
        });
        //render initial fruit
        renderFruit(snakeCoordinates, 9, 9); 
    })
    return (
        <div id='game-main-div'>
            <div id='canvas-div'>
            </div>
        </div>
    )
}