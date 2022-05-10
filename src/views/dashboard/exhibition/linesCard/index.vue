<template>
    <div>
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <div class=" box-header">
                    <span>线上热门搜索</span>
                    <!-- 下拉菜单 -->
                    <el-dropdown>
                        <span class="el-dropdown-link"><i class="el-icon-more el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <!-- 折线图 -->
            <div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <line-charts title="123060" number="17.12">
                            </line-charts>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                            <line-charts title="963060" number="23.58">
                            </line-charts>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- table -->
            <div>
                <el-table style="width: 100%" :data="data" size="mini" border>
                    <el-table-column label="排名" width="80" type="index" align="center">
                    </el-table-column>
                    <el-table-column label="搜索关键字" width="180">
                    </el-table-column>
                    <el-table-column label="用户数" sortable>
                    </el-table-column>
                    <el-table-column label="周涨幅" sortable>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div style="float:right;padding:5px">
                <el-pagination layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>

        </el-card>
    </div>
</template>
<script>
import LineCharts from './lineCharts'
export default {
    name: "LinesCard",
    data() {
        return {
            data: [1, 2, 3]
        }
    },
    components: {
        LineCharts
    }
}
</script>
<style lang="css" scoped>
.box-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>