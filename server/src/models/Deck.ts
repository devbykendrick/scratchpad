// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const DeckSchema = new Schema(
//   {
//     title: String,
//     color: String,
//     header: String,
//   },
//   { timestamps: true }
// );

// const DeckModel = mongoose.model("Deck", DeckSchema);

// export default DeckModel;

import mongoose, { Schema, Document } from "mongoose";

export interface DeckDocument extends Document {
  title: string;
  color: string;
  header: string;
  user_id: string;
}

const DeckSchema = new Schema<DeckDocument>(
  {
    title: String,
    color: String,
    header: String,
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DeckModel = mongoose.model("Deck", DeckSchema);

export default DeckModel;
