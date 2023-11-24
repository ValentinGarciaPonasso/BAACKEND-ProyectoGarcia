import mongoose from 'mongoose';

function connect () {
    const MONGO_HOST = 'localhost';
    const MONGO_DB = 'coderhouse';
    const URI = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

    mongoose.connect(URI)
    .then(
        ()=> {
            console.log('Connection db ready to use')
        },
        (err)=> {
            console.log('Connection Error: ', err);
        }
    )
};

export default connect;