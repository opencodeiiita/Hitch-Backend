function response_200(res, message, data, actions) {
    return res.status(200).json({
        status: 'OK',
        message,
        data,
        actions
    });
}

function response_201(res, message, data) {
    return res.status(201).json({
        status: 'Inserted',
        message,
        data
    });
}

function response_204(res, message) {
    return res.status(204).json({
        status: 'No content',
        message
    });
}

function response_400(res, message) {
    return res.status(400).json({
        status: 'error',
        error: message,
        message: "Bad request"
    });
}

function response_401(res, message) {
    return res.status(401).json({
        status: 'error',
        error: message,
        message: "Unauthorized"
    });
}

function response_403(res, message) {
    return res.status(403).json({
        status: 'error',
        error: message,
        message: "Forbidden"
    });
}

function response_404(res, message) {
    return res.status(404).json({
        status: 'error',
        error: message,
        message: "Not found"
    });
}

function response_500(res, log_message, err) {
    var message = err != null ? `${log_message}: ${err}` : log_message;

    console.debug(message);

    return res.status(500).json({
        status: 'error',
        error: `Something went wrong.\n${message}`,
        message: "Internal server error"
    });
}


module.exports = {
    response_200,
    response_201,
    response_204,
    response_400,
    response_401,
    response_403,
    response_404,
    response_500
};