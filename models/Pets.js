const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PetSchema = Schema({
    reference_id: String,
    name: String,
    type_animal: { type: String, enum: ["Cat", "Dog"] },
    size: { type: String, enum: ["Small", "Medium", "Big"] },
    wasFounded: Boolean,
    description: String,
    photo_name: String,
    photo_url: String,
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // neighborhood: { type: { type: String }, coordinates: [Number] },
    found_by: { type: Schema.Types.ObjectId, ref: "User" },
    shelter: { type: Schema.Types.ObjectId, ref: "Shelter" }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
PetSchema.index({ location: '2dsphere' });

const Pet = mongoose.model("Pet", PetSchema);
module.exports = Pet;