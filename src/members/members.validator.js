const {throwBadRequestError, validateEmail} = require('../config/route-middlewares');

function validateNewMembers(req, res, next){
    const newMembers = req.body;
    const membersHash = {};

    if (!newMembers){
        throwBadRequestError('No payload defined');
    }

    if (!Array.isArray(newMembers)){
        throwBadRequestError('Payload should be of type array');
    }

    newMembers.forEach((member, index) => {
        const basicErrorMessage = `Error at index:${index}.`;

        if (!member || !member.name || !member.email){
            throwBadRequestError(`${basicErrorMessage} All new members should have name and email defined`);
        }

        if (typeof member.name !== 'string'){
            throwBadRequestError(`${basicErrorMessage} Name should be of type string`);
        }

        if (!validateEmail(member.email)){
            throwBadRequestError(`${basicErrorMessage} Email doesn't match email pattern`);
        }

        membersHash[member.email] = (membersHash[member.email] || 0) + 1;

        if (membersHash[member.email] > 1){
            throwBadRequestError(`${basicErrorMessage} Payload can't contain duplicate emails`)
        }
    });

    next();
}

module.exports = {
    validateNewMembers
}