<template>
  <div class="settings-content">

    <div>
      <v-btn fab class="primary" to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <span class="toolbar-text">Back to Main Menu</span>
    </div>

    <div style="flex: 1; margin: 10px;">
      <v-tabs dark>
        <v-tabs-bar>
          <v-tabs-item class="subheading font-heavy" key="io" href="#io">Input/Ouput</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="settings" href="#settings">Settings</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="tests" href="#tests">Tests</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="directions" href="#directions">Directions</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="force" href="#force">Force</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="displacement" href="#displacement">Displacement</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="motors" href="#motors">Motors</v-tabs-item>
          <v-tabs-item class="subheading font-heavy" key="limits" href="#limits">Limits</v-tabs-item>
          <v-tabs-slider class="yellow"></v-tabs-slider>
        </v-tabs-bar>
        <div class="mt-4"></div>
        <v-tabs-items style="flex: 1;">
          <v-tabs-content class="body-2" key="io" id="io">
            <v-flex xs12>
              <v-card color="purple" class="white--text">
                <v-card-title color="secondary" class="title">Inputs Channels</v-card-title>
                <v-layout row>
                  <div class="input-container">
                    <div class="subheading">0</div>
                    <div class="caption">HX711-A</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[0]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">1</div>
                    <div class="caption">HX711-B</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[1]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">2</div>
                    <div class="caption">ADC-1</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[2]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">3</div>
                    <div class="caption">ADC-2</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[3]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">4</div>
                    <div class="caption">ADC-3</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[4]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">5</div>
                    <div class="caption">PROXY</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[5]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">6</div>
                    <div class="caption">LIMIT-1</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[6]}}</div>
                  </div>
                  <div class="input-container">
                    <div class="subheading">7</div>
                    <div class="caption">LIMIT-2</div>
                    <div class="mb-1"></div>
                    <div class="title">{{data[7]}}</div>
                  </div>
                </v-layout>
                <v-card-actions>
                </v-card-actions>
              </v-card>
            </v-flex>
            <div class="mt-3"></div>
            <v-flex xs12>
              <v-card color="purple" class="white--text">
                <v-card-title color="secondary" class="title">Output Channels</v-card-title>
                <v-layout row wrap>
                    <div class="ml-2"></div>
                    <v-text-field v-model="out.pwm1" class="no-margin" label="0 - PWM1" type="number" min="0" max="16000">
                    </v-text-field>
                    <div class="ml-2"></div>
                    <v-text-field v-model="out.pwm2" class="no-margin" label="1 - PWM2" type="number" min="0" max="16000" >
                    </v-text-field>
                    <div class="ml-2"></div>
                    <v-checkbox v-model="out.ssr1" label="2 - SSR1"></v-checkbox>
                    <div class="ml-2"></div>
                    <v-checkbox v-model="out.ssr2" label="3 - SSR2"></v-checkbox>
                    <div class="ml-2"></div>
                    <v-checkbox v-model="out.mchr" label="4 - MCHR"></v-checkbox>
                    <div class="ml-2"></div>
                    <v-checkbox v-model="out.pwrs" label="5 - PWRS"></v-checkbox>
                    <div class="ml-2"></div>
                    <v-checkbox v-model="out.rstp" label="6 - RSTP"></v-checkbox>
                    <div class="ml-2"></div>
                    <!-- <v-checkbox v-model="out.setra" label="7 - SETRA"></v-checkbox>
                    <div class="ml-2"></div>
                    <v-text-field v-model="out.chra" class="no-margin" label="8 - CHRA" type="number" min="0" max="4">
                    </v-text-field>
                    <div class="ml-2"></div>
                    <v-text-field v-model="out.ravalue" class="no-margin" label="9 - RAVALUE" type="number" min="1" max="64">
                    </v-text-field>
                    <div class="ml-2"></div> -->
                  </v-layout>
                <v-card-actions>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-tabs-content>
          <v-tabs-content class="body-2" key="settings" id="settings">

            <v-layout row v-for="setting in dbData.settings" :key="`setting_${setting.id}`">
              <div class="ml-2"></div>
              <v-select v-model="setting.machine_type" :items="machineTypes" label="Machine Type"></v-select>
              <div class="ml-2"></div>
              <v-select v-model="setting.mechanical_type":items="mechanicalTypes" label="Mechanical Type"></v-select>
              <div class="ml-2"></div>
              <v-select v-model="setting.comm_type" :items="commTypes" label="Comm Type"></v-select>
              <div class="ml-2"></div>
              <v-select v-model="setting.test_direction" :items="directions" label="Test Direction"></v-select>
              <div class="ml-2"></div>
              <v-text-field v-model="setting.comm_port" label="Comm Port"></v-text-field>
              <div class="ml-2"></div>
              <v-select v-model="setting.comm_baud_rate" :items="baudRates" label="Baud Rate"></v-select>
              <div class="ml-2"></div>
              <v-checkbox v-model="setting.active" label="Active"></v-checkbox>
              <div class="ml-2"></div>
            </v-layout>
          </v-tabs-content>
          <v-tabs-content class="body-2" key="tests" id="tests">Tests</v-tabs-content>
          <v-tabs-content class="body-2" key="directions" id="directions">Directions</v-tabs-content>
          <v-tabs-content class="body-2" key="force" id="force">Force</v-tabs-content>
          <v-tabs-content class="body-2" key="displacement" id="displacement">Displacement</v-tabs-content>
          <v-tabs-content class="body-2" key="motors" id="motors">Motors</v-tabs-content>
          <v-tabs-content class="body-2" key="limits" id="limits">Limits</v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Settings',
  data () {
    return {
      dataCollectionTimer: null,
      sendOutputTimer: null,
      data: [],
      dbData: {},
      machineTypes: [
        'C.B.R.',
        'Dynamic Creep',
        'Static Creep',
        'Cube Press'
      ],
      mechanicalTypes: [
        'Chain Driven',
        'Hydraulic'
      ],
      commTypes: [
        'Bluetooth Serial',
        'USB Serial'
      ],
      directions: [
        'Up',
        'Down'
      ],
      baudRates: [
        9600,
        57600,
        115200
      ],
      outDefault: {
        pwm1: 0,
        pwm2: 0,
        ssr1: false,
        ssr2: false,
        mchr: false,
        pwrs: false,
        rstp: false,
        setra: false,
        chra: 0,
        ravalue: 1
      },
      out: {}
    }
  },
  methods: {
    createOutput () {
      let outputs = Buffer.alloc(13)
      outputs[0] = 0x63
      outputs[1] = this.out.pwm1 >> 8
      outputs[2] = this.out.pwm1
      outputs[3] = this.out.pwm2 >> 8
      outputs[4] = this.out.pwm2
      outputs[5] = this.out.ssr1 ? 1 : 0
      outputs[6] = this.out.ssr2 ? 1 : 0
      outputs[7] = this.out.mchr ? 1 : 0
      outputs[8] = this.out.pwrs ? 1 : 0
      outputs[10] = this.out.rstp ? 1 : 0
      outputs[9] = this.out.setra ? 1 : 0
      outputs[11] = this.out.chra
      outputs[12] = this.out.ravalue
      return outputs
    }
  },
  mounted () {
    this.dbData = JSON.parse(JSON.stringify(this.$store.state.DbData.data))
    Object.assign(this.out, this.outDefault)
    ipcRenderer.on('response-data', (event, arg) => {
      this.data = arg.data.slice(0)
    })
    this.dataCollectionTimer = setInterval(() => {
      ipcRenderer.send('request-data')
    }, 1000 / 30)
    this.sendOutputTimer = setInterval(() => {
      let outputs = this.createOutput()
      ipcRenderer.send('settings-output', outputs)
    }, 1000 / 10)
  },
  beforeDestroy () {
    if (this.dataCollectionTimer) {
      clearInterval(this.dataCollectionTimer)
    }
    if (this.sendOutputTimer) {
      clearInterval(this.sendOutputTimer)
    }
    Object.assign(this.out, this.outDefault)
    let outputs = this.createOutput()
    ipcRenderer.send('settings-output', outputs)
  }
}
</script>

<style scoped>
.settings-content {
	flex: 1;
	display: flex;
	flex-direction: column;
  overflow: auto;
}
.input-container{
flex: 1; display: flex;flex-direction: column;
align-items: center;
}
.no-margin{
  margin: 0px;
}
.font-heavy{
  font-weight: bold;
}
</style>
