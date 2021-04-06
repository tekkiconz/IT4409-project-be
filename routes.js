const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;
    if(url === `/register`){
        
    }
    if(url === `/login`){
        
    }
    if(url === `/` && method === 'GET' ){
        //Handle api
    }
    if(url === `/users`){
        //Handle api
    }
    if(url === `/files`){
        //Handle api
    }
    if(url === `/admin`){
        //Handle api
    }
    res.statusCode = 200;
    res.write(`HelloWorld!`);
    res.end();
}

module.exports = requestHandler;

app.get('/')