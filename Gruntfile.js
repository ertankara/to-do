module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'lib/*.js'
        ],
        dest: 'production-js-code/concatinated.js'
      }
    },

    uglify: {
      build: {
        src: 'production-js-code/concatinated.js',
        dest: 'production-js-code/production.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'uglify']);
}