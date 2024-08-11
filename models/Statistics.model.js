const { Schema, model } = require('mongoose');
const { toJSON } = require('@reis/mongoose-to-json');

const userVisitSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    visitDate: { type: Date, required: true },
    pageVisited: { type: String, required: true },
    duration: { type: Number, required: true }  // Duration in seconds
}, {
    timestamps: true
});

userVisitSchema.plugin(toJSON);

export const UserVisitModel = model('UserVisit', userVisitSchema);

