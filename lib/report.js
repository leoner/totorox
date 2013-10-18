'use strict';

var util = require('util')
var colorful = require('colorful')

// default reporter
module.exports = function(labors) {
    // pull all failed labors to tail of rankedLabors
    // to make sure that user can see all failures by minimal scrolling
    var rankedLabors = []
    var failedLaborsAmount = 0
    Object.keys(labors).sort().reverse().forEach(function(browser) {
        var labor = labors[browser]
        if (!labor || !labor.stats || labor.stats.failures || labor.stats.error) {
            rankedLabors.push([browser, labor, 'red'])
            failedLaborsAmount++
        } else {
            rankedLabors.unshift([browser, labor, 'green'])
        }
    })
    var laborsAmount = rankedLabors.length

    rankedLabors.forEach(function(item) {
        println()
        var browser = item[0]
        var labor = item[1]
        var color = item[2]

        if (labor) {

            println('  ' + labor.ua, color)

            if (labor.stats) {
                // stats1: error
                if (labor.stats.error) {
                    var error = labor.stats.error

                    if (error.url) {
                        var match = error.url.match(/runner\/.+?\/(.+)$/)
                        /*
                         * NOTE
                         *
                         * in safari on Windows 7（may because it dose not enable debugging tool）
                         * sometimes window.onerror handler may receives incorrect args
                         */
                        if (match) {
                            var p = match[1]
                            println('  An error occurred at: ' + p + ' [line ' + error.line + ']', color)
                            println('    ' + error.message, color)
                        } else {
                            println('  An unknown error occurred', color)
                        }

                    } else {
                        println('    ' + error.message, color)
                    }
                }

                // custom logs
                if (labor.customLogs) {
                    labor.customLogs.forEach(function(log) {
                        log = log.map(function(arg) {
                            return util.inspect(arg)
                        })
                        println('    > ' + log.join(' '), 'gray')
                    })
                }

            // stats3: client timeout
            } else {
                println('  Timeout', color)
            }

        // stats4: not found matched browser
        } else {
            println('  ' + browser, color)
            println('  Not found matched browser', color)
        }

    })
    println()
}


function print(str, c) {
    str = str || ''
    str = c ? colorful[c](str) : str
    process.stdout.write(str)
}


function println(str, c) {
    print(str, c)
    process.stdout.write('\n')
}
