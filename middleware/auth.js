const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try {
        //const token = req.headers.authorization.split(" ")[1];
        const token = req.header("x-auth-token");
        const isCustomAuth = token.length < 500;
        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token,'test');
            req.userId = decodedData?.id;
        }
        else{
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = auth;