//this is a re-usable try catch wrapper for many routes

//the requestHandler is my route function
const asyncHandler = (requestHandler) => {
    return (req , res , next) => {
        //we give a Promise that we will try to resolve the route
        //if Promise throws then we use catch and next 
        Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }
}

export {asyncHandler}



//next is used to move from states like from one middleware to the next middleware