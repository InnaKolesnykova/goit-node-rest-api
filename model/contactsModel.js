import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {versionKey: false});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;