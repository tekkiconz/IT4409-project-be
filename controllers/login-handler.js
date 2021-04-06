const loginHandler = (req, res) => {

    //Handle login request

    res.write("Handle login request");

    //Return user_ID
    return res.end()
}

module.exports = loginHandler;