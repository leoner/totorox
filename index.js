var fs = require('fs')
var path = require('path')

var TotoroClient = require('totoro')
var TotoroReport = require('./lib/report')

require('shelljs/global')

var env = process.env
var tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/totorox')
var tempTestDir = path.join(tempDir, 'tests')

mkdir('-p', tempTestDir)

// console.info('create temp test dir:', tempTestDir)
exports.run = function(codes) {
    var scripts = []

    codes.split(',').forEach(function(code) {
        if (/\.js$/.test(code)) {
            scripts.push('<script src="' + code + '"></script>')
            cp('-Rf', code, tempTestDir)
        } else {
            scripts.push('<script>console.log(' + code + ')</script>' )
        }
    })

    var runner = fs.readFileSync(path.join(path.dirname(module.filename), 'template/runner.html')) + ''

    runner = runner.slice(0, runner.indexOf('<body>') + 6) + scripts.join('') +
             runner.slice(runner.indexOf('<body>') + 6)

    fs.writeFileSync(path.join(tempTestDir, 'runner.html'), runner)

    runTotoro()
}

function runTotoro() {
    var write = process.stdout.write

    /**
    process.stdout.write = function() {
        write.apply(process.stdout, [].slice(arguments, 0))
    }
    **/
    new TotoroClient({
      runner: path.join(tempTestDir, 'runner.html'),
      report: function() {
        TotoroReport.apply(null, arguments)
      }
    })
}
