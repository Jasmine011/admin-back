<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动 -->
      <CategorySelect
        @getCategoryID="handler"
        :show="scene == 0 ? false : true"
      />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu(category3Id)"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" :data="spuList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SUP名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <Hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSku(row)"
              ></Hint-button>
              <Hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="editSpu(row)"
              ></Hint-button>
              <Hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU的SKU列表"
                @click="toSkuList(row)"
              ></Hint-button>
              <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
                <el-table :data="skuList" v-loading="loading">
                  <el-table-column
                    property="skuName"
                    label="名称"
                    width="150"
                  ></el-table-column>
                  <el-table-column
                    property="price"
                    label="价格"
                    width="200"
                  ></el-table-column>
                  <el-table-column
                    property="weight"
                    label="重量"
                  ></el-table-column>
                   <el-table-column property="date" label="默认图片" width="150" >
                     <template slot-scope="{row}">
                       <img :src="row.skuDefaultImg" alt="" style="height:100px;width:100px">
                     </template>
                   </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <Hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  slot="reference"
                ></Hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="total"
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <spu-form v-show="scene == 1" ref="spuForm" @isScene="isScene" />
      <sku-form v-show="scene == 2" ref="skuForm" @isScene="isScene" />
    </el-card>
  </div>
</template>
<script>
import SpuForm from "./spuForm";
import SkuForm from "./skuForm";
export default {
  name: "SpuIndex",
  data() {
    return {
      //1\2\3级分类id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      page: 1, //当前第几页
      limit: 3, //当前一页展示多少条数据
      total: 0, //一共有多少条数据
      //判断下面展示哪个页面，0代表spu列表，1代表新增或者修改spu，2代表修改sku
      scene: 0,
      //判断是否显示sku列表对话框
      dialogTableVisible:false,
      //存储点击的spu
      spu:{},
      //存储sku列表
      skuList:[],
      //sku列表的加载状态
      loading: true
    };
  },
  methods: {
    //获取子组件传递过来的1、2、3级id
    handler($event) {
      const { category1Id, category2Id, category3Id } = $event;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
    },
    //监听属性，如果三级id有值执行此函数，获取spu列表数据
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        const { data } = result;
        this.total = data.total;
        this.spuList = data.records;
      }
    },
    //切换每页显示数据条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //点击安妮添加SPU
    addSpu(category3Id) {
      this.scene = 1;
      //通知spuForm子组件发请求，获取品牌和属性select
      this.$refs.spuForm.getSpuAttrAndTrademark(category3Id);
    },
    //点击按钮修改SPU
    editSpu(row) {
      this.$refs.spuForm.getSpuData(row);
      //切换界面
      this.scene = 1;
    },
    //切换界面
    isScene(scene) {
      this.scene = scene;
      this.getSpuList(this.page);
    },
    //删除SPU
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        const isPage = this.spuList.length > 1 ? this.page : this.page - 1;
        this.getSpuList(isPage);
      }
    },
    //点击添加SKU
    addSku(row) {
      //调用sku组件的函数获取数据
      this.$refs.skuForm.getSkuData(this.category1Id, this.category2Id, row);
      this.scene = 2;
    },
    //点击查看Sku列表
    async toSkuList(row){
      this.spu = row
      //显示sku列表对话框
      this.dialogTableVisible = true
      //发请求
      const result = await this.$API.spu.reqSkuList(row.id)
      if(result.code==200){
        this.skuList = result.data
        //关闭加载状态
        this.loading = false
      }
    },
    close(done){
      //初始化加载状态
      this.loading = true
      //清空skuList
      this.skuList = []
      //关闭对话框
      done()
    }
  },
  watch: {
    //监听3级id是否有数据，有数据说明1、2、3级id准备就绪，可以开始请求属性值列表
    category3Id: {
      handler(newCategory3Id) {
        if (newCategory3Id) {
          this.getSpuList();
        }
      },
    },
  },
  components: {
    SkuForm,
    SpuForm,
  },
};
</script>
<style lang="">
</style>