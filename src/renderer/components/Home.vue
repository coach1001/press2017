<template>
      <div class="menu">
        <div>
          <v-btn fab large class="primary" to="/selecttest">
            <v-icon large>slideshow</v-icon>
          </v-btn>
          <span class="menu-text">Run Test</span>
        </div>

        <div>
          <v-btn fab large class="primary" to="/viewresults">
            <v-icon large>receipt</v-icon>
          </v-btn>
          <span class="menu-text">View Results</span>
        </div>

        <div>
          <v-btn fab large class="primary" to="/viewresults">
            <v-icon large>build</v-icon>
          </v-btn>
          <span class="menu-text">Settings</span>
        </div>

        <div class="spreader"></div>

        <div>
          <v-btn fab large class="primary" @click.stop="$emit('exit')">
            <v-icon large>clear</v-icon>
          </v-btn>
          <span class="menu-text" >Exit Application</span>
        </div>
      </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.menu{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 40%;
  margin-top: 8%;
  margin-bottom: 8%;
}
.spreader{
  flex: 1;
}
.menu-button{
  display: flex;
  flex-direction: row;
}
.menu-icon{
  flex: 1;
}
.menu-text{
  flex: 3;
}
</style>
