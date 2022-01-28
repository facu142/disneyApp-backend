const { response } = require('express');
const moment = require('moment');

const validateDateFormat = (creationDate) => {

    console.log(creationDate);

    if (!(moment(creationDate, "YYYY-MM-DD", true).isValid())) {
        throw new Error(`El formato de la fecha debe ser YYYY-MM-DD`);
    };

    return true
}

module.exports = {
    validateDateFormat
}

