const fs = require('fs')

let contentFilePath;
function setPath(id) {
  dirpath = `./video-maker/contents/${id}/`;
  contentFilePath = dirpath + `content-a.json`;

  if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath);
    console.log(`> [state-robot] Directory ${id} created`);
  }else{
    console.log(`> [state-robot] Directory ${id} already exists`);
  }
}

function save(content, id) {
  setPath(id);
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(id) {
  setPath(id);
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  load
}
