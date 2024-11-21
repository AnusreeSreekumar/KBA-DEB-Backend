import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    dbBookName: { type: String, required: true, unique: true },
    dbAuthorName: { type: String, required: true },
    dbDescription: { type: String, required: true },
    dbGenre: { type: String, required: true },
    dbLanguage: { type: String, required: true },
});

const Books = mongoose.model('Bookdetails', bookSchema);

export {Books}