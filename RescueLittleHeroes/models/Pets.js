const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PetSchema = Schema(
  {
    reference_id: String,
    shelter: { type: Schema.Types.ObjectId, ref: "Shelter" },
    name: String,
    type_animal: String,
    enum: ["Cats", "Dogs"],
    size: { type: String, enum: ["Small", "Medium", "Big"] },
    wasFounded: Boolean,
    description: String,
    photo_url: String,
    location: { type: { type: String }, coordinates: [Number] },
    neighborhood: { type: { type: String }, coordinates: [Number] },
    founded_by: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Pet = mongoose.model("Pet", PetSchema);
module.exports = Pet;
