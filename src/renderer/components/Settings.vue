<template>
  <div class="settings-content">

    <div>
      <v-btn fab class="primary" to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <span class="toolbar-text">Back to Main Menu</span>
    </div>

    <div style="flex: 1; margin: 10px;">
      <v-tabs dark v-model="active">
        <v-tabs-bar>
          <v-tabs-item
            v-for="tab in tabs"
            :key="tab"
            :href="'#' + tab"
            ripple

          >
            Item {{ tab.slice(-1) }}
          </v-tabs-item>
          <v-tabs-slider class="yellow"></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items style="flex: 1;">
          <v-tabs-content
            v-for="tab in tabs"
            :key="tab"
            :id="tab"
          >
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      tabs: ['tab-1', 'tab-2', 'tab-3'],
      active: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
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
</style>
