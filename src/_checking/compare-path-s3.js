

module.exports = (path1, path2) => {
  const item1 = path1.split('/').filter(i => i) //remove empty string
  const item2 = path2.split('/').filter(i => i) //remove empty string
  console.log({item1, item2})
  for (const i in item1) {
    if(item1[i] !== item2[i]) return false;
  }

  return true;
}