// MonthlyIncome.js
import { Line, mixins } from 'vue-chartjs'

export default Line.extend({
  name: 'line-chart',
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
