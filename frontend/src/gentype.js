const fs = require('fs')
const path = require('path')
const Typography = require('typography')
// const theme = require('typography-theme-wordpress-2016')
// const theme = require('typography-theme-twin-peaks')
const theme = require('typography-theme-wordpress-2012')
const perfectionist = require('perfectionist')

theme.baseFontSize = '12px';
theme.headerFontFamily = ['Montserrat', 'sans-serif']
theme.bodyFontFamily = ['Montserrat', 'serif']
theme.baseLineHeight = 1.25

const typography = new Typography(theme)

const css = perfectionist.process(typography.toString())

fs.writeFileSync(path.join(__dirname, 'style.css'), css)
