import express from 'express';

const profileRouter = express.Router();

profileRouter.get('/', (req, res)  => {
    let data = {
        layout: "main",
    };
    res.render('index', data);
});

export default profileRouter;