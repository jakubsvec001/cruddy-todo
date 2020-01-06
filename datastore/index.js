const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + "/" + id + ".txt", text, err => {
      if (err) {
        console.log("ERROR creating file");
      }
      callback(null, { id, text });
    });
  });
};

exports.readAll = callback => {
  fs.readdir(exports.dataDir, (err, items) => {
    let res = [];
    if (items.length === 0) {
      callback(null, res);
    } else {
      for (let i = 0; i < items.length; i++) {
        let filename = items[i];
        let last = i === items.length - 1;
        let id = filename.slice(0, 5);
        fs.readFile(exports.dataDir + "/" + filename, (err, data) => {
          if (err) {
            throw err;
          }
          res.push({ id, text: id });
          // res.push({ id, text: data.toString() });
          if (last) {
            callback(null, res);
          }
        });
      }
    }
  });
};
// return { id, text };
// var data = _.map(items, (text, id) => {
//   return { id, text };
// });
// callback(null, data);

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
