var CardFactory = function() {

    var currentShape, shape, shapes = [], currentColor, color, colors = [];


    for (shape in Shape) {
        currentShape = Shape[shape];
        if (currentShape instanceof Function) {
            continue;
        }
        shapes.push(currentShape);
    }

    for (color in Color) {
        currentColor = Color[color];
        if (currentColor instanceof Function) {
            continue;
        }
        colors.push(currentColor);
    }



    this.generatePack = function() {

        var id = 0, cards = [], shapeArrayIndex = 0, colorArrayIndex = 0, shapesLength = shapes.length, colorsLength = colors.length, currentColor, currentShape;
        for (; shapeArrayIndex < shapesLength; ++shapeArrayIndex) {
            for (; colorArrayIndex < colorsLength; ++colorArrayIndex) {
                id++;
                currentColor = Color.getNameByColorId(colors[colorArrayIndex]);
                currentShape = Shape.getNameByShapeId(shapes[shapeArrayIndex]);
                cards.push(new Card(id, colors[colorArrayIndex], shapes[shapeArrayIndex]));


            }
            colorArrayIndex = 0;
        }
        return (new Pack(cards));
    };

};
//----------------------------------------------------------