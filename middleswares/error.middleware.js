const errorMiddleware = (err, req, res, next) => {
    console.error('Error caught:', err);
    
    let error = { ...err };
    error.message = err.message;
    
    if(err.name === 'CastError'){   //bad objectID
        const message = 'Resource Not Found';
        error = new Error(message);
        error.statusCode = 404;
    }
    if(err.code === 11000){   //mongoose duplicate key
        const message = 'Duplicate field value entered';
        error = new Error(message);
        error.statusCode = 400;
    }
    if(err.name === 'ValidationError'){   //mongoose validation error
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message.join(', '));
        error.statusCode = 400;
    }
    
    return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};
export default errorMiddleware;