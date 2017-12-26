<template>
  <div class="test-select">

    <div>
      <v-btn fab class="primary" to="/">
        <v-icon >arrow_back</v-icon>
      </v-btn>
      <span class="toolbar-text">Back to Main Menu</span>
    </div>

    <div class="test-select-body">

      <div class="test-select-table-scroll">
        <v-btn @click="scrollTableUp" fab small class="secondary">
          <v-icon >arrow_drop_up</v-icon>
        </v-btn>
        <div style="flex: 1;">
        </div>
        <v-btn @click="scrollTableDown" fab small class="secondary">
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </div>

      <div class="test-select-table" ref="scrollTable">
        <v-list two-line>
          <template v-for="(item, index) in tests">
            <v-list-tile
              ripple
              @click="rowClicked(item)"
              :key="item.name"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.rate_value }} {{ item.rate_type }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index + 1 < tests.length" :key="item.name"></v-divider>
          </template>
        </v-list>
      </div>

      <v-layout class="test-select-form">
        <v-flex>
          <v-card style="padding-bottom:10px;">
            <v-form v-model="valid" ref="form" class="test-select-form-card" lazy-validation>

              <v-card-title style="padding:0px;">
                <h6 class="subheading mb-0" style="margin-top:15px;">{{selectedTest.name}}</h6>
              </v-card-title>
              <v-text-field
                style=""
                label="Sample Number"
                v-model="sampleNumber"
                prepend-icon="assignment"
                :disabled="!selectedTest.name"
                :rules="sampleNumberRules"
                required
              ></v-text-field>
              <div style="display:flex;flex-direction:row;">
                <v-dialog
                  persistent
                  v-model="modal"
                  lazy
                  full-width
                >
                  <v-text-field
                    slot="activator"
                    label="Date of Test"
                    v-model="testDate"
                    prepend-icon="event"
                    readonly
                    :rules="testDateRules"
                    required
                    :disabled="!selectedTest.name"
                  ></v-text-field>
                  <v-date-picker v-model="testDate" scrollable actions dark>
                    <template scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click="cancel">Cancel</v-btn>
                        <v-btn primary @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-dialog>
                <div class="ml-3"/>
                <v-dialog
                  persistent
                  v-model="modal2"
                  lazy
                  full-width
                >
                  <v-text-field
                    slot="activator"
                    label="Time of Test"
                    v-model="testTime"
                    prepend-icon="access_time"
                    readonly
                    required
                    :rules="testTimeRules"
                    :disabled="!selectedTest.name"
                  ></v-text-field>
                  <v-time-picker v-model="testTime" actions dark>
                    <template scope="{ save, cancel }">
                      <v-card-actions>
                        <v-btn flat @click="cancel">Cancel</v-btn>
                        <v-btn primary @click="save">Save</v-btn>
                      </v-card-actions>
                    </template>
                  </v-time-picker>
                </v-dialog>
              </div>

              <v-card-title style="padding:0px;" v-if="selectedTest.name">
                <h6 class="subheading mb-3 mt-1">Settings</h6>
              </v-card-title>
              <div style="display:flex;flex-direction:row;" v-if="selectedTest.name === 'Dynamic Creep'">
                <v-text-field
                    type="number"
                    label="Blow Rate (Hz)"
                    step=0.5
                    min=0.5
                    max=5
                    v-model="selectedTest.rate_value"
                  ></v-text-field>
                <div class="ml-2"/>
                <v-text-field
                    type="number"
                    label="Condition Blows"
                    step=1
                    min=20
                    v-model="selectedTest.conditioning_blows"
                  ></v-text-field>
                <div class="ml-2"/>
                <v-text-field
                    type="number"
                    label="Blow Force (kN)"
                    id="test"
                    step=0.1
                    min=1
                    v-model="selectedTest.blow_force"
                ></v-text-field>
              </div>

              <v-card-title style="padding:0px;" v-if="selectedTest.name">
                <h6 class="subheading mb-3 mt-1">Limits</h6>
              </v-card-title>
              <div style="display:flex;flex-direction:row;">
                <div class="mr-2" v-for="testLimit in testLimits" :key="`limit_${testLimit.id}`">
                  <v-text-field
                      type="number"
                      :label="testLimit.limit_type"
                      step=1
                      min=0.1
                      :enabled="testLimit.editable"
                      v-model="testLimit.limit_value"
                  ></v-text-field>
                </div>
              </div>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </div>

    <div class="test-select-buttons">
      <div>
        <v-btn fab large class="primary" @click.stop="rise">
          <v-icon large>file_upload</v-icon>
        </v-btn>
        <span class="toolbar-text">Raise Piston</span>
      </div>
      <div>
        <v-btn fab large class="primary" @click.stop="drop">
          <v-icon large>file_download</v-icon>
        </v-btn>
        <span class="toolbar-text">Drop Piston</span>
      </div>
      <div>
        <v-btn fab large class="primary" @click.stop="clear">
          <v-icon large>sync</v-icon>
        </v-btn>
        <span class="toolbar-text">Reset Form</span>
      </div>

      <div>
        <v-btn :disabled="!valid" fab large class="primary" @click.stop="submit">
          <v-icon large>play_arrow</v-icon>
        </v-btn>
        <span class="toolbar-text">Run Test</span>
      </div>
    </div>

    <v-dialog v-model="dialog" fullscreen>
      <div @click.stop="stop" class="dialog-full">
        <v-progress-circular
          indeterminate :size="200"
          :width="2" class="primary--text progress-center">
          {{dialogMessage}}
        </v-progress-circular>
      </div>
    </v-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SelectTest',
  data () {
    return {
      dialogMessage: '',
      dialog: false,
      valid: false,
      valid2: false,
      name: '',
      selectedTest: {},
      testLimits: [],
      sampleNumber: '',
      testDate: null,
      testTime: null,
      modal: false,
      modal2: false,
      sampleNumberRules: [
        (v) => !!v || 'Sample Number is Required'
      ],
      testDateRules: [
        (v) => !!v || 'Test Date is Required'
      ],
      testTimeRules: [
        (v) => !!v || 'Test Date is Required'
      ],
      headers: [
        {
          text: 'Test',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Rate Type', value: 'rate_type' },
        { text: 'Rate Value', value: 'rate_value' }
      ]
    }
  },
  computed: {
    ...mapState({
      tests: state => state.DbData.data.tests,
      limits: state => state.DbData.data.testLimits
    })
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // this.$refs.form.$el.submit()
      }
    },
    clear () {
      this.selectedTest = {}
      this.$refs.form.reset()
    },
    scrollTableUp () {
      this.$refs.scrollTable.scrollTop -= 25
    },
    scrollTableDown () {
      this.$refs.scrollTable.scrollTop += 25
    },
    rise () {
      this.dialogMessage = 'Piston Rising'
      this.dialog = true
    },
    drop () {
      this.dialogMessage = 'Piston Dropping'
      this.dialog = true
    },
    stop () {
      this.dialog = false
    },
    rowClicked (row) {
      this.selectedTest = row
      this.testLimits = []
      this.limits.map((limit) => {
        if (row.id === limit.test) {
          this.testLimits.push(limit)
        }
      })
      console.log(this.testLimits)
    }
  },
  created () {
  }
}
</script>

<style scoped>

.test-select {
	flex: 1;
	display: flex;
	flex-direction: column;
  overflow: auto;
}
.test-select-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 5px;
}
.test-select-body {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  height:0px;
}
.test-select-table {
  flex: 15;
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: auto;
}
.test-select-form {
  flex: 11;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-left: 0px;
  margin-top: 20px;
  height: 100%;
}
.test-select-form-card {
  margin-left: 20px;
  margin-right: 20px;
}
.test-select-table-scroll {
  flex: 1;
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.dialog-full {
  height:100%;
  width:100%;
  background-color: rgba(48, 48, 48, 0.8)
}
.progress-center {
  position: absolute
  ;top:calc(50% - 100px);
  left:calc(50% - 100px);
}

</style>
