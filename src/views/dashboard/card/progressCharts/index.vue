<template>
    <div class="progressCharts" ref="progressCharts">
        
    </div>
</template>
<script>
import * as eCharts from 'echarts'
export default {
    name:"progressCharts",
    mounted(){
        const myCharts = eCharts.init(this.$refs.progressCharts)
        myCharts.setOption({
            //鼠标经过出现信息提示
            tooltip: {},
            xAxis:{
                show:false,
                min:0,
                max:100
            },
            yAxis:{
                show:false,
                type:'category'
            },
            series:{
                name:"运营活动效果",
                type:'bar',
                data:[73],
                barWidth:10,//柱状图宽度
                showBackground:true ,//显示背景颜色
                backgroundStyle:{
                    color:'#eee'//背景颜色
                },
                label:{
                    show:true,//是否显示文本
                    formatter:'|',//文本内容
                    position:'right'//文本标签位置
                }

            }
        })
    }

}
</script>
<style lang="css">
   .progressCharts{
       width:100%;
       height: 100%;
   } 
</style>