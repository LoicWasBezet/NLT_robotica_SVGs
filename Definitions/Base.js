// initialize SVG.js

const white = '#FFFFFF';
const lightGray = '#EBEBEB';
const darkGray = '#A6A6A6';
const black = '#000000';

const lightBlue = '#B8D1EB';
const blue = '#6089BA';
const darkBlue = '#143A55';
const yellow = '#FBB927';
const lightRed   = '#E8B6BC'; 
const red        = '#B75B67'; 
const darkRed    = '#4F1821';
const redHighlight = '#ff603c';//yellow;//'#ff7e57';
const lightGreen = '#B8E6C8'; 
const green      = '#5BB77B';
const darkGreen  = '#184F2B';
const greenHighlight = '#aefa44';// yellow;// '#b9ff21';

const exponentials = ["⁰","¹","²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];


const colorSelections = {"blue" : {light: lightBlue, medium: blue, dark: darkBlue, highlight: yellow}, "red" : {light: lightRed, medium: red, dark: darkRed, highlight: redHighlight}, "green" : {light: lightGreen, medium: green, dark: darkGreen, highlight: greenHighlight}, "gray" : {light: lightGray, medium: darkGray, dark: black, highlight: white}};


export {colorSelections, blue, lightBlue, yellow, darkBlue, lightGray, darkGray, white, black, lightRed, red, darkRed, lightGreen, green, darkGreen, exponentials};


export function Initialize(el)
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
    
    el.style.userSelect = 'none';
    const draw = SVG().addTo(el).size(screenWidth,squareWidth * 4 + borderWidth * 10 + boundingBoxWidth*2);
    return draw;
  });
}


export function WriteExponent(number){
    let numberText = String(number);
    let result = "";
    for (let i = 0; i < numberText.length; i++){
        result+= exponentials[parseInt(numberText[i])];
    }
    return result;
}