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
          <v-data-table
            v-bind:headers="headers"
            :items="tests"
            hide-actions
            class="elevation-1 fixed_headers"
          >
          <template slot="items" scope="props">
            <td @click.stop="rowClicked(props.item)" >{{ props.item.name }}</td>
            <td @click.stop="rowClicked(props.item)" class="text-xs-right">{{ props.item.rate_type }}</td>
            <td @click.stop="rowClicked(props.item)" class="text-xs-right">{{ props.item.rate_value }}</td>
          </template>
        </v-data-table>
      </div>

      <v-layout class="test-select-form">
        <v-flex>
          <v-card style="padding-bottom:10px;">
            <v-card-title style="padding-bottom:0px;">
              <h6 class="headline mb-0">{{selectedTest.name}}</h6>
            </v-card-title>
            <v-form v-model="valid" ref="form" class="test-select-form-card" lazy-validation>
              <v-text-field
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

            </v-form>
          </v-card>
        </v-flex>

        <v-flex style="margin-top:8px;" v-if="selectedTest.name === 'Dynamic Creep'">
          <v-card style="padding-bottom:10px;">
            <v-card-title style="padding-bottom:0px;">
              <h4 class="headline mb-0">Settings</h4>
            </v-card-title>
            <v-form v-model="valid2" ref="form1" class="test-select-form-card" lazy-validation>
              <div style="display:flex;flex-direction:row;">
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
            </v-form>
          </v-card>
        </v-flex>

        <v-flex style="margin-top:8px;" v-if="selectedTest.name">
          <v-card style="padding-bottom:10px;">
            <v-card-title style="padding-bottom:0px;">
              <h4 class="headline mb-0">Limits</h4>
            </v-card-title>
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

    <v-dialog v-model="dialog">
      <v-card style="text-align: center;">
        <v-progress-circular  indeterminate :size="150" :width="2" class="primary--text">{{dialogMessage}}</v-progress-circular>
      </v-card>
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
      name: '',
      selectedTest: {},
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
      tests: state => state.DbData.data.tests
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
    rowClicked (row) {
      this.selectedTest = row
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
</style>
