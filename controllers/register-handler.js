const registerHandler = (req, res) => {

    //Handle register request
    res.write("Handle register request!");

    return res.end()
}

module.exports = registerHandler;