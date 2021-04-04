const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;

    if(url === `/`){
    }
    if(url === `/users`){
    }
    if(url === `/files`){
    }
    if(url === `/admin`){
    }
    res.statusCode = 200;
    res.write(`HelloWorld!`);
    res.end();
}

module.exports = requestHandler;