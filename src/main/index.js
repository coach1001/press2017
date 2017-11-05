'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import SerialPort from 'serialport'
import sqlite3 from 'sqlite3'
import path from 'path'

const ByteLength = SerialPort.parsers.ByteLength

let port = new SerialPort('COM7', { autoOpen: false })
let parser = port.pipe(new ByteLength({ length: 26 }))
let mainWindow
let db

if (process.env.NODE_ENV !== 'development') {
  db = new sqlite3.Database('press_new.db')
} else {
  db = new sqlite3.Database(path.join(__static, 'press_new.db'))
}

let dbData = {
  tests: [],
  testLimits: [],
  settings: [],
  runs: [],
  runSamples: [],
  motorChannels: [],
  limitChannels: [],
  forceChannels: [],
  displacementChannels: [],
  directionChannels: []
}

let buffer = Buffer.alloc(13)
let inputs = [0, 0, 0, 0, 0, 0, 0, 0]
let isConnected = false
let connectionFailed = false
let connectionRetries = 0

buffer[0] = 0x63

port.on('open', function () {
  console.log('Port Opened...')
  setTimeout(function () {
    isConnected = true
    port.write(buffer)
  }, 1000)
})

parser.on('data', function (data) {
  inputs = []
  inputs.push(data.readUInt32BE(0))
  inputs.push(data.readUInt32BE(4))
  inputs.push(data.readUInt32BE(8))
  inputs.push(data.readUInt32BE(12))
  inputs.push(data.readUInt32BE(16))
  inputs.push(data.readUInt32BE(20))
  inputs.push(data.readUInt8(24))
  inputs.push(data.readUInt8(25))
  port.write(buffer)
})

function openPort () {
  port.open(function (err) {
    if (err) {
      if (connectionRetries === 10) {
        connectionFailed = true
        mainWindow.webContents.send('connection-failed')
      } else {
        connectionRetries += 1
        setTimeout(() => {
          openPort()
        }, 500)
      }
    }
  })
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

ipcMain.on('disconnect-serial', () => {
  port.close()
  console.log('Port Closed...')
})

ipcMain.on('exit-from-ui', () => {
  app.quit()
})

ipcMain.on('request-data', (event, args) => {
  event.sender.send('response-data', {
    data: inputs,
    isConnected: isConnected
  })
})

ipcMain.on('minimize-from-ui', () => {
  mainWindow.minimize()
})

ipcMain.on('request-db-data', (event, args) => {
  event.sender.send('response-db-data', dbData)
})

ipcMain.on('get-connection-status', (event) => {
  event.sender.send('connection-status', connectionFailed)
})

ipcMain.on('retry-serial-connection', (event, args) => {
  connectionFailed = false
  mainWindow.webContents.send('connection-status', connectionFailed)
  connectionRetries = 0
  openPort()
})

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const mainWindowOptions = process.env.NODE_ENV === 'development'
  ? {
    height: 700,
    useContentSize: true,
    width: 900,
    center: true
  }
  : {
    height: 800,
    useContentSize: true,
    width: 1300,
    frame: false
  }

function initializeSettings () {
  db.serialize(function () {
    db.each('SELECT * FROM tests', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.tests.push(row)
    })
    db.each('SELECT * FROM test_limits', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.testLimits.push(row)
    })
    db.each('SELECT * FROM settings', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.settings.push(row)
    })
    db.each('SELECT * FROM runs', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.tests.runs(row)
    })
    db.each('SELECT * FROM motor_channels', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.motorChannels.push(row)
    })
    db.each('SELECT * FROM limit_channels', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.limitChannels.push(row)
    })
    db.each('SELECT * FROM force_channels', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.forceChannels.push(row)
    })
    db.each('SELECT * FROM displacement_channels', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.displacementChannels.push(row)
    })
    db.each('SELECT * FROM direction_channels', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.directionChannels.push(row)
    })
  })
  console.log('Initializing Data Completed...')
  db.close()
}

function createWindow () {
  /**
   * Initial window options
   */

  initializeSettings()
  mainWindow = new BrowserWindow(mainWindowOptions)

  mainWindow.loadURL(winURL)
  console.log('Main Windows Loaded...')
  openPort()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
