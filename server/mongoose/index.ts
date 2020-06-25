import Mongoose from 'mongoose';
import config from './../app.config.json';

Mongoose.connect(`mongodb://${config.host}/achat`, config.mongoose);

export default Mongoose;
