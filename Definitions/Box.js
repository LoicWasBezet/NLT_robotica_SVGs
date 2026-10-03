// script.js
// initialize SVG.js
import {colorSelections, WriteExponent} from './Base.js';


const borderWidth = 8;
const squareWidth = 100;
const exponantialWidth = 34;
const boundingBoxWidth = 20;

const baseState = {"doWritePowers" : true, "color" : "blue", "newSquareWidth" : squareWidth};
export { borderWidth, squareWidth, exponantialWidth, boundingBoxWidth, baseState};


export function BaseButtonFunction(display, args)
{
    return;
}

function BaseBox(display, content="", state = baseState)
{
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let isEmpty = (content == ' ' || content == '' || content == null);
    let primary = colorSelections[state["color"]].dark;
    let secondary = isEmpty ? colorSelections[state["color"]].medium : colorSelections[state["color"]].light;

    let group = display.group();
    
    const borderRect = group.rect(realSquareWidth, realSquareWidth).fill(primary).radius(2*borderWidth).center(0,0);
    const insideRect = group.rect(realSquareWidth-2*borderWidth, realSquareWidth-2*borderWidth).fill(secondary).radius(borderWidth).center(0,0).attr({ 'pointer-events': 'none' });
    
    let fontSize = (realSquareWidth - (2 * borderWidth)) * 0.8;
    let text = null;
    if (!isEmpty){        
    text = group.text(String(content))
    .font({ fill: colorSelections[state["color"]].dark, family: 'monospace', weight: 700, size: fontSize })
    .center(0,0)
    .attr({ 'user-select': 'none' }).attr({ 'pointer-events': 'none' });;

    }
    return [group, insideRect, borderRect, text];
}

function AddExponent(buttonGroup,base, bitNumber, isHidden, state = baseState){
    
    
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let primary = isHidden ? colorSelections[state["color"]].medium : colorSelections[state["color"]].dark;
    let secondary = isHidden ? colorSelections[state["color"]].dark : colorSelections[state["color"]].highlight;
    let exponent = buttonGroup.group();
    let backGround = exponent.group();
    // let borderRect = exponent.rect(exponantialWidth+borderWidth,exponantialWidth+borderWidth).fill(primary).radius(exponantialWidth/2+borderWidth/2).center(0,0);

    let textGroup = 0;
    
    if (state["doWritePowers"])
    {
        textGroup = exponent.text(function(add) {
            add.tspan(String(base));
        
            add.tspan(WriteExponent(bitNumber));//.dx("-0.16em"); 
        });
    } else {
        textGroup = exponent.text(function(add) {
            add.tspan(String(base**bitNumber));
        });
    }
    
    let fontSize = (exponantialWidth) * 0.65;//0.9
    textGroup.font({ fill: primary, family: 'monospace', weight: 700, size: fontSize })
    .attr({ 'user-select': 'none' })
    .center(0,0);
    let width = Math.max(exponantialWidth,textGroup.bbox().width+(exponantialWidth) * 0.35);
    let insideRect = backGround.rect(width,exponantialWidth).fill(secondary).radius(exponantialWidth/2).center(0,0);


    exponent.dmove(-realSquareWidth/2 + borderWidth*6/4 + (width-exponantialWidth)/2, -realSquareWidth/2 + borderWidth*6/4);
    return exponent;
}

export function ButtonBox(display, content, {base=0, bitNumber = 0, buttonFunction = BaseButtonFunction, buttonDirectionDown = true, args=0, returnText = false, state = baseState}={}) //arguements should be passed by reference
{
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let primary = colorSelections[state["color"]].dark;
    let secondary = colorSelections[state["color"]].light;
    let selectingColor = colorSelections[state["color"]].medium;

    let [boxGroup, insideRect, borderRect, text] = BaseBox(display, content, state);
    let group = display.group();
    let buttonSides = display.rect(realSquareWidth, realSquareWidth).radius(2*borderWidth).center(0,0);
    if (buttonDirectionDown){
        buttonSides.fill(colorSelections[state["color"]].medium).dy(realSquareWidth * 16/100);
    } else {
        buttonSides.fill(colorSelections[state["color"]].light).dmove(realSquareWidth * 4/100, realSquareWidth * 4/100);
    }
    group.add(buttonSides);
    group.add(boxGroup);
    group.style('cursor', 'pointer');
    
    group.click(function() { 
        boxGroup.timeline().finish();
        if (buttonDirectionDown){
            
            boxGroup.animate(20).dy(realSquareWidth * 16/100)   
            .animate(40).dy(-realSquareWidth * 16/100);
        } else {
          boxGroup.animate(20).dmove(realSquareWidth * 4/100, realSquareWidth * 4/100)   
            .animate(40).dmove(-realSquareWidth * 4/100, -realSquareWidth * 4/100)   ;
                
        }

        setTimeout(function() {
            buttonFunction(display,args); 
        }, 60);
    });

    boxGroup.mouseover(function() {
        insideRect.timeline().finish();
        insideRect.animate(300).attr({ fill: selectingColor });
    });

    boxGroup.mouseout(function() {
        insideRect.timeline().finish();
        insideRect.animate(300).attr({ fill: secondary });
    });

    if (base > 0){
        AddExponent(group, base, bitNumber,  false,  state);
    }
    if (returnText){
        console.log("j");
        return [group, text];
    } else {
    return group;

    }
}

export function SimpleBox(display, content="", {base=0, bitNumber = 0, state = baseState}={})
{
    let [group, insideRect, borderRect, text] = BaseBox(display, content, state);
    if (base > 0){
        AddExponent(group, base, bitNumber, content=="" || content=="0",  state);
    }
    return group;
}
export function WriteClickableNumber(display, number, base, maxDigitCount, buttonFunction = BaseButtonFunction, buttonDirectionDown = true, args=0, state = baseState, addBitNum = false)
{
    let textGroups = [];
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let group = display.group();
    for (let i = 0; i < maxDigitCount; i++){
        let newArgs = [args, i];
        let digit = Math.floor((number % (base**(i+1)))/(base**i));
        
        let text = String(digit);
        // if (number < base**i && !(number == 0 && i == 0) && i >= minLength){
        //     text = "";
        // }
        let [buttonGroup,textGroup]= ButtonBox(display, text, {base: base, bitNumber: i, buttonFunction: buttonFunction, buttonDirectionDown: buttonDirectionDown, args: newArgs, returnText:true, state: state});
        buttonGroup.dmove((maxDigitCount-i-1) * (realSquareWidth + borderWidth), 0);
        group.add(buttonGroup);
        textGroups.push(textGroup); 
        //group.add(SimpleBox(display, text, {base: base, bitNumber: i, state: state}).dmove( (maxDigitCount-i-1) * (realSquareWidth + borderWidth), 0));
    }
    return [group, textGroups];
}
export function WriteNumber(display, number, base, maxDigitCount, state = baseState, minLength = 0)
{
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let group = display.group();
    for (let i = 0; i < maxDigitCount; i++){
        let digit = Math.floor((number % (base**(i+1)))/(base**i));
        
        let text = String(digit);
        if (number < base**i && !(number == 0 && i == 0) && i >= minLength){
            text = "";
        }
        group.add(SimpleBox(display, text, {base: base, bitNumber: i, state: state}).dmove( (maxDigitCount-i-1) * (realSquareWidth + borderWidth), 0));
    }
    return group;
}
export function WriteRawNumbers(display, numbers, state = baseState)
{
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let group = display.group();
    for (let i = 0; i < numbers.length; i++){

        let text = String(numbers[numbers.length-i-1]);
        if (!/^\d+$/.test(text))//check if it is not a digit
        {
            text = "";
        }
        group.add(SimpleBox(display, text, {base: 0, bitNumber: 0, state: state}).dmove( (numbers.length-i-1) * (realSquareWidth + borderWidth), 0));
    }
    return group;
}
export function AddConnector(display, length, isHorizontal, isBright, state = baseState)
{
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in state){
        realSquareWidth = state["newSquareWidth"];
    }
    let coverColor = isBright ? colorSelections[state["color"]].dark : colorSelections[state["color"]].dark;
    let connectorColor = isBright ? colorSelections[state["color"]].light : colorSelections[state["color"]].medium;
    let width = borderWidth*3;
    let height = width + (length-1) *(realSquareWidth + borderWidth);
    
    let group = display.group();
    let connectorCover = group.rect(isHorizontal ? height : width, isHorizontal ? width : height).fill(coverColor).radius(width/2).move(-width/2,-width/2);
    let connector = group.rect(isHorizontal ? height-2*borderWidth : borderWidth, isHorizontal ? borderWidth : height-2*borderWidth).fill(connectorColor).radius(borderWidth/2)
        .move( -borderWidth/2,  -borderWidth/2);
    return connectorCover,connector;
}

export function AddMultiConnector(display, path, isBright, state = baseState)
{
    let coverColor = isBright ? colorSelections[state["color"]].dark : colorSelections[state["color"]].dark;
    let connectorColor = isBright ? colorSelections[state["color"]].light : colorSelections[state["color"]].medium;

    var connectorCover = display.polyline(path);
    connectorCover.fill('none')
    connectorCover.stroke({ color: coverColor, width: 3*borderWidth, linecap: 'round', linejoin: 'round' })

    var connector = display.polyline(path);
    connector.fill('none')
    connector.stroke({ color: connectorColor, width: borderWidth, linecap: 'round', linejoin: 'round' })
    
    return connectorCover,connector;
}