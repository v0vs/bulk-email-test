const util = require('util');
const {BAD_REQUEST} = require('http-status-codes');

function catchAsyncErrors(fn){
    return (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch){
            routePromise.catch(err => {
                return next(err);
            })
        }
    }
}

function throwBadRequestError(message){
    const error = new Error(message);
    error.statusCode = BAD_REQUEST;
    throw error;
}

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function validateEmail(email){
    return emailRegex.test(String(email).toLowerCase())
}

module.exports = {
    catchAsyncErrors, throwBadRequestError, validateEmail
}