import mongoose from 'mongoose';
import gravatar from 'gravatar';

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
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '200', r: 'pg', d: 'retro' });
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {versionKey: false});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;