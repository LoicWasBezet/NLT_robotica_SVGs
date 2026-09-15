// script.js
// initialize SVG.js

import { colorSelections, WriteExponent } from '/Definitions/Base.js';

import { ButtonBox, WriteNumber, AddMultiConnector, borderWidth, squareWidth, boundingBoxWidth } from '/Definitions/Box.js';

import { CreateAdditionMachine } from './Definitions/Machines.js';
import { BaseChangeToggle, PowerChangeToggle} from './Definitions/Toggles.js';


let screenWidth = (squareWidth+borderWidth)*7+2*boundingBoxWidth;
let screenHeight = (squareWidth+borderWidth)*3+borderWidth*2+2*boundingBoxWidth;
let values = [1,1];
let lineX = screenWidth - boundingBoxWidth  - (squareWidth+borderWidth) - squareWidth/2;
//let lineX = boundingBoxWidth  +(squareWidth+borderWidth) + squareWidth/2;

let exponentState = {doWritePowers : false, base : 2}

function GenerateDisplay(display)
{
    display.clear();
    let internal = display.group();
    let redNumbers = internal.group();
    let blueNumbers = internal.group();
    let greenNumbers = internal.group();

    let state = {doWritePowers : exponentState.doWritePowers, color : "red"};
    let rightX = (squareWidth + borderWidth) * 3.8;
    let machineCenterX = rightX + (squareWidth+borderWidth)/2/Math.tan(Math.PI/3)
    AddMultiConnector(redNumbers,`0,0 ${rightX},0 ${rightX + Math.sin(Math.PI/6)*squareWidth/2},${-Math.cos(Math.PI/6)*squareWidth/2}`, false, state);
    redNumbers.add(WriteNumber(internal, values[1], exponentState.base, 4, state));
    
    state = {doWritePowers : exponentState.doWritePowers, color : "green"};
    AddMultiConnector(greenNumbers,`0,0 ${rightX},0 ${rightX + Math.sin(Math.PI/6)*squareWidth/2},${Math.cos(Math.PI/6)*squareWidth/2}`, false, state);


    greenNumbers.add(WriteNumber(internal, values[0], exponentState.base, 4, state));

    redNumbers.dy(squareWidth + borderWidth);
    
    state = {doWritePowers : exponentState.doWritePowers, color : "blue"};
    let blueY = (squareWidth + borderWidth)*2+borderWidth*2;
    let blueX = lineX - boundingBoxWidth - borderWidth/2 - squareWidth/2- borderWidth*2.5;


    AddMultiConnector(blueNumbers,`0,0 ${blueX },0 ${blueX},${-blueY+(squareWidth+borderWidth)/2} ${machineCenterX},${-blueY+(squareWidth+borderWidth)/2}`, true, state);
    blueNumbers.add(WriteNumber(internal, values[0] + values[1], exponentState.base, 4, state));
    blueNumbers.dmove(0,blueY);


    let additionMachine = CreateAdditionMachine(internal,0);
    additionMachine.dmove(machineCenterX,(squareWidth+borderWidth)/2)

    internal.dmove(boundingBoxWidth+squareWidth/2+borderWidth/2,boundingBoxWidth+squareWidth/2+borderWidth/2);
    

}
//args should be [values, index, increment]
function Press(display, args)
{
    args[0][args[1]] += args[2];
    if (args[0][args[1]] < 0){args[0][args[1]] = 15;}
    if (args[0][args[1]] > 15){args[0][args[1]] = 0;}
    GenerateDisplay(display);
}
function GenerateControls(draw, display)
{
    let controls = draw.group();
    let buttons = controls.group();
    let greenButtons = buttons.group()
    let leftX = lineX + borderWidth;

    let width = (screenWidth - leftX - boundingBoxWidth - borderWidth*2.5)/2;
    greenButtons.add(ButtonBox(display, '+', {buttonFunction: Press, buttonDirectionDown: true, args: [values, 0, 1], state: {doWritePowers : exponentState.doWritePowers, color : "green", "newSquareWidth" : width}}).dx(width+borderWidth));
    greenButtons.add(ButtonBox(display, '-', {buttonFunction: Press, buttonDirectionDown: true, args: [values, 0, -1], state: {doWritePowers : exponentState.doWritePowers, color : "green", "newSquareWidth" : width}}));
    greenButtons.dx(width/2 + borderWidth).cy(0);//
    

    let redButtons = buttons.group();
    redButtons.add(ButtonBox(display, '+', {buttonFunction: Press, buttonDirectionDown: true, args: [values, 1, 1], state: {doWritePowers : exponentState.doWritePowers, color : "red", "newSquareWidth" : width}}).dx(width+borderWidth));
    redButtons.add(ButtonBox(display, '-', {buttonFunction: Press, buttonDirectionDown: true, args: [values, 1, -1], state: {doWritePowers : exponentState.doWritePowers, color : "red", "newSquareWidth" : width}}));
    redButtons.dx(width/2 + borderWidth).cy(0);//
    redButtons.dy(squareWidth+borderWidth);
    
    let toggles = controls.group(); 
    let baseToggle = BaseChangeToggle(display, exponentState, GenerateDisplay);
    let powerToggle = PowerChangeToggle(display, exponentState, GenerateDisplay);
    let height = baseToggle.bbox().height;
    baseToggle.dy(-height/2-borderWidth/2);
    powerToggle.dy(height/2+borderWidth/2);
    toggles.add(baseToggle);
    toggles.add(powerToggle);
    
    toggles.dy(squareWidth*2+borderWidth*4);
    toggles.dx(width + borderWidth*3/2)


    controls.dmove(leftX,boundingBoxWidth+squareWidth/2+borderWidth/2);

}

function DrawBackground(draw)
{
    let inputColor = colorSelections["blue"].light;
    let outputColor = colorSelections["blue"].medium;
    let controlColor = colorSelections["blue"].light;
    let borderColor = colorSelections["blue"].dark;
    
    let lineY = (squareWidth+borderWidth)*2 + boundingBoxWidth + borderWidth/2;
    draw.rect(screenWidth,screenHeight).fill(inputColor).radius(boundingBoxWidth+2*borderWidth);

    draw.rect(screenWidth-borderWidth-lineX,screenHeight).fill(controlColor).dx(lineX+borderWidth).radius(boundingBoxWidth+2*borderWidth);
    draw.rect(boundingBoxWidth+2*borderWidth,screenHeight).fill(controlColor).dx(lineX+borderWidth);

    draw.rect(screenWidth,screenHeight-lineY-borderWidth).fill(outputColor).radius(boundingBoxWidth+2*borderWidth).dy(lineY+borderWidth);
    draw.rect(screenWidth,boundingBoxWidth+2*borderWidth).fill(outputColor).dy(lineY+borderWidth);
    draw.rect(screenWidth,borderWidth).fill(borderColor).dy(lineY);

    

}


export function render(el)
{
    if (typeof SVG !== 'function') {
        console.error(" SVG.js library is not loaded. -L");
        return;
    }
    SVG.on(document, 'DOMContentLoaded', function() {
        if (!el) {
            console.error("Container element not found. -L");
            return; 
        }

        const draw = SVG().addTo(el).size(screenWidth,screenHeight);
        el.style.userSelect = 'none';

        DrawBackground(draw);
        
        let display = draw.group();
        GenerateDisplay(display);

        GenerateControls(draw,display);

    });

}