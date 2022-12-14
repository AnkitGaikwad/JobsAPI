const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');
var jsonValidator = require('jsonschema').Validator;
const Ajv = require("ajv");

const register = async (req, res) => {
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json( {user:{name: user.name}, token} );
};

const login = async (req, res) => {
    var userSchema = {  
        type: 'object',  
        properties: {    
            username: { type: 'string' },
            email: {
                type: 'string',     
            },    
            password: { type: 'string' }  
        },  
        required: ['email', 'password'],
        additionalProperties: false
    };

    // Validation of req.body using jsonSchema module
    // var validator = new jsonValidator();
    // validator.addSchema(userSchema, '/User');
    // try {    
    //     validator.validate(req.body, userSchema, { throwError: true });  
    // } catch (error) {    
    //     res.status(StatusCodes.UNAUTHORIZED).end('Invalid body format: ' + error.message);    
    //     return;  
    // }

    //Validation of req.body using Ajv module
    const ajv = new Ajv({allErrors: true});
    try { 
        const validate = ajv.addSchema(userSchema).compile(userSchema);
        const valid = validate(req.body);
        if (!valid) {
            throw validate.errors[0].message;
        }
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).end('Invalid body format: ' + error);    
        return; 
    }
    
    const {email, password} = req.body; 
    console.log(password);
    const user = await User.findOne({email});
    console.log(user);
    if(!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json( {user:{name: user.name}, token} );
};

module.exports = {
    register,
    login,
};