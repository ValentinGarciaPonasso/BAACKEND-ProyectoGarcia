import express from 'express';

const registerRouter = express.Router();

registerRouter.get('/', (req, res)  => {
    let data = {
        layout: "register",
    };
    res.render('main', data);
});

export default registerRouter;