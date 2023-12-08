import express from 'express';

const profileRouter = express.Router();

profileRouter.get('/', (req, res)  => {
    console.log("Profile Router: " + req.session.name)
    let data = {
        layout: "profile",
        user: req.session,
    };
    res.render('index', data);
});

export default profileRouter;