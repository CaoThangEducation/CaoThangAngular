const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/testAngularckc";

class MongoDB {
  constructor() {
    this.conDb = null;
    this.dbClose = null;
  }

  async connectDB() {
    let dbName = "testAngularckc";
    try {
      if (!this.dbClose) {
        const connectRs = await MongoClient.connect(url, {
          useUnifiedTopology: true,
        });
        this.conDb = connectRs.db(dbName);
        this.dbClose = connectRs;
        return this.conDb;
      }
    } catch (ex) {
      console.log("connect error db", ex);
      throw ex;
    }
  }

  async updateOrInsertOne(key, data, collectionName, callback) {
    // console.log('key', key);
    // console.log('data', data);
    let result = false;
    try {
      await this.connectDB();
      if (!collectionName || !collectionName.length) {
        collectionName = this.collectionName;
      }
      result = await this.conDb
        .collection(collectionName)
        .updateOne(key, { $set: data }, { upsert: true });
      await this.closeDB();
    } catch (error) {
      console.log("error: ", error.message);
      await this.closeDB();
    }
    return result;
  }

  async closeDB() {
    if (this.dbClose) {
      await this.dbClose.close();
      this.dbClose = null;
    }
  }

  async getAll() {
    let result = false;
    try {
      await this.connectDB();
      result = await this.conDb
        .collection(this.collectionName)
        .find({})
        .toArray();
      await this.closeDB();
    } catch (error) {
      console.log("errrr.......", error.message);
      await this.closeDB();
    }
    return result;
  }

  async find(options) {
    let result = false;
    try {
      await this.connectDB();
      result = await this.conDb
        .collection(this.collectionName)
        .find(options)
        .toArray();
      await this.closeDB();
    } catch (error) {
      console.log("errrr.......", error.message);
      await this.closeDB();
    }
    return result;
  }
}

module.exports = MongoDB;
