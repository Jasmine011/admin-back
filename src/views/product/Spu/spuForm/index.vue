<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" value="">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImage"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${isSelectAttr.length}项未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="spuAttr.name"
            :value="`${spuAttr.id}:${spuAttr.name}`"
            v-for="spuAttr in isSelectAttr"
            :key="spuAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="attrIdAndName != '' ? false : true"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <!--  @close="handleClose(tag)"  -->
              <el-tag
                v-for="(saleAttr, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                :key="saleAttr.id"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                >{{ saleAttr.saleAttrValueName }}</el-tag
              >
              <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="toTag(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrEditSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuFromIndex",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu信息
      spu: {
        //三级分类id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌id
        tmId: '',
        //收集的图片信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        //平台属性与属性值的信息
        spuSaleAttrList: [
          /* 
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      //spu图片
      spuImage: [],
      //品牌信息
      trademarkList: [],
      //平台属性
      attrList: [],
      //销售属性的id
      attrIdAndName: "",
      //删除完图片或者新增完图片后存储的图片，还需加工才能使用
      spuImageList: [],
    };
  },
  methods: {
    //图片点击删除后触发
    handleRemove(file, fileList) {
      //file代表删除的那张图
      //fileList代表剩下的图
      //把剩下图片列表给我们自己的数据，当然这个list有些字段是我们提交服务器时不需要的，保存的时候把不需要的字段去掉
      this.spuImageList = fileList;
    },
    //图片点击大图预览后触发
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      //显示大图
      this.dialogVisible = true;
    },
    //图片上传成功后触发
    handlerSuccess(response,file, fileList) {
      /* console.log(response,file, fileList); */
      //把剩下图片列表给我们自己的数据，当然这个list有些字段是我们提交服务器时不需要的，保存的时候把不需要的字段去掉
      this.spuImageList = fileList;
    },
    //父组件点击编辑SPU按钮时触发初始化spu页面，获取信息
    async getSpuData(row) {
      //获取spu数据
      let spuResult = await this.$API.spu.reqGetSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取spu图片
      let spuImgResult = await this.$API.spu.reqSpuImg(row.id);
      if (spuImgResult.code == 200) {
        //el-upload照片墙展示图片得是一个数组，且里面要有name和url属性，我们的属性名叫imgName和imgUrl，所以要加工一下数据
        const imgList = spuImgResult.data;
        imgList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImage = imgList;
      }
      //获取品牌数据
      let trademarkResult = await this.$API.spu.reqTradeMarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取平台销售属性
      let attrResult = await this.$API.spu.reqSaleAttrList();
      if (attrResult.code == 200) {
        this.attrList = attrResult.data;
      }
    },
    //父组件点击添加SPU按钮时触发，获取品牌和属性
    async getSpuAttrAndTrademark(category3Id){
      this.spu.category3Id = category3Id
      //获取品牌数据
      let trademarkResult = await this.$API.spu.reqTradeMarkList();
      if (trademarkResult.code == 200) {
        console.log(trademarkResult);
        this.trademarkList = trademarkResult.data;
      }
      //获取平台销售属性
      let attrResult = await this.$API.spu.reqSaleAttrList();
      if (attrResult.code == 200) {
        this.attrList = attrResult.data;
      }
    },
    //点击按钮添加销售属性
    addSaleAttr() {
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId: this.attrIdAndName.split(":")[0],
        saleAttrName: this.attrIdAndName.split(":")[1],
        spuSaleAttrValueList: [],
      });
      //清空attr的select框
      this.attrIdAndName = "";
    },
    //点击添加属性值按钮
    addAttrValue(row) {
      //row.inputVisible用来切换input和button
      //row.inputValue用来获取数据
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //离开input，input变为tab小标签
    toTag(row) {
      const { baseSaleAttrId, inputValue } = row;
      //新增属性值不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //不能重复
      let result = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (result) {
        this.$message("属性值重复");
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      //用来切换input和button
      this.$set(row, "inputVisible", false);
    },
    //点击保存按钮，提交修改或新增的SPU
    async addOrEditSpu() {
      //整理数据提交
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      const result = await this.$API.spu.reqAddOrDateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success",
        });
      } else {
        this.$message("保存失败");
        return;
      }
      this.$emit("isScene", 0);
      //清空数据
      //this._data组件实例化，可以操作data中的响应式数据
      //this.$options.data()代表配置对象的data
      Object.assign(this._data,this.$options.data())
    },
    //点击取消按钮
    cancel(){
      //清空数据
      //this._data组件实例化，可以操作data中的响应式数据
      //this.$options.data()代表配置对象的data
      Object.assign(this._data,this.$options.data())
      //切换界面
      this.$emit('isScene', 0)
    }
  },
  computed: {
    //计算一下还有几项属性未选择（平台有的，但是这个商品没有的属性，返回一个数组）this.spu.spuSaleAttrList saleAttrName this.attrList
    isSelectAttr: function () {
      return this.attrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>