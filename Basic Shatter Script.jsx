// Basic Shatter Script Tutorial

var mainWindow = new Window("palette", "Basic Shatter Script", undefined);
mainWindow.orientation = "column";

var textGroup = mainWindow.add("group", undefined, "textGroup");
textGroup.orientation = "row";
var instructionsText = textGroup.add("statictext", undefined, "Select the layer to shatter and run!");

var groupOne = mainWindow.add("group", undefined, "groupOne");
groupOne.orientation = "row";
var widthText = groupOne.add("statictext", undefined, "Width");
var widthEditText = groupOne.add("edittext", undefined, "500");
widthEditText.characters = 4;
var heightText = groupOne.add("statictext", undefined, "Height");
var heightEditText = groupOne.add("edittext", undefined, "500");
heightEditText.characters = 4;

var groupTwo = mainWindow.add("group", undefined, "groupTwo");
groupTwo.orientation = "row";
var shatterButton = groupTwo.add("button", undefined, "Shatter");

mainWindow.center();
mainWindow.show();

shatterButton.onClick = function() {
        if(app.project.activeItem == null) {
                alert("Please select a composition");
                return false;
            }
        if(!(app.project.activeItem instanceof CompItem)) {
                alert("Please select a composition");
                return false;
            }
        var comp = app.project.activeItem;
        if(comp.selectedLayers.length != 1) {
                alert("Please select 1 layer to shatter");
                return false;
            }
        
        var layer = comp.selectedLayers[0];
        app.beginUndoGroup("Basic Shatter");
        shatter(comp, layer, parseInt(widthEditText.text), parseInt(heightEditText.text));
        app.endUndoGroup();
    }

function shatter(comp, layer, width, height) {
    var maskShape = new Shape();
    var maxX = Math.round(comp.width / width);
    var maxY = Math.round(comp.height / height);
    var newLayer, newMask, myProperty;
    
    var x = 0;
    var y = 0;
    var counter = 0;
    var center = []; 
    
        for(var e = 0; e <= maxY; e++) {
    for(var i = 0; i < maxX; i++) {
         counter++;
         newLayer = layer.duplicate();
         newLayer.moveToBeginning();
         newLayer.audioEnabled = false;
         newLayer.name = "Mask " + counter.toString();
         newMask = newLayer.Masks.addProperty("Mask");
         myProperty = newMask.maskPath;
         
         if(e ==maxY) {
            maskShape.vertices = [[x, y], [x, comp.height], [x+width, comp.height], [x+width, y]];
            } else {
            maskShape.vertices = [[x, y], [x, y+height], [x+width, y+height], [x+width, y]];
         }
     
         maskShape.closed = true;
         myProperty.setValue(maskShape);
         
         center = [x+(width*.5), y+(height*.5)]
         newLayer.property("Anchor Point").setValue(center);
         newLayer.property("Position").setValue(center);
         
         if(i == (maxX-1)) {
             x = 0;
             y+=height;
             } else {
             x+=width;
                 }
         
        }
        }
    layer.enabled = false;
    }
