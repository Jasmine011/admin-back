<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!-- @tab-click="handleClick" -->
                <el-tabs v-model="activeName" class="tab" @tab-click="toSale">
                    <!-- 左侧内容 -->
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visit"></el-tab-pane>
                </el-tabs>
                <!-- 右侧 -->
                <div class="right">
                    <span @click="toDay">本日</span>
                    <span @click="toWeek">本周</span>
                    <span @click="toMonth">本月</span>
                    <span @click="toYear">本年</span>
                    <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" size="mini" class="picker" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div style="height:300px">
                <el-row>
                    <el-col :span="19">
                        <div class="charts" ref="charts"> </div>
                    </el-col>
                    <el-col :span="5">
                        <div>
                            <h4>门店{{ activeName == 'sale' ? '销售额' : '访问量' }}排名</h4>
                            <ul>
                                <li>
                                    <i class="ranking">1</i>
                                    <span class="shop">少康庙元成店</span>
                                    <span>985,4357</span>
                                </li>
                                <li>
                                    <i class="ranking">2</i>
                                    <span class="shop">太元和保康店</span>
                                    <span>685,4751</span>
                                </li>
                                <li>
                                    <i class="ranking">3</i>
                                    <span class="shop">南门口沙石店</span>
                                    <span>556,4538</span>
                                </li>
                                <li>
                                    <i class="ranking">4</i>
                                    <span class="shop">南门口沙石店</span>
                                    <span>556,4538</span>
                                </li>
                                <li>
                                    <i class="ranking">5</i>
                                    <span class="shop">南门口沙石店</span>
                                    <span>556,4538</span>
                                </li>
                                <li>
                                    <i class="ranking">6</i>
                                    <span class="shop">南门口沙石店</span>
                                    <span>556,4538</span>
                                </li>
                                <li>
                                    <i class="ranking">7</i>
                                    <span class="shop">南门口沙石店</span>
                                    <span>556,4538</span>
                                </li> 
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
import * as eCharts from 'echarts'
import dayjs from 'dayjs'
import getMockHomeSale from '@/api/home'
export default {
    name: "SaleIndex",
    data() {
        return {
            activeName: 'sale',//tab切换
            myCharts: null,//存储echarts实例
            date: []
        }
    },
    mounted() {
        this.getMockSale()
        this.myCharts = eCharts.init(this.$refs.charts)
        this.myCharts.setOption({
            title: {
                text: "销售额趋势"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    show: true,
                    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [310, 322, 200, 334, 390, 330, 390, 191, 252, 200, 334, 399]
                }
            ]
        })
    },
    methods: {
        //获取mock数据
        async getMockSale(){
            /* const result = await getMockHomeSale()
            console.log(result); */
            // console.log(await getMockHomeSale());
        },
        //tab点击事件
        toSale() {
            this.myCharts.setOption({
                title: {
                    text: this.activeName == 'sale' ? '销售额趋势' : '访问量趋势'
                }
            })
        },
        //本日
        toDay() {
            const toDay = dayjs().format('YYYY-MM-DD')
            this.date = [toDay, toDay]
        },
        //本周
        toWeek() {
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start, end]
        },
        //本月
        toMonth(){
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [start, end]
        },
        //本年
        toYear(){
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [start, end]
        }
    }
}
</script>
<style lang="css" scoped>
.box-card {
    margin-top: 20px;
}

.clearfix {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.tab {
    width: 100%
}

deep.el-card__header {
    border-bottom: none
}

.right {
    position: absolute;
    right: 0;
}

.right span {
    margin-right: 20px
}

.picker {
    width: 260px !important;
}

.charts {
    width: 100%;
    height: 300px;
}

ul,
li {
    padding: 0;
    margin: 0;
    list-style: none;
    margin-bottom: 10px;
}

li i {
    font-style: normal;
}

li i {
    margin-right: 15px;
}

.shop {
    margin-right: 50px;
}

.ranking {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: black;
    line-height: 20px;
    text-align: center;
    color: white;
    border-radius: 50%;
}
</style>