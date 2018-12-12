

module.exports = (prefix, dir) => {
  const itemPrefix = prefix.split('/').filter(i => i); //remove empty string
  const itemDir = dir.split('/').filter(i => i); //remove empty string

  for (const i in itemPrefix) {
    if(itemPrefix[i] !== itemDir[i]) return false;
  }

  return true;
}