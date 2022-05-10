<template>
  <div>
    <el-form ref="form" label-width="80px" :model="skuInfo">
      <el-form-item label="SPU名称">
        {{ spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdAndAttrValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImgList" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="setDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAddSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SkuFromIndex",
  data() {
    return {
      //spu图片
      spuImgList: [],
      //spu销售属性
      spuSaleAttrList: [],
      //平台销售属性
      attrInfoList: [],
      spuName: "",
      //sku的数据
      skuInfo: {
        //父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //v-model收集
        price: 0,
        weight: "",
        skuName: "",
        skuDesc: "",
        //默认图片
        skuDefaultImg: "",
        //平台属性
        skuAttrValueList: [
            /* {
                attrId:0,
                valueId:0
            } */
        ],
        skuImageList: [
            /* {
                imgName:'',
                imgUrl:'',
                isDefault:'',
                spuImgImgId:0
            } */
        ],
        //销售属性
        skuSaleAttrValueList: [
            /* {
                saleAttrId:0,
                saleAttrValueId:0
            } */
        ],
      },
      //点击复选框，选中的图片收集在这
      imgList: [],
    };
  },
  methods: {
    //父组件中点击添加sku按钮时触发，获取数据
    async getSkuData(category1Id, category2Id, sku) {
      //skuInfo需要收集的数据
      this.skuInfo.category3Id = sku.category3Id;
      this.skuInfo.spuId = sku.id;
      this.skuInfo.tmId = sku.tmId;
      //sku需要展示的数据
      this.spuName = sku.spuName;
      //获取spu图片
      const spuImgResult = await this.$API.spu.reqSpuImgList(sku.id);
      if (spuImgResult.code == 200) {
        let imageList = spuImgResult.data;
        //给图片加一个属性，用于判断是否为默认图片，0为非默认，1为默认
        imageList.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImgList = imageList;
      }
      //获取spu销售属性的数据
      const spuAttrResult = await this.$API.spu.regSpuSaleAttrList(sku.id);
      if (spuAttrResult.code == 200) {
        this.spuSaleAttrList = spuAttrResult.data;
      }
      //获取平台属性的数据
      const attrInfoResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        sku.category3Id
      );
      if (attrInfoResult.code == 200) {
        this.attrInfoList = attrInfoResult.data;
      }
    },
    //点击图片table的复选框时触发，返回的参数时选中的信息
    handleSelectionChange(data) {
      this.imgList = data;
    },
    //点击设置默认图片
    setDefault(row) {
      this.spuImgList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片信息
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮
    cancel() {
      //清空数据
      Object.assign(this._data, this.$options.data());
      //切换界面
      this.$emit("isScene", 0);
    },
    //点击保存按钮
    async saveAddSku(){
        //整理数据，把数据整理成接口需要的格式
        const {spuSaleAttrList,attrInfoList,imgList,skuInfo} = this
        //整理销售属性
        skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre,item)=>{
            if(item.saleAttrIdAndAttrValueId){
                const [saleAttrId,saleAttrValueId] = item.saleAttrIdAndAttrValueId.split(':')
                pre.push({saleAttrId,saleAttrValueId})
            }
            return pre
        },[])

        //整理平台属性
        skuInfo.skuAttrValueList = attrInfoList.reduce((pre,item)=>{
            if(item.attrIdAndAttrValueId){
                const [attrId,valueId] = item.attrIdAndAttrValueId.split(':')
                pre.push({attrId,valueId})
            }
            return pre
        },[])

        //整理skuImageList图片列表
        skuInfo.skuImageList = imgList.map(item=>{
            return {
                imgName:item.imgName,
                imgUrl:item.imgUrl,
                isDefault:item.isDefault,
                spuImgId:item.id
            }
        })
        const result = await this.$API.spu.reqAddSku(skuInfo)
        console.log(result);
        if(result.code==200){
            this.$message({
                type:'success',
                message:'SKU添加成功'
            })
            //切换界面
            this.cancel()
        }else{
            this.$message('保存失败')
        }
    }
  },
};
</script>
<style lang="">
</style>