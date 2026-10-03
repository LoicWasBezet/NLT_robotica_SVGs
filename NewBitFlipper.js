// script.js
// initialize SVG.js

import { colorSelections } from '/Definitions/Base.js';

import {WriteClickableNumber,BaseButtonFunction, ButtonBox, SimpleBox, WriteRawNumbers, WriteNumber, AddConnector, borderWidth, squareWidth, boundingBoxWidth } from '/Definitions/Box.js';

let bits = [];
let textGroupList = [];
let exponentState = {doWritePowers : false, base : 2}
let textHeight = squareWidth/2;

let screenWidth = (squareWidth+borderWidth)*7-borderWidth+2*boundingBoxWidth;
let screenHeight = squareWidth+borderWidth + 2*boundingBoxWidth + textHeight;
let resultGroup;
export function ButtonFunction(display, args)
{
    bits[args[1]] = 1-bits[args[1]];
    textGroupList[args[1]].text(String(bits[args[1]]));
    GenerateResults();
    return;
}

function GetResult(){
    let result = 0;
    for (let i = 0; i < 4; i++) {
        result += bits[i] * Math.pow(2, i); 
    }
    return result;
}
function DrawBackground(draw)
{
    let bgColor = colorSelections["blue"].medium;
    draw.rect(screenWidth,screenHeight).fill(bgColor).radius(boundingBoxWidth+2*borderWidth);
}

function WriteEqualSign(parent)
{   
  var text = parent.text("=");
  let fontSize = (squareWidth);
  
  text.font({ fill: colorSelections["blue"].dark, family: 'monospace', weight: 850, size: fontSize});


  text.cx(squareWidth*4+borderWidth*4);
  text.cy( -5);
  text.attr({ 'user-select': 'none' });

}
function GenerateDisplay(display)
{
    display.clear();
    let internal = display.group();
    resultGroup = display.group();
    const resultState = {"doWritePowers" : false, "color" : "blue", "newSquareWidth" : squareWidth};

    GenerateResults();
    AddConnector(internal, 4, true, false, resultState);
    let [clickableNumber,textGroups] = WriteClickableNumber(internal, GetResult(), 2, 4, ButtonFunction, false, 0, resultState, true); 
    textGroupList = textGroups;
    WriteEqualSign(internal);

    internal.dmove(boundingBoxWidth+squareWidth*1/2,boundingBoxWidth+squareWidth/2);
}
function GenerateResults(){
    resultGroup.clear();
    const resultState = {"doWritePowers" : false, "color" : "blue", "newSquareWidth" : squareWidth};

    WriteNumber(resultGroup, GetResult(), 10, 2,resultState);
    
    resultGroup.dmove(squareWidth*11/2+borderWidth*5+boundingBoxWidth,boundingBoxWidth+squareWidth/2);
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
        for (let i = 0; i < 4; i++) {
        bits.push(Math.random() < 0.6 ? 0 : 1);
        }
        DrawBackground(draw);
        
        let display = draw.group();
        GenerateDisplay(display);

    });

}