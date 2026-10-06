// script.js
// initialize SVG.js

import { colorSelections } from '/Definitions/Base.js';

import { ButtonBox, SimpleBox, WriteRawNumbers, WriteNumber, AddConnector, borderWidth, squareWidth, boundingBoxWidth } from '/Definitions/Box.js';

import { CreatePlus } from './Definitions/Machines.js';
import { PowerChangeToggle} from './Definitions/Toggles.js';
let focusColumns = [
    [null,null],
    [null,3],
    [3,3],
    [3,3],
    [3,2],
    [2,2],
    [2,2],
    [2,1],
    [1,1],
    [1,1],
    [1,0],
    [0,0],
    [0,null],
    [null,null]
]

let exponentState = {doWritePowers : false, base : 10}

let screenWidth = (squareWidth+borderWidth)*7+2*boundingBoxWidth;
let screenHeight = (squareWidth+borderWidth)*4+borderWidth*2+2*boundingBoxWidth;
let values = [517,845];
let step = [0];
let temporaryValues = [null,null,null];
//let resultValues = [0,0,0,0];
let lineX = -borderWidth*2 + boundingBoxWidth+squareWidth*5+borderWidth*13/2;
//let lineX = boundingBoxWidth  +(squareWidth+borderWidth) + squareWidth/2;


function CreateFocusColumn(parent,startColumn,column)
{
    let startColumnLeft = startColumn,columnLeft = column,startColumnRight = startColumn,columnRight = column;
    if (startColumn == null){
        startColumnLeft = -1;
        startColumnRight = 3;
    }
    if (column == null){
        columnLeft = -1;
        columnRight = 3;
    }
    let focusGroup = parent.group();
    let leftSlider = focusGroup.rect(Math.max(0,((squareWidth+borderWidth)*(startColumnLeft)+borderWidth/2)),(squareWidth+borderWidth)*3+borderWidth)
    .fill(colorSelections["blue"].light)
    .opacity(0.9)
    .dmove(-squareWidth/2-borderWidth*1.15,-squareWidth/2-borderWidth);
    console.log(Math.max(0,(squareWidth+borderWidth)*columnLeft+borderWidth/2));
    leftSlider.animate(500,'->').width(Math.max(0,(squareWidth+borderWidth)*columnLeft+borderWidth/2));

    let rightSlider = focusGroup.rect(Math.max(0,(squareWidth+borderWidth)*(3-startColumnRight)),(squareWidth+borderWidth)*3+borderWidth)
    .fill(colorSelections["blue"].light)
    .opacity(0.9)
    .dmove(-squareWidth/2-borderWidth*0.65 + (squareWidth+borderWidth)*(startColumnRight+1) ,-squareWidth/2-borderWidth);
    rightSlider.animate(500,'->').width(Math.max(0,(squareWidth+borderWidth)*(3-columnRight)));
    rightSlider.animate(500,'->').dx(-(squareWidth+borderWidth)*(startColumnRight-columnRight));

    return focusGroup;
}

function CreateResultsFocusColumn(parent,startColumn,column)
{
    let startColumnLeft = startColumn,columnLeft = column,startColumnRight = startColumn,columnRight = column;
    if (startColumn == null){
        startColumnLeft = -1;
        startColumnRight = 3;
    }
    if (column == null){
        columnLeft = -1;
        columnRight = 3;
    }
    columnLeft -= 1;
    startColumnLeft -= 1;
    let focusGroup = parent.group();
    let leftSlider = focusGroup.rect(Math.max(0,(squareWidth+borderWidth)*(startColumnLeft)+borderWidth/2),(squareWidth+borderWidth)+borderWidth)
    .fill(colorSelections["blue"].medium)
    .opacity(0.9)
    .dmove(-squareWidth/2-borderWidth*1.15,-squareWidth/2-borderWidth + squareWidth*3 + borderWidth*5);
    leftSlider.animate(500,'->').width(Math.max(0,(squareWidth+borderWidth)*columnLeft+borderWidth/2));

    let rightSlider = focusGroup.rect(Math.max(0,(squareWidth+borderWidth)*(3-startColumnRight)),(squareWidth+borderWidth)+borderWidth)
    .fill(colorSelections["blue"].medium)
    .opacity(0.9)
    .dmove(-squareWidth/2-borderWidth*0.65 + (squareWidth+borderWidth)*(startColumnRight+1) ,-squareWidth/2-borderWidth + squareWidth*3 + borderWidth*5);
    rightSlider.animate(500,'->').width(Math.max(0,(squareWidth+borderWidth)*(3-columnRight)));
    rightSlider.animate(500,'->').dx(-(squareWidth+borderWidth)*(startColumnRight-columnRight));

    return focusGroup;
}
function DrawBaseNums(display, internal){
    let greenNumbers = internal.group();
    let redNumbers = internal.group();

    let stateGreen = {"doWritePowers" : exponentState.doWritePowers, "color" : "green"};
    AddConnector(greenNumbers, 4, true, false, stateGreen);
    greenNumbers.add(WriteNumber(internal, values[0], exponentState.base, 4, stateGreen));
    greenNumbers.dy(squareWidth + borderWidth);

    let stateRed = {"doWritePowers" : exponentState.doWritePowers, "color" : "red"};
    AddConnector(redNumbers, 4, true, false, stateRed);
    redNumbers.add(WriteNumber(internal, values[1], exponentState.base, 4, stateRed));
    redNumbers.dy(squareWidth*2 + borderWidth*2);
    return [greenNumbers, redNumbers];
    
}
function DrawTemporaryValues(parent,temporaryNumbers, currentTempValues){    
    let stateGray = {"doWritePowers" : exponentState.doWritePowers, "color" : "gray"};
    //AddConnector(temporaryNumbers, 3, true, false, stateGray);
    temporaryNumbers.add(WriteRawNumbers(parent, currentTempValues,  stateGray));
}
function DrawResultNumber(parent,blueNumbers, value, bitNum){
    
    let stateBlue = {"doWritePowers" : exponentState.doWritePowers, "color" : "blue"};
    AddConnector(blueNumbers, 4, true, false, stateBlue);
    blueNumbers.add(WriteNumber(parent, value, exponentState.base, 4, stateBlue,bitNum));
    blueNumbers.dy(squareWidth*3 + borderWidth*5);
}
// function GetResultValue(){
//     return resultValues[0] * Math.pow(exponentState.base,3) +
//         resultValues[1] * Math.pow(exponentState.base,2) +
//         resultValues[2] * Math.pow(exponentState.base,1) +
//         resultValues[3] * Math.pow(exponentState.base,0); 
// }
function GetResultValue(column){
    let sum = Math.trunc((values[0] % (Math.pow(exponentState.base,4-column)))) + 
     Math.trunc((values[1] % (Math.pow(exponentState.base,4-column))));
    return sum;
}
function GenerateDisplay(display)
{
    display.clear();
    let internal = display.group();
    let temporaryNumbers = internal.group();
    let blueNumbers = internal.group();

    let [greenNumbers, redNumbers] = DrawBaseNums(display, internal);
    

    let startColumn = focusColumns[step[0]][0];
    let column = focusColumns[step[0]][1];
    let currentTemporaryNumbers = [null,null,null]
    if (step[0] > 3 && temporaryValues[2] != 0){
        currentTemporaryNumbers[2] = temporaryValues[2]
    }
    if (step[0] > 6 && temporaryValues[1] != 0){
        currentTemporaryNumbers[1] = temporaryValues[1]
    }
    if (step[0] > 9 && temporaryValues[0] != 0){
        currentTemporaryNumbers[0] = temporaryValues[0]
    }
    DrawTemporaryValues(internal,temporaryNumbers, currentTemporaryNumbers);


    let focusColumn = CreateFocusColumn(internal, startColumn, column);
    let Plus = DrawMovingPlus(internal,startColumn,column);  


    console.log(GetResultValue());
    let bitNum = Math.trunc((step[0]-2)/3);
    if (step[0] < 2){
    DrawResultNumber(internal,blueNumbers, null,0);
    } else if ((step[0]-2) % 3 == 0) {
        let sum = GetResultValue(3-bitNum);
        DrawResultNumber(internal,blueNumbers,sum, bitNum+1);
        blueNumbers.opacity(0);
        blueNumbers.animate(500,"->").opacity(1);
    } else if ((step[0]-2) % 3 == 1) {
        let sum = GetResultValue(3-bitNum);
        let movingDigit = String(Math.trunc((sum % (Math.pow(exponentState.base,2+bitNum)))/(Math.pow(exponentState.base,1+Math.trunc((step[0]-2)/3)))));
        DrawResultNumber(internal,blueNumbers,sum % (Math.pow(exponentState.base,1+bitNum)),bitNum+1);
        
        if (movingDigit != "0"){
            let restBox = SimpleBox(internal, movingDigit, {base: 0, bitNumber: bitNum+1, state: {"doWritePowers" : true, "color" : "gray", "newSquareWidth" : squareWidth}}).dmove( (4-bitNum-2) * (squareWidth + borderWidth), squareWidth*3+borderWidth*5);
            restBox.animate(500,"->").dy(-squareWidth*3-borderWidth*5);
        } else if (bitNum != 3) {
            let restBox = SimpleBox(internal, null, {base: 0, bitNumber: bitNum+1, state: {"doWritePowers" : true, "color" : "gray", "newSquareWidth" : squareWidth}}).dmove( (4-bitNum-2) * (squareWidth + borderWidth), 0).opacity(0);
            restBox.animate(500,"->").opacity(1);
        }
    } else {
    
        let sum = GetResultValue(3-bitNum) % Math.pow(exponentState.base,bitNum+1);
        
        DrawResultNumber(internal,blueNumbers,sum, bitNum+1);
        if (bitNum != 3){

        let oldBitnum =  Math.trunc((step[0]-3)/3);
        let oldSum = GetResultValue(3-oldBitnum);
        let movingDigit = String(Math.trunc((oldSum % (Math.pow(exponentState.base,2+oldBitnum)))/(Math.pow(exponentState.base,1+oldBitnum))));
        if (movingDigit == "0"){
            movingDigit = "";
        }
        let restBox = SimpleBox(internal, movingDigit, {base: 0, bitNumber: oldBitnum+1, state: {"doWritePowers" : true, "color" : "gray", "newSquareWidth" : squareWidth}}).dmove( (4-Math.trunc((step[0]-3)/3)-2) * (squareWidth + borderWidth), 0);
        
        }
    }
    CreateResultsFocusColumn(internal,startColumn,column);







    let width = squareWidth*0.7;

    let stepCounter = internal.group();
    // stepCounter.add(SimpleBox(display, "STAP " + String(step), {base:0, bitNumber:0, state: {doWritePowers : exponentState.doWritePowers, color : "blue", "newSquareWidth" : width}}).dx(squareWidth*0.6+borderWidth));
    // stepCounter.dx(width/2 + boundingBoxWidth + borderWidth*2+(squareWidth+borderWidth)*5).cy(squareWidth*2+borderWidth*2);
    // stepCounter.dmove(0,boundingBoxWidth+squareWidth/2+borderWidth/2);
    let primary = colorSelections["blue"].dark;
    let secondary = colorSelections["blue"].light;

    const borderRect = stepCounter.rect(squareWidth*2+borderWidth, squareWidth*0.7).fill(primary).radius(2*borderWidth).center(0,0);
    const insideRect = stepCounter.rect(squareWidth*2-borderWidth, squareWidth*0.7-borderWidth*2).fill(secondary).radius(borderWidth).center(0,0).attr({ 'pointer-events': 'none' });
    
    let fontSize = (squareWidth - (2 * borderWidth)) * 0.5;
    let text = stepCounter.text( "STAP " + (step < 10 ? "0" : "")+ String(step))
    .font({ fill: primary, family: 'monospace', weight: 700, size: fontSize })
    .center(0,0)
    .attr({ 'user-select': 'none' }).attr({ 'pointer-events': 'none' });;
    stepCounter.dmove(squareWidth*4 + borderWidth*4 + squareWidth/2+borderWidth/2, -squareWidth*0.15)

    internal.dmove(+ boundingBoxWidth+squareWidth*3/2+borderWidth*3/2,boundingBoxWidth+squareWidth/2+borderWidth/2);


}
function DrawMovingPlus(parent,startColumn, column){
    if (startColumn == null) {
        startColumn = 0;
    }
    if (column == null){
        column = 0;
    }
    let additionSign = CreatePlus(parent).dmove((squareWidth+borderWidth)*(startColumn-1),squareWidth*2+borderWidth*2);
    additionSign.animate(500,'->').dx((squareWidth+borderWidth)*(column-startColumn));
    return additionSign;
}
function Press(display, args)
{
    args[0][0] += args[1]
    if (args[0][0] < 0){
        args[0][0] = focusColumns.length-1;
    }
    if (args[0][0] > focusColumns.length-1){
        args[0][0] = 0;
    }
    GenerateDisplay(display);
}
function GenerateControls(draw, display)
{
    let controls = draw.group();
    let buttons = controls.group();

    let width = squareWidth*0.6;

    buttons.add(ButtonBox(display, '>', {buttonFunction: Press, buttonDirectionDown: true, args: [step, 1], state: {doWritePowers : exponentState.doWritePowers, color : "blue", "newSquareWidth" : width}}).dx(width+borderWidth));
    
    buttons.add(ButtonBox(display, '<', {buttonFunction: Press, buttonDirectionDown: true, args: [step, -1], state: {doWritePowers : exponentState.doWritePowers, color : "blue", "newSquareWidth" : width}}));
    buttons.dx(screenWidth-width*1.5-borderWidth*1.5-boundingBoxWidth).dy(-squareWidth*0.15+width + borderWidth*1.5);//
    
    
    //let toggles = controls.group(); 
    //let powerToggle = PowerChangeToggle(display, exponentState, GenerateDisplay);
    //let height = powerToggle.bbox().height;
    //powerToggle.dy(height/2+borderWidth/2);
    // toggles.add(powerToggle);
    
    // toggles.dy(squareWidth*2+borderWidth*4);
    // toggles.dx(width + borderWidth*3/2)


    controls.dmove(0,boundingBoxWidth+squareWidth/2+borderWidth/2);
}

function DrawBackground(draw)
{
    let inputColor = colorSelections["blue"].light;
    let outputColor = colorSelections["blue"].medium;
    let sideColor = colorSelections["blue"].light;
    let controlColor = colorSelections["blue"].medium;
    let borderColor = colorSelections["blue"].dark;
    
    let lineY = (squareWidth+borderWidth)*3 + boundingBoxWidth + borderWidth/2;
    draw.rect(screenWidth,screenHeight).fill(inputColor).radius(boundingBoxWidth+2*borderWidth);
    //draw.rect(borderWidth,screenHeight).fill(borderColor).dx(lineX);

    draw.rect(screenWidth,screenHeight-lineY-borderWidth).fill(outputColor).radius(boundingBoxWidth+2*borderWidth).dy(lineY+borderWidth);
    draw.rect(screenWidth,boundingBoxWidth+2*borderWidth).fill(outputColor).dy(lineY+borderWidth);

    
    draw.rect(screenWidth-borderWidth-lineX,screenHeight).fill(controlColor).dx(lineX+borderWidth).radius(boundingBoxWidth+2*borderWidth);
    draw.rect(boundingBoxWidth+2*borderWidth,screenHeight).fill(controlColor).dx(lineX+borderWidth);

    draw.rect(screenWidth-borderWidth-lineX,lineY).fill(sideColor).dx(lineX+borderWidth).radius(boundingBoxWidth+2*borderWidth);
    draw.rect(boundingBoxWidth+2*borderWidth,lineY).fill(sideColor).dx(lineX+borderWidth);
    draw.rect(screenWidth-borderWidth-lineX,lineY-boundingBoxWidth-borderWidth*2).fill(sideColor).dx(lineX+borderWidth).dy(boundingBoxWidth+borderWidth*2);


    draw.rect(screenWidth,borderWidth).fill(borderColor).dy(lineY);

}

function GenerateTemporaryValues(){
    for (let i = 1; i < 4; i++){
        let sum = GetResultValue(i);
        console.log(sum)
        let movingDigit = Math.trunc((sum % (Math.pow(exponentState.base,5-i)))/(Math.pow(exponentState.base,4-i)))
        console.log(movingDigit);
        temporaryValues[i-1] = movingDigit;
    }

}
export function render(el, options={})
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
        if (options.base) {
            exponentState.base = Number(options.base);
            values = (exponentState.base === 2) ? [6, 7] : [517, 845];
        }
        const draw = SVG().addTo(el).size(screenWidth,screenHeight);
        el.style.userSelect = 'none';

        GenerateTemporaryValues();
        DrawBackground(draw);
        
        let display = draw.group();
        GenerateDisplay(display);

        GenerateControls(draw,display);

    });

}