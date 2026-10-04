// script.js
// initialize SVG.js
import {colorSelections, yellow,lightGray, darkGray, white, black} from './Base.js';
import { borderWidth, squareWidth } from './Box.js';

const scale = 1;
const machineWidth = squareWidth*3/4 * scale;
const machineBorderWidth = borderWidth;
export function CreateShaft(parent, borderColor,insideColor, angle, isPointy){
    const height = isPointy ? squareWidth*scale*2/3 -machineBorderWidth/2 :  squareWidth*scale/2 -machineBorderWidth/2;
    const baseHeight = isPointy ? 0 : (squareWidth*scale/2 -machineBorderWidth/2)/3
    let shaft = parent.group();
    shaft.polygon(`0,${baseHeight/2} ${squareWidth*scale/2-machineBorderWidth/2},${height/2} ${squareWidth*scale/2-machineBorderWidth/2},-${height/2}, 0,${-baseHeight/2}`).fill(insideColor)
    var polyline = shaft.polyline(`0,${baseHeight/2} ${squareWidth*scale/2-machineBorderWidth/2},${height/2} ${squareWidth*scale/2-machineBorderWidth/2},-${height/2} 0,${-baseHeight/2} 0,${baseHeight/2}`)
    polyline.fill('none')
    polyline.stroke({ color: borderColor, width: machineBorderWidth, linecap: 'round', linejoin: 'round' })
    shaft.rotate(angle,0,0);
    return shaft;
}
export function CreatePlus(parent, makeBorder, width = machineWidth)
{
    let plusWidth = makeBorder ? 0.65 : 0.8;
    let group = parent.group();
    if (makeBorder)
    {
        let outerCircle = group.rect(width,width).radius(width/2).fill(colorSelections["blue"].dark).center(0,0);
        let innerCircle = group.rect(width-machineBorderWidth*2,width-machineBorderWidth*2)
            .radius(width/2-machineBorderWidth).fill(colorSelections["blue"].light).center(0,0);
    
    }
    let size = width - 2*machineBorderWidth;
    let horizontalPlus = group.rect(size*plusWidth,machineBorderWidth).radius(machineBorderWidth/2).fill(colorSelections["blue"].dark).center(0,0);
    let verticalPlus = group.rect(machineBorderWidth,size*plusWidth).radius(machineBorderWidth/2).fill(colorSelections["blue"].dark).center(0,0);
    return group;
}
export function CreateAdditionMachine(parent, outputAngle)
{
    let group = parent.group();

    CreateShaft(group,colorSelections["red"].dark,colorSelections["red"].medium,120-outputAngle, false);
    CreateShaft(group,colorSelections["green"].dark,colorSelections["green"].medium,240-outputAngle, false);
    //CreateShaft(group,colorSelections["blue"].dark,colorSelections["blue"].light,-outputAngle, false);
    CreatePlus(group, true);
    return group;
}