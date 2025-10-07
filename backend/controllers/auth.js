exports.register = async(req, res) => {
    try {
        const { email, password } = req.body
        if(!email) {
            return res.status(400).json({ massage: 'Email !!!'})
        }
        if(!password) {
            return res.status(400).json({ massage: 'password !!!'})
        }

        console.log(email,password)
        res.send('hello in re con');
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    } 
};

exports.login = async(req, res) => {
    try {
        res.send('hello in login con');
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    } 
};

exports.user = async(req, res) => {
    try {
        res.send('hello in user con');
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    } 
};
