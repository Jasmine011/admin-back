<template>
    <div style="margin-top:20px">
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="grid-content bg-purple"> 
                    <lines-card />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light"> 
                    <pie-card />
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import PieCard from './pieCard'
import LinesCard from './linesCard'
export default {
    name: "ExhibitionIndex",
    components: {
        PieCard,
        LinesCard
    }
}
</script>
<style lang="">
    
</style>