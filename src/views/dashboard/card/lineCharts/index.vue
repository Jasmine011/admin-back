<template>
    <div class="ChartsIndex" ref="charts">

    </div>
</template>
<script>
import * as eCharts from 'echarts'
export default {
    name: "ChartsIndex",
    mounted() {
        const charts = eCharts.init(this.$refs.charts)//, 'dark'
        charts.setOption({
            //鼠标经过出现信息提示
            tooltip: {},
            xAxis: {
                type: "category",
                show: false
            },
            yAxis: {
                show: false
            },
            axisLabel: {
                show: true,
                interval:0,
                rotate:40,
                textStyle: {
                    color: '#333'
                }
            },
            series: [{
                type: 'line',
                symbol:'none',//去掉拐点
                smooth:true,//true为平滑，false为z直线
                data: [22, 6, 18, 12, 25, 14, 28, 33],
                itemStyle:{
                    //折线颜色
                        color:'skyblue'
                },
                areaStyle: {
                    //折线图的颜色渐变填充
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'skyblue' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'white' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }],
            gird: {
                top: 1,
                left: 1,
                right: 1,
                bottom: 1
            }
        })
    }
}
</script>
<style lang="css">
.ChartsIndex {
    width: 100%;
    height: 100%;
}
</style>