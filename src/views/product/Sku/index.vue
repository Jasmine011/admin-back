<template>
  <div class="SkuIndex">
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="width">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="height: 100px; width: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button type="info" size="mini" icon="el-icon-download" v-if="row.isSale==1" @click="toCancel(row)"></el-button>
          <el-button type="success" size="mini" icon="el-icon-upload2" v-else @click="toOnSale(row)"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="toEdit"></el-button>
          <el-button type="info" size="mini" icon="el-icon-info" @click="toSkuInfo(row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      style="text-align: center; margin-top: 20px"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size='50%' v-loading="loading">
        <el-row>
            <el-col :span="6"><div class="grid-content bg-purple is-title">名称</div></el-col>
            <el-col :span="15"><div class="grid-content bg-purple-light is-text">{{skuInfo.skuName}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content bg-purple is-title">描述</div></el-col>
            <el-col :span="15"><div class="grid-content bg-purple-light is-text">{{skuInfo.skuDesc}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content bg-purple is-title">价格</div></el-col>
            <el-col :span="15"><div class="grid-content bg-purple-light is-text">{{skuInfo.price}}</div></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content bg-purple is-title">平台属性</div></el-col>
                <div class="grid-content bg-purple-light">
                    <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin:0 5px">{{attr.valueName}}</el-tag>
                </div>
            <el-col :span="15"></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content bg-purple is-title">商品图片</div></el-col>
            <el-col :span="15">
                <el-carousel :interval="5000" arrow="always" autoplay="true">
                    <el-carousel-item v-for="skuImg in skuInfo.skuImageList" :key="skuImg.id">
                    <img :src="skuImg.imgUrl" alt="" >
                    </el-carousel-item>
                </el-carousel>
            </el-col>
        </el-row>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "SkuIndex",
  data() {
    return {
      skuList: [],
      page: 1,
      limit: 3,
      total: 0,
      //抽屉是否打开
      show:false,
      //sku详情
      skuInfo:{},
      loading:true
    };
  },
  mounted() {
    //发请求获取sku列表数据
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit,total} = this;
      const result = await this.$API.sku.reqGetSkuLIst(page, limit);
      if (result.code == 200) {
        this.skuList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      }
    },
    //切换每页显示数据条数
    handleSizeChange(limit){
        this.limit = limit
        this.getSkuList();
    },
    //点击向下按钮，下架
    async toCancel(row){
        const result =await this.$API.sku.reqSkuCancel(row.id)
        if(result.code==200){
            row.isSale = 0
            this.$message({
                type:"success",
                message:"下架成功"
            })
        }
    },
    //点击向上按钮，上架
    async toOnSale(row){
        const result =await this.$API.sku.reqSkuOnSale(row.id)
        if(result.code==200){
            row.isSale = 1
            this.$message({
                type:"success",
                message:"下架成功"
            })
        }
    },
    //点击编辑按钮
    toEdit(){
        this.$message("正在开发中")
    },
    //点击详情按钮，打开抽屉
    async toSkuInfo(row){
        this.show = true
        const result = await this.$API.sku.reqSkuInfo(row.id)
        if(result.code==200){
            console.log(result);
            this.skuInfo = result.data
            //把加载状态关闭
            this.loading = false
        }
    }
  },
};
</script>
<style>
    .el-row{
        margin: 35px;
    }
    .is-text{
        color: #666;
    }
    .SkuIndex .is-title{
            font-size: 20px;
            font-weight: 800;
            text-align: center;
        }
    
</style>