const errorMiddleware=(err,req,res,next)=>{
    try{
        let error={ ...err};
        error.message=err.message;
        console.error(err);
        if(err.name==='CastError'){   //bad objectID
            const message='Resource Not Found';
            error=new Error(message);
            error.statusCode=404;
        }
        if(err.code===11000){   //mongoose dublicate key
            const message='Duplicate field value entered';
            error=new Error(message);
            error.statusCode=404;
        }
        if(err.code==='ValidationError'){   //mongoose validation error
            const message=Object.values(err.error).map(val=>val.message);
            error=new Error(message.join(', '));
            error.statusCode=404;
        }
        res.status(error.statusCode || 500).json({success: false,error: error.message || 'Server Error'});
    }catch(error){
        next(error);
    }
};
export default errorMiddleware;