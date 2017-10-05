<template>
  <v-app dark>
    <main class="main">
      <v-toolbar dark class="primary draggable">

        <div v-if="isConnected && !connectionFailed" >
          <v-btn disabled icon class="non-draggable" >
            <v-icon large>bluetooth_connected</v-icon>
          </v-btn>
          <span class="toolbar-text">Connected</span>
        </div>

        <v-progress-circular v-if="!isConnected && !connectionFailed" indeterminate v-bind:size="50"></v-progress-circular>
        <span v-if="!isConnected && !connectionFailed" class="toolbar-text">Connecting...</span>

        <div v-if="connectionFailed" >
          <v-btn icon class="non-draggable" @click.stop="reconnect">
            <v-icon large>bluetooth_searching</v-icon>
          </v-btn>
          <span class="toolbar-text">Connection Failed, Reconnect</span>
        </div>

        <v-spacer/>
        <v-btn icon @click.stop="minimize" class="non-draggable">
          <v-icon large>remove</v-icon>
        </v-btn>
        <v-btn icon @click.stop="dialog = true" class="non-draggable">
          <v-icon large>clear</v-icon>
        </v-btn>
      </v-toolbar>
      <content class="content">
        <router-view @exit="dialog = true"></router-view>
      </content>
    </main>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Exit Application?</v-card-title>
        <v-card-text>All unsaved work will be lost</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" flat="flat" @click.native="dialog = false">No</v-btn>
          <v-btn class="primary"  @click.native="exitApplication">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      dialog: false,
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      isConnected: false,
      connectionFailed: false
    }
  },
  methods: {
    ...mapActions([
      'initializeDbData'
    ]),
    exitApplication () {
      ipcRenderer.send('exit-from-ui')
    },
    updateInterval () {
      return setInterval(() => {
        ipcRenderer.send('request-data')
      }, 1000 / 60)
    },
    minimize () {
      ipcRenderer.send('minimize-from-ui')
    },
    reconnect () {
      ipcRenderer.send('retry-serial-connection')
    }
  },
  created () {
    this.updateInterval()
    ipcRenderer.send('request-db-data')
    ipcRenderer.send('get-connection-status')

    ipcRenderer.on('response-db-data', (events, args) => {
      this.initializeDbData(args)
    })
    ipcRenderer.on('response-data', (event, arg) => {
      this.data = arg.data.slice(0)
      this.isConnected = arg.isConnected
    })
    ipcRenderer.on('connection-failed', (events, args) => {
      this.connectionFailed = true
    })
    ipcRenderer.on('connection-status', (events, args) => {
      this.connectionFailed = args
    })
  },
  beforeDestroy () {
    clearInterval(this.updateInterval)
    ipcRenderer.send('disconnect-serial')
  }
}
</script>

<style lang="stylus">
  @import './assets/stylus/main.styl'
</style>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
::-webkit-scrollbar {
  display: none;
}
main, html, body {
  margin: 0px !important;
  padding: 0px !important;
}
.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.toolbar-text {
  font-weight: light;
  font-size: 20px;
  text-align: center;
  vertical-align: middle;
}
.menu-text {
  font-weight: bold;
  font-size: 25px;
  line-height: 1px;
}
.draggable{
  -webkit-app-region: drag;
}
.non-draggable{
  -webkit-app-region: no-drag;
}
</style>