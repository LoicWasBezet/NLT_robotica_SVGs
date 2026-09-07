import {colorSelections, WriteExponent} from './Base.js';
import { borderWidth, squareWidth, baseState, BaseButtonFunction } from './Box.js';

//togglestate should be a list with only a 0 or 1 in it. This variable will be keeping track of the position of the toggle. 0 is left, 1 is right.
//TODO: BUG when spamming toggle, freezes


export function BasicToggle(display, leftContent, rightContent, {buttonFunction = BaseButtonFunction, args=0,toggleState=[0], settings=baseState}={})
{
    
    let realSquareWidth = squareWidth;
    if ("newSquareWidth" in settings){
        realSquareWidth = settings["newSquareWidth"];
    }

    let height = (realSquareWidth-borderWidth)/2;


    let darkColor = colorSelections[settings["color"]].dark;
    let lightColor = colorSelections[settings["color"]].light;
    let mediumColor = colorSelections[settings["color"]].medium;
    let highlightColor = colorSelections[settings["color"]].highlight;
    let group = display.group();
    group.style('cursor', 'pointer');
    let backGround = group.group();
    
    let toggle = group.group();
    let leftText = group.text(function(add) {
        add.tspan(String(leftContent));
    });
    let rightText = group.text(function(add) {
        add.tspan(String(rightContent));
    });
    let fontSize = height-borderWidth*2.5;//0.9
    leftText.font({ fill: toggleState==0 ? darkColor : mediumColor, family: 'monospace', weight: 700, size: fontSize })
    .attr({ 'user-select': 'none' })
    .center(0,0);
    rightText.font({ fill: toggleState==1 ? darkColor : mediumColor, family: 'monospace', weight: 700, size: fontSize })
    .attr({ 'user-select': 'none' })
    .center(0,0);
    let textWidth = Math.max(leftText.bbox().width, rightText.bbox().width);
    leftText.dx(-textWidth/2-borderWidth);
    rightText.dx(textWidth/2+borderWidth);

    let width = textWidth*2 + 6*borderWidth;


    let backGroundRect = backGround.rect(width, height).fill(darkColor).radius(height/2).center(0,0);
    let insideRect = backGround.rect(width-borderWidth*2, height-borderWidth*2).fill(lightColor).radius(height/2-borderWidth).center(0,0);
    let toggleContainer = toggle.group();
    let toggleRect = toggleContainer.rect(textWidth+borderWidth*2, fontSize+borderWidth/2).fill(highlightColor).radius(fontSize/2+borderWidth/4)
    .center((textWidth/2+borderWidth) * (toggleState[0] == 0 ? -1 : 1),0);
    
    let duration = 120;
    let hitBox = group.rect(width, height)
    .radius(realSquareWidth / 4)
    .fill('transparent')
    .center(0, 0);

    hitBox.mouseover(function() {
        insideRect.timeline().finish();
        insideRect.animate(300).attr({ fill: mediumColor });
        if (toggleState[0] == 0)
        {
            rightText.timeline().finish();
            rightText.animate(300).fill(darkColor);
        } else
        {
            leftText.timeline().finish();
            leftText.animate(300).fill(darkColor);
        }

    });

    hitBox.mouseout(function() {
        insideRect.timeline().finish();
        insideRect.animate(300).attr({ fill: lightColor });
        if (toggleState[0] == 0)
        {
            rightText.timeline().finish();
            rightText.animate(300).fill(mediumColor);
        } else
        {
            leftText.timeline().finish();
            leftText.animate(300).fill(mediumColor);
        }
    });
    let isAnimating = false;
    hitBox.click(function() { 
        if (isAnimating) {return;}
        isAnimating = true;
        toggleContainer.timeline().finish();
        leftText.timeline().finish();
        rightText.timeline().finish();
        if (toggleState[0] == 0){
            toggleState[0] = 1;
            // leftText.animate(duration).fill(darkColor);
            // rightText.animate(duration).fill(darkColor);
            toggleContainer.animate(duration,'<').dx(textWidth + borderWidth*2)
            .after(() => {buttonFunction(display,args); isAnimating = false;});

        }   
        else {
            toggleState[0] = 0;
            // leftText.animate(duration).fill(darkColor);
            // rightText.animate(duration).fill(darkColor);
            toggleContainer.animate(duration,'<').dx(-textWidth - borderWidth*2)
            .after(() => {buttonFunction(display,args); isAnimating = false;});
        }

    });

    

    return group;
}

function BaseChangeFunction(display, args)
{
    args.exponentState.base = (args.exponentState.base == 10) ? 2 : 10;
    args.GenerateDisplayFunc(display);
}
function PowerChangeFunction(display, args)
{
    args.exponentState.doWritePowers = !args.exponentState.doWritePowers;
    args.GenerateDisplayFunc(display);
}

export function BaseChangeToggle(display, exponentState, GenerateDisplayFunc, {toggleState, settings}={})
{
    return BasicToggle(display, "2", "10",{buttonFunction: BaseChangeFunction, args: {exponentState :exponentState, GenerateDisplayFunc : GenerateDisplayFunc},toggleState: toggleState, settings: settings});
}


export function PowerChangeToggle(display, exponentState,GenerateDisplayFunc, {toggleState, settings}={})
{
    return BasicToggle(display, "=8", "=2"+WriteExponent(3),{buttonFunction: PowerChangeFunction, args: {exponentState : exponentState, GenerateDisplayFunc : GenerateDisplayFunc},toggleState: toggleState, settings: settings});
}