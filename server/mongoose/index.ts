import Mongoose from 'mongoose';
import config from '../app.config';

Mongoose.connect(`mongodb://${config.host}/achat`, config.mongoose);

export default Mongoose;
