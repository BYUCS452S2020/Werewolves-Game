const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    ability: { type: String, required: true },
    side: { type: Number, required: true },
    priority: { type: Number, required: true },
    ability_av: { type: Boolean, required: false },
    poison_av: { type: Boolean, required: false },
    potion_av: { type: Boolean, required: false },
    functioned: { type: Boolean, required: false }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Character', schema);