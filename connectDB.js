import mongoose from "mongoose";

const ConnectDataBase = async () => {
  await mongoose
    .connect("mongodb://0.0.0.0:27017/CommentData_new",{serverSelectionTimeoutMS:5000})
    .then(() => console.log("Data base connected"))
    .catch((error) => console.log(error));
};

export default ConnectDataBase;
