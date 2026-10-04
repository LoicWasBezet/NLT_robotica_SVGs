// script.js
// initialize SVG.js

import { colorSelections } from '/Definitions/Base.js';
import { CreatePlus } from '/Definitions/Machines.js';

import {baseState, AddExponent, WriteClickableNumber,BaseButtonFunction, ButtonBox, SimpleBox, WriteRawNumbers, WriteNumber, AddConnector, borderWidth, squareWidth, boundingBoxWidth } from '/Definitions/Box.js';

let bits = [1,1,0,1];
let textGroupList = [];
let exponentState = {doWritePowers : false, base : 2}
let textHeight = squareWidth/2 ;

let screenWidth = (squareWidth+borderWidth)*7-borderWidth+2*boundingBoxWidth;
let screenHeight = squareWidth+borderWidth + 2*boundingBoxWidth + textHeight;
let resultGroup;
let lineGroup;
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
function WriteExplanationLine()
{
    lineGroup.clear();
    let height = squareWidth/2;
    let bg = lineGroup.rect(squareWidth * 7 + borderWidth * 6, height)
        .fill(colorSelections["blue"].light)
        .radius(borderWidth * 2)
        .dmove(-squareWidth/2,0);
    lineGroup.dmove(0, squareWidth/2 + borderWidth*2);
    
    for (let i = 0; i < 4; i++) 
    {
        let bit = bits[i];
        let text = lineGroup.text(String(bit))
            .font({ fill: colorSelections["blue"].dark, family: 'monospace', weight: 700, size: textHeight })
            .center(0,0)
            .attr({ 'user-select': 'none' }).attr({ 'pointer-events': 'none' })
            .dy(squareWidth/2+borderWidth*2+textHeight/2).dx(squareWidth/4 + (squareWidth+borderWidth)*(3-i)); 
        let state = {"doWritePowers" : false, "color" : "blue", "newSquareWidth" : squareWidth};
        if (i > 0){
            let plus = CreatePlus(lineGroup, false,borderWidth * 8)
            .cy((squareWidth/2+borderWidth*2+height/2))
            .dx(((squareWidth+borderWidth)*(3.48-i)))
            .scale(0.4);
        }
        let cross = CreatePlus(lineGroup, false,borderWidth * 8)
            .cy(squareWidth/2+borderWidth*2+height/2)
            .dx((squareWidth+borderWidth)*(3.02-i))
            .scale(0.4).rotate(45);
        let exponent = AddExponent(lineGroup,2, i, false,  state,  true)
            .dy((squareWidth/2+borderWidth*2+textHeight/2))
            .dx(-squareWidth/4 + (squareWidth+borderWidth)*(3-i)); 
    }
    let equal = lineGroup.text("=")
            .font({ fill: colorSelections["blue"].dark, family: 'monospace', weight: 1000, size: textHeight*1.5 })
            .center(0,0)
            .attr({ 'user-select': 'none' }).attr({ 'pointer-events': 'none' })
            .dy(squareWidth/2+borderWidth*2+textHeight/2-borderWidth/2)
            .dx((squareWidth+borderWidth)*(4)); 
    let resultText = lineGroup.text(String(GetResult()))
            .font({ fill: colorSelections["blue"].dark, family: 'monospace', weight: 700, size: textHeight })
            .center(0,0)
            .attr({ 'user-select': 'none' }).attr({ 'pointer-events': 'none' })
            .dy(squareWidth/2+borderWidth*2+textHeight/2).dx((squareWidth+borderWidth)*(6));     
        
    lineGroup.dmove(boundingBoxWidth+squareWidth*1/2,boundingBoxWidth+squareWidth/2);
    

}
function GenerateDisplay(display)
{
    display.clear();
    let internal = display.group();
    lineGroup = display.group();
    resultGroup = display.group();
    const resultState = {"doWritePowers" : false, "color" : "blue", "newSquareWidth" : squareWidth};
    let [connector, cover] = AddConnector(internal, 2, true, false, resultState);
    connector.dx(squareWidth*5+borderWidth*5);
    cover.dx(squareWidth*5+borderWidth*5);
    GenerateResults();
    AddConnector(internal, 4, true, false, resultState);
    let [clickableNumber,textGroups] = WriteClickableNumber(internal, GetResult(), 2, 4, ButtonFunction, false, 0, resultState, true); 
    textGroupList = textGroups;
    WriteEqualSign(internal);

    WriteExplanationLine();
    internal.dmove(boundingBoxWidth+squareWidth*1/2,boundingBoxWidth+squareWidth/2);
}
function GenerateResults(){
    resultGroup.clear();
    const resultState = {"doWritePowers" : false, "color" : "blue", "newSquareWidth" : squareWidth};

    WriteNumber(resultGroup, GetResult(), 10, 2,resultState);
    WriteExplanationLine()
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
        DrawBackground(draw);
        
        let display = draw.group();
        GenerateDisplay(display);

    });

}