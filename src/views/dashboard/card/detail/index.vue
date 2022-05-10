<template>
    <div class="detail-container">
        <div class="detail-header">
            <span>{{title}}</span>
            <span><svg t="1651849174908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1915" width="16" height="16"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM448 448h128v384H448V448z m0-256h128v128H448V192z" fill="#262626" p-id="1916"></path></svg></span>
        </div>
        <div class="detail-text">{{content}}</div>
        <div class="detail-charts">
            <slot name="charts">
                
            </slot>
        </div>
        <div class="detail-footer">
            {{footer}}
        </div>
    </div>
</template>
<script>
export default {
    name:"DetailIndex",
    props:['title','content','footer']
}
</script>
<style lang="css">
    .detail-header{
        display: flex;
        justify-content: space-between;
        color:#a7b1ad
    }
    .detail-text{
        font:600 28px '微软雅黑';
        padding-bottom: 20px;
    }
    .detail-charts{
        width: 268px;
        height: 60px;
    }
    .detail-footer{
        border-top: 1px solid #eee;
        padding-top: 10px;
    }
</style>