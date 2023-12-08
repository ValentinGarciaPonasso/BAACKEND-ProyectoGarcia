

const showProfile = (req, res) => {
    const {user} = req.session.user;
    res.render ('profile', {user});
};

export {showProfile};