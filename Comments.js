import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId: Number,
    id: Number,
    name: String,
    email: String,
    body: String
},{
    timestamps: true
}
)

export default mongoose.model('Comment', CommentSchema)
 
