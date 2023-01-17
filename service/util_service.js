const db = require('../db')
const fs = require('fs')
const path = require('path')
class UtilService {
   
   
    async deleteFolder(folderPath){
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file) => {
              const curPath = path.join(folderPath, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                
                deleteFolderRecursive(curPath);
              } else {
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(folderPath);
          }
    } 
}

module.exports = new UtilService()