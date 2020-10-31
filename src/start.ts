import MyServer from "./server";
import { connect } from "mongoose";

const server = new MyServer();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.3epbj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => server.start(5000))
  .catch((error) => {
    throw error;
  });
