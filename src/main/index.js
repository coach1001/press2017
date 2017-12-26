'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import SerialPort from 'serialport'
import sqlite3 from 'sqlite3'
import path from 'path'
import { setTimeout } from 'timers'

let port
let ByteLength = SerialPort.parsers.ByteLength
let parser

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
  directionChannels: [],
  activeSettings: {}
}

let outputs = Buffer.alloc(13)
outputs[0] = 0x63
let inputs = [0, 0, 0, 0, 0, 0, 0, 0]
let isConnected = false
let connectionFailed = false
let connectionRetries = 0
let mainWindow
let db

if (process.env.NODE_ENV !== 'development') {
  db = new sqlite3.Database('press_new.db')
} else {
  db = new sqlite3.Database(path.join(__static, 'press_new.db'))
}

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
  port.close(() => {
    mainWindow.close()
  })
})

ipcMain.on('settings-output', (event, args) => {
  outputs = args
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
    height: 900,
    useContentSize: true,
    width: 1200,
    center: true
  }
  : {
    height: 800,
    useContentSize: true,
    width: 1300,
    frame: false,
    center: true
  }

function initialize () {
  db.serialize(function () {
    db.each('SELECT * FROM tests WHERE active=1', function (err, row) {
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
    db.each('SELECT * FROM settings WHERE active=1 LIMIT 1', function (err, row) {
      if (err) {
        console.log(err)
      }
      dbData.activeSettings = row
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
      dbData.runs(row)
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
  db.close(() => {
    port = new SerialPort(dbData.activeSettings.comm_port, { autoOpen: false })
    port.on('open', () => {
      port.read(null, 0, 1000)
      port.flush(() => {
        parser = port.pipe(new ByteLength({ length: 26 }))
        parser.on('data', (data) => {
          inputs[0] = data.readUInt32BE(0)
          inputs[1] = data.readUInt32BE(4)
          inputs[2] = data.readUInt32BE(8)
          inputs[3] = data.readUInt32BE(12)
          inputs[4] = data.readUInt32BE(16)
          inputs[5] = data.readUInt32BE(20)
          inputs[6] = data.readUInt8(24)
          inputs[7] = data.readUInt8(25)
          isConnected = true
          port.write(outputs)
        })
        setTimeout(() => {
          isConnected = true
          port.write(outputs)
        }, 2000)
      })
    })
    mainWindow = new BrowserWindow(mainWindowOptions)
    mainWindow.loadURL(winURL)
    mainWindow.on('closed', () => {
      port.close(() => {
        mainWindow = null
      })
    })
    openPort()
  })
}
function createWindow () {
  initialize()
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
