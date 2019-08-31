module.exports = {
  makeFirstLetterUpperCase(name) {
    name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  convertToLowerCase(str) {
    return str.toLowerCase();
  }
};
