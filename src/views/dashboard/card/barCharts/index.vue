<template>
    <div class="barCharts" ref="barCharts">
        
    </div>
</template>
<script>
import * as eCharts from 'echarts'
export default {
    name:"barCharts",
    mounted(){
        const myCharts = eCharts.init(this.$refs.barCharts)
        myCharts.setOption({
            //鼠标经过出现信息提示
            tooltip: {},
            xAxis:{
                show:false,
                type:'category'
            },
            yAxis:{
                show:false
            },
            series:{
                type:'bar',
                data:[120, 200, 150, 80, 70, 110, 130]
            }
        })
    }

}
</script>
<style lang="css">
   .barCharts{
       width:100%;
       height: 100%;
   } 
</style>