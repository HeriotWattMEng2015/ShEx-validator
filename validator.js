var RDF = require('./includes/Erics_RDF.js');
var dataParser = require("./dataParser.js");
var errorFormatter = require("./validationErrorFormatter.js");


function validate(schema,
                  schemaResolver,
                  startingShapes,
                  db,
                  dbResolver,
                  closedShapes,
                  validationResult) {


    schema.alwaysInvoke = {};

    for (var startingShape in startingShapes) {

        if(!startingShapes[startingShape]) break;

        var startingNode = dataParser.parseNode(startingShape, dbResolver.Prefixes);

        var validation = schema.validate(
            startingNode,
            startingShapes[startingShape],
            db,
            {
                iriResolver: schemaResolver,
                closedShapes: closedShapes
            },
            true
        );

        return cleanupValidation(validation, dbResolver, startingNode, validationResult);


    }
}

function cleanupValidation(valRes, resolver, startingShape, cb) {

    return valRes.then(function(valRes) {
        var errors = valRes.errors.map(errorFormatter);

        cb( {
            errors: errors,
            matches: valRes.matches,
            startingShape: startingShape,
            passed: errors.length === 0
        });
    });

}

module.exports.validate = validate;
