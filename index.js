var fs = require('fs');
var path = require('path');

var TotoroClient = require('totoro');
var TotoroReport = require('./lib/report');

var shelljs = require('shelljs');

var env = process.env;
var tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/totorox');
var tempTestDir = path.join(tempDir, 'tests');

shelljs.mkdir('-p', tempTestDir);

// console.info('create temp test dir:', tempTestDir)
exports.run = function(codes, opts) {
  var scripts = [];

  codes.split(',').forEach(function(code) {
    if (/\.js$/.test(code)) {
      scripts.push('<script src="' + code + '"></script>');
      shelljs.cp('-Rf', code, tempTestDir);
    } else {
      scripts.push('<script>console.log(' + code + ')</script>' );
    }
  });

  var runner = fs.readFileSync(path.join(path.dirname(module.filename), 'template/runner.html')) + '';

  runner = runner.slice(0, runner.indexOf('<body>') + 6) + scripts.join('') +
            runner.slice(runner.indexOf('<body>') + 6);

  fs.writeFileSync(path.join(tempTestDir, 'runner.html'), runner);

  runTotoro(opts);
};

function runTotoro(opts) {
  if (opts.v || opts.version) {
    var mainConfig = require('./package.json');
    var totoroConfig = require('./node_modules/totoro/package.json');

    console.info('totorox vesion: ' + mainConfig.version);
    console.info('totoro vesion: ' + totoroConfig.version);
    return;
  }
  opts.runner = path.join(tempTestDir, 'runner.html');
  opts.repo = 'totorox';
  opts.report = function() {
    TotoroReport.apply(null, arguments);
  };
  /**
  var write = process.stdout.write
  process.stdout.write = function() {
      write.apply(process.stdout, [].slice(arguments, 0))
  }
  **/
  new TotoroClient(opts);
}
