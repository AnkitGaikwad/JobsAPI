const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');
var jsonValidator = require('jsonschema').Validator;

const register = async (req, res) => {
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json( {user:{name: user.name}, token} );
};

const login = async (req, res) => {
    var userSchema = {  
        id: '/User',  
        type: 'object',  
        properties: {    
            username: { type: 'string' },
            email: {
                type: 'string',      
                format: 'email'    
            },    
            password: { type: 'string' }  
        },  
        required: ['email', 'password']
    };

    var validator = new jsonValidator();
    validator.addSchema(userSchema, '/User');
    try {    
        validator.validate(req.body, userSchema, { throwError: true });  
    } catch (error) {    
        res.status(StatusCodes.UNAUTHORIZED).end('Invalid body format: ' + error.message);    
        return;  
    }

    const {email, password} = req.body;
    const user = await User.findOne({email});

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