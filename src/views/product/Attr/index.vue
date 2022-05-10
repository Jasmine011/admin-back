<template>
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <!-- 三级联动 -->
      <CategorySelect @getCategoryID="handler" :show="!isShowTable"/>
    </el-card>
    <el-card class="box-card">
      <!-- 属性展示 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="clickAdd"
          :disabled="category3Id ? false : true"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="categoryAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attr in row.attrValueList"
                :key="attr.id"
                type="success"
                style="margin: 0 10px"
                >{{ attr.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或编辑属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <el-table
          style="width: 100%; margin: 10px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="porp" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                :ref="$index"
                v-if="row.flag"
                @blur="toAttrLook(row)"
                @keyup.native.enter="toAttrLook(row)"
              ></el-input>
              <span
                v-else
                @click="clickSpan(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="porp" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确认要删除${row.valueName}吗`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addAndEditAttr" :disabled="attrInfo.attrValueList.length==0">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
//引入深拷贝插件
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "AttrIndex",
  data() {
    return {
      //1\2\3级分类id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //属性信息
      categoryAttrList: [],
      //是否显示属性列表
      isShowTable: true,
      //收集 新增|修改 属性信息,发起新增或者修改请求时需要发送这个数据到服务器接口，这个数据是后端接口口规定的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值，和属性值对应的id，用对象存储
        categoryId: 0, //对应的三级分类的id
        categoryLevel: 3, //区分属于几级分类
      },
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
    //点击添加属性按钮
    clickAdd() {
      //先清空之前的添加界面数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值，和属性值对应的id，用对象存储
        categoryId: this.category3Id, //对应的三级分类的id
        categoryLevel: 3, //区分属于几级分类
      };
      //显示添加界面
      this.isShowTable = false;
    },
    //点击修改按钮
    updateAttr(row) {
      //显示添加界面
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      //给编辑的属性值都添加上flag，flag是控制编辑模式和查看模式的
      this.attrInfo.attrValueList.forEach((item) => {
        //这里不能用普通方法直接给item添加属性，直接添加不是响应式的，因为 Vue 无法探测普通的新增 property (比如 this.myObject.newProperty = 'hi')
        this.$set(item, "flag", false);
      });
    },
    //点击span，切换为input，并且聚焦到input
    clickSpan(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //属性值编辑框失去焦点，切换查看模式
    toAttrLook(row) {
      //先判断新输入的值是否为空格
      if (row.valueName.trim() == "") {
        this.$message("请输入符合格式的属性值");
        return;
      }
      //再判断新输入的值是否和其他属性值重复
      const isFlag = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return item.valueName == row.valueName;
        }
      });
      console.log();
      if (isFlag) {
        this.$message("属性值重复，请重新输入");
        return;
      }
      //从input切换到span
      row.flag = false;
    },
    //点击添加属性值按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //这里的id由服务器给,只有在修改属性的时候有id，新增的时候没有，传递undefined
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //依靠这个来判断属性值处于编辑模式还是查看模式
      });
      //点击完添加属性按钮，自动聚焦到新的输入框
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //确认删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存修改或新增的属性，并退出
    async addAndEditAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            //删除请求不需要的数据
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqSaveAttr(this.attrInfo);
        this.$message({
          showClose: true,
          message: "保存属性成功",
          type: "success",
        });
        //显示属性列表页面，并重新加载数据
        this.isShowTable=true
        this.getNewAttr()
      } catch (err) {
        this.$message("保存失败");
      }
    },
    async getNewAttr(){
        const { category1Id, category2Id, category3Id } = this;
          const result = await this.$API.attr.reqGetAttr(
            category1Id,
            category2Id,
            category3Id
          );
          if (result.code == 200) {
            this.categoryAttrList = result.data;
          } else {
            this.$message.error("获取属性数据失败");
          }
    }
  },
  watch: {
    //监听3级id是否有数据，有数据说明1、2、3级id准备就绪，可以开始请求属性值列表
    category3Id: {
       handler(newCategory3Id) {
        if (newCategory3Id) {
          this.getNewAttr()
        }
      },
    },
  },
};
</script>
<style lang="">
</style>