
const DemoPost = (req,res) => {
    res.json({
        message: 'This is a demo post for protected routes'
    });
}

module.exports = {
    DemoPost
}