const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback('Error could not get nextID:');
    }
    var newFile = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newFile, text, (err) => {
      if (err) {
        callback('could not write text');
      } else {
        callback(null, {id, text});
      }
    });
  });

};

exports.readAll = (callback) => {

  var todoList = [];

  fs.readdirAsync(exports.dataDir)
    .then((files) => (
      Promise.all(
        files.map((file) => {
          var currentId = path.basename(file, '.txt');
          var currentPath = path.join(exports.dataDir, file);
          return fs.readFileAsync(currentPath, 'utf8')
            .then((text) => {
              todoList.push({id: currentId, text: text});
            });
        })
      ).then(() => {
        callback(null, todoList);
      })
    ));

};

exports.readOne = (id, callback) => {
  //  var currentPath = path.join(exports.dataDir, `${id}.txt`);
  var currentPath = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(currentPath, 'utf8', (err, text) => {
    if (err) {
      callback('cannot read file');
    } else {
      callback(null, {id: id, text: text});
    }
  });
};

exports.update = (id, text, callback) => {
  //create current path
  var currentPath = path.join(exports.dataDir, `${id}.txt`);
  //read the file for update
  fs.readFile(currentPath, (err, currentText) => {
    if (err) {
      callback('Could not access file');
    } else {
      //use fs.writeFile to update the data
      fs.writeFile(currentPath, text, (error) => {
        if (error) {
          throw ('Could not update file');
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
// find the current path for the file to delete with id
  var currentPath = path.join(exports.dataDir, `${id}.txt`);
// use fs.readfile
  fs.readFile(currentPath, (err, text) => {
    if (err) {
      callback('Could not find file');
    } else {
      fs.unlink(currentPath, (error) => {
        if (error) {
          callback('Could not delete file');
        } else {
          callback(null);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
