'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import SerialPort from 'serialport'
const ByteLength = SerialPort.parsers.ByteLength

let port = new SerialPort('COM7', { autoOpen: false })
let parser = port.pipe(new ByteLength({ length: 26 }))
let mainWindow

let buffer = Buffer.alloc(13)
let inputs = [0, 0, 0, 0, 0, 0, 0, 0]

buffer[0] = 0x63

port.on('open', function () {
  console.log('Port Opened...')
  setTimeout(function () {
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
      console.log(err)
      openPort()
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

ipcMain.on('disconnect-serial', function () {
  port.close()
  console.log('Port Closed...')
})

ipcMain.on('exit-from-ui', function () {
  app.quit()
})

ipcMain.on('request-data', function (event, args) {
  event.sender.send('response-data', {
    data: inputs
  })
})

ipcMain.on('check-connection', function (event, args) {
  event.sender.send('response-connection', {
    connected: port.isOpen
  })
})

ipcMain.on('minimize-from-ui', function () {
  mainWindow.minimize()
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

function createWindow () {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow(mainWindowOptions)

  mainWindow.loadURL(winURL)

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
