<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix box-header" style="height:55px">
                <div class="title">
                    <span>销售额类别占比</span>
                    <el-radio-group v-model="radio" size="small">
                        <el-radio-button label="全部渠道"></el-radio-button>
                        <el-radio-button label="线上"></el-radio-button>
                        <el-radio-button label="门店"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div ref="pieCharts" class="pieCharts">

            </div>
        </el-card>
    </div>
</template>
<script>
import * as eCharts from 'echarts'
export default {
    name: "PieIndex",
    data() {
        return {
            radio: 0
        }
    },
    mounted() {
        const myChart = eCharts.init(this.$refs.pieCharts)
        myChart.setOption({
            title: {
                text: "搜索引擎",
                subtext: 1048,
                left: 'center',
                top: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '销售占比',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: true
                    },
                    data:
                        [
                            { value: 1048, name: '搜索引擎' },
                            { value: 735, name: '直接访问' },
                            { value: 580, name: '邮件营销' },
                            { value: 484, name: '传单广告' },
                            { value: 300, name: '视频广告' }
                        ]
                }
            ]
        })
        myChart.on('mousemove', params => {
            // 控制台打印数据的名称
            const { name, value } = params.data
            myChart.setOption({
                title: {
                    text: name,
                    subtext: value
                }
            })
        });
    }

}
</script>
<style lang="css" scoped>
::v-deep .el-card__header {
    padding: 0;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    height: 100%;
    padding: 0 20px;
}

.pieCharts {
    width: 100%;
    height: 335px;
}
</style>