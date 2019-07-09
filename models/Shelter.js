const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShelterSchema = Schema(
  { 
    id: String,
    name: String,
    address: String,
    location: { type: { type: String }, coordinates: [Number] },
    phone: String,
    email: String,
    website_url: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Shelter = mongoose.model("Shelter", ShelterSchema);


module.exports = Shelter;
