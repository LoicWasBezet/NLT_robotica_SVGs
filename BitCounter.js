// script.js
// initialize SVG.js

import { blue, lightBlue, yellow, darkBlue, lightGray, darkGray, white, black } from '/Definitions/Base.js';

let borderWidth = 8;
let squareWidth = 100;
let boundingBoxWidth = 20;
let exponantialWidth = 36;

let exponentials = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶"];

let number = 6;
let draw = null;
let plusButton = null;
let minusButton = null;
let screenWidth = squareWidth * 7 + borderWidth * 7 + boundingBoxWidth*2;


function GetRomanNumeral(num)
{
  let values = [' ', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI','XII','XIII','XIV','XV'];
  return values[num];
}

function PlusPress(display)
{
  number += 1;
  if (number > 15){number = 0;}
  UpdateDisplay(display);
};
function MinusPress(display)
{
  number -= 1;  
  if (number < 0){number = 15;}
  UpdateDisplay(display);
};
function Exponent(row, column, display, bitCount, base, hidden = false)
{
  let isButton = true;
  let primary = hidden ? blue : darkBlue;
  let secondary = hidden ? darkBlue : yellow;
  let group = draw.group();
  let borderRect; 
  let insideRect; 
  let text;
  borderRect = draw.rect(exponantialWidth,exponantialWidth).fill(secondary).radius(exponantialWidth/2);
  borderRect.move(column * (borderWidth + squareWidth)-borderWidth*1/4, row * (borderWidth * 3 + squareWidth)-borderWidth*1/4 );
  text = draw.text(function(add) {
      add.tspan(String(base));

      add.tspan(exponentials[bitCount-1-column]).dx("-0.16em"); 
  });
  let fontSize = (exponantialWidth) * (base == 2 ? 0.65 : 0.55);//0.9
  text.font({ fill: primary, family: 'monospace', weight: 700, size: fontSize })
  .center(column * (borderWidth + squareWidth) +exponantialWidth*0.53-borderWidth/4, row * (borderWidth*3 + squareWidth)+exponantialWidth/2-borderWidth/4)
  .attr({ 'user-select': 'none' });
 
  
  group.add(borderRect);
  
  group.add(text);
  return group;
};
function Box(inhoud, row, column, buttonFunction, display) {
  let isButton = (buttonFunction != 0 && buttonFunction != null);
  let isEmpty = (inhoud == ' ' || inhoud == '' || inhoud == null);
  let primary = isButton || isEmpty ? darkBlue : darkBlue;
  let secondary = isEmpty ? blue : lightBlue;
  
  let group = draw.group();
  
  const borderRect = group.rect(squareWidth, squareWidth).fill(primary).radius(2*borderWidth);
  const insideRect = group.rect(squareWidth-2*borderWidth, squareWidth-2*borderWidth).fill(secondary).radius(borderWidth);
  
  borderRect.move(borderWidth/2 + column * (borderWidth + squareWidth), borderWidth/2 +  row * (borderWidth*3 + squareWidth));
  insideRect.move(borderWidth*3/2 + column * (borderWidth + squareWidth), borderWidth*3/2 +  row * (borderWidth*3 + squareWidth));

  let fontSize = (squareWidth - (2 * borderWidth)) * 0.8;
  
  var text = group.text(String(inhoud))
    .font({ fill: darkBlue, family: 'monospace', weight: 700, size: fontSize })
    .center(borderWidth/2 +squareWidth/2+ column * (borderWidth + squareWidth), borderWidth/2 +squareWidth/2+  row * (borderWidth*3  + squareWidth))
    .attr({ 'user-select': 'none' });

  if (isButton) {
    group.style('cursor', 'pointer');

    group.click(function() { 
      group.timeline().finish();

      group.animate(20).dy(borderWidth * 2)   
           .animate(40).dy(-borderWidth * 2);

      setTimeout(function() {
          buttonFunction(display); 
      }, 60);
    });
    
    group.mouseover(function() {
      insideRect.timeline().finish();
      insideRect.animate(300).attr({ fill: blue });
    });

    group.mouseout(function() {
      insideRect.timeline().finish();
      insideRect.animate(300).attr({ fill: secondary });
    });
  }
  return group;
}
function Line(row, display, color)
{
  const borderRect = draw.rect(screenWidth,borderWidth).fill(color);
  borderRect.move(-boundingBoxWidth, borderWidth/2 +  row * (borderWidth*3 + squareWidth)-borderWidth*2);
  return borderRect;
}

function Write(inhoud, row, naam, display, base)
{
  let group = draw.group();
  for (let i = 0; i < inhoud.length; i++) 
  {
    group.add(Box(inhoud[i],row,i, null,  display));
    if (base != null){
      group.add(Exponent(row,i,display,4,base, inhoud[i] == " "))
    }
  };
  
  var text = draw.text(naam);
  let fontSize = (squareWidth - (2 * borderWidth)) * 0.8;
  
  text.font({ fill: darkBlue, family: 'monospace', weight: 700, size: fontSize});


  text.move(borderWidth/2 * 2 + inhoud.length * (borderWidth + squareWidth), borderWidth/2 + squareWidth/2 +  row * (borderWidth*3  + squareWidth));
  text.cy( borderWidth/2 + squareWidth/2 +  row * (borderWidth*3  + squareWidth));
  text.attr({ 'user-select': 'none' });
  group.add(text);

  return group;
};
function Background(row, color){
  let topRound = row == 0;
  let bottomRound = row == 3;
  const background = draw.rect(screenWidth, squareWidth + borderWidth * 3 + boundingBoxWidth * 2 * (topRound || bottomRound)).fill(color);
  background.move(-boundingBoxWidth,  row * (borderWidth*3 + squareWidth) -boundingBoxWidth * (topRound + bottomRound) - borderWidth * (!topRound+bottomRound));
  if (topRound || bottomRound){
    background.radius(boundingBoxWidth+2*borderWidth);
  }
  return background;
}
function Backdrop(row, column, display){
  
  const borderRect = draw.rect(squareWidth,squareWidth).fill(blue).radius(2*borderWidth);
  borderRect.move(borderWidth/2 + column * (borderWidth + squareWidth), borderWidth*4/2 +  row * (borderWidth*3 + squareWidth));

  return borderRect;
}

function UpdateDisplay(display)
{
  let num10 = String(number).padStart(4, ' ');
  let num2 = number.toString(2).padStart(4, ' ')
  let romanNumeral = GetRomanNumeral(number).padStart(4, ' ');
  display.clear();

  display.add(Background(0,blue));
  display.add(Background(3,yellow));
  display.add(Background(1,lightBlue));
  display.add(Background(2,blue));

  display.add(Write(num10,0, "BASE 10", display, 10));
  display.add(Write(num2,1, "BASE  2", display, 2));
  display.add(Write(romanNumeral,2, "ROMEINS", display,  null));
  display.add(Line(1,display, darkBlue));
  display.add(Line(2,display, darkBlue));
  display.add(Line(3,display, darkBlue));
  //plusButton.clear();
  //minusButton.clear();
  display.add(Backdrop(3,4,display));
  display.add(Backdrop(3,6,display));
  
  //plusButton = Box('+',3,3, PlusPress, display);
  //minusButton = Box('-',3,1, MinusPress, display);
  let counter = Box(String(number),3,5,null,display);
  plusButton = Box('+', 3, 6, PlusPress, display);
  minusButton = Box('-', 3, 4, MinusPress, display);
  
  display.add(counter);
  display.add(plusButton);
  display.add(minusButton);
  display.move(0,0);
  
  


 
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
    
    el.style.userSelect = 'none';
    draw = SVG().addTo(el).size(screenWidth,squareWidth * 4 + borderWidth * 10 + boundingBoxWidth*2);
    let display = draw.group()
    
    UpdateDisplay(display)
  });
}