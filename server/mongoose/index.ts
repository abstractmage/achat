import mongoose from 'mongoose';
import config from './../app.config.json';

mongoose.connect(`mongodb://${config.host}/achat`, config.mongoose);

export default mongoose;
