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
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.rate_type }}</td>
            <td class="text-xs-right">{{ props.item.rate_value }}</td>
          </template>
        </v-data-table>
      </div>

      <div class="test-select-form">
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="Name"
            v-model="name"
            :rules="nameRules"
            :counter="10"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-select
            label="Item"
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            required
          ></v-select>
          <v-checkbox
            label="Do you agree?"
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            required
          ></v-checkbox>

          <v-btn @click="submit" :class="{ green: valid, red: !valid }">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
      </div>
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
        <v-btn fab large class="primary">
          <v-icon large>sync</v-icon>
        </v-btn>
        <span class="toolbar-text">Reset Form</span>
      </div>

      <div>
        <v-btn fab large class="primary">
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
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false,
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
  computed: mapState({
    tests: state => state.DbData.data.tests
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$refs.form.$el.submit()
      }
    },
    clear () {
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
    }
  },
  created () {
    console.log(this.tests)
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
  margin-right: 35px;
  margin-left: 5px;
}
.test-select-table-scroll {
  flex: 1;
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
</style>
