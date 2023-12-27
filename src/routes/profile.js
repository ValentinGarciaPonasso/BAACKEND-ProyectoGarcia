import express from 'express';

const profileRouter = express.Router();

profileRouter.get('/', (req, res)  => {
    console.log("Profile Router: " + req.session.name)
    let data = {
        layout: "profile",
        user: req.session,
        admin: false,
    };
    if (req.session.role === 'admin') {
        data.admin = true;
    }
    res.render('index', data);
});

export default profileRouter;