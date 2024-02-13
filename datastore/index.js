const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('Error could not get nextID:');
    }
    var newFile = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newFile, text, (err) => {
      if (err) {
        throw ('could not write text');
      } else {
        callback(null, {id, text});
      }
    });
  });

};

exports.readAll = (callback) => {
  var todoList = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Cannot read data directory');
    }
    //    -  "00001.txt"
    files.map((file) => {
      var currentId = path.basename(file, '.txt');
      todoList.push({id: currentId, text: currentId});
    });
    callback(null, todoList);
  });

};

exports.readOne = (id, callback) => {

  var currentPath = `${exports.dataDir}/${id}.txt`;

  fs.readFile(currentPath, 'utf8', (err, text) => {
    if (err) {
      if (err.code === 'ENOENT') {
        callback('no file with id');
      } else {
        callback('cannot read file');
      }
    } else {
      callback(null, {id: id, text: text});
    }
  });


  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw ('Err');
  //   }
  //   files.map((file) => {
  //     if (path.basename(file, '.txt') === id) {
  //       fs.readFile(currentPath, (err, text) => {
  //         if (err) {
  //           callback('Error could not read file');
  //         }
  //         console.log(currentPath);
  //         callback(null, {id: id, text: text});
  //       });
  //     }
  //   });

// callback('Could not find file');

};



  // check if current Path exists first



  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }


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

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
