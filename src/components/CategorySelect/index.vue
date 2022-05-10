<template>
  <div class="CategorySelect">
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!--  这里的@change事件是elementUI准备的 -->
        <el-select
          placeholder="请选择"
          value=""
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          value=""
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          value=""
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  props:["show"],
  data() {
    return {
      //一二三级分类列表
      list1: [],
      list2: [],
      list3: [],
      //收集三级联动的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //挂载组件完成后直接调用接口获取一级分类方法
    this.getCategory1List();
  },
  methods: {
    //获取一级分类的方法
    async getCategory1List() {
      const result = await this.$API.attr.reqGetCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    //1级分类选中了之后发起请求获取2级分类
    async handler1() {
        //每次重新选择分类，都要把后面的分类清除
        this.list2 = []
        this.list3 = []
        this.cForm.category2Id=''
        this.cForm.category3Id=''
      const { category1Id } = this.cForm;
      const result = await this.$API.attr.reqGetCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    //2级分类选中了之后发起请求获取3级分类
    async handler2() {
        //每次重新选择分类，都要把后面的分类清除
        this.list3 = []
        this.cForm.category3Id=''
      const { category2Id } = this.cForm;
      const result = await this.$API.attr.reqGetCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    //三级分类选中后，把123级的id发送给父组件，父组件获取平台属性信息
     handler3() {
      const { category3Id } = this.cForm;
    },
  },
  watch:{
      cForm:{
          handler(newID){
              this.$emit('getCategoryID',this.cForm)
          },
          deep:true
      }
  }
};
</script>
<style lang="">
</style>