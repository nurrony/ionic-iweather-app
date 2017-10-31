// New copy task for font files
module.exports = {
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/open-weather-icons/fonts/**/*'],
    dest: '{{WWW}}/fonts'
  }
};
