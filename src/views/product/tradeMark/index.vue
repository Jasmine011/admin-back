<template>
  <div class="tradeMark-index">
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 20px"
      @click="upDataTradeMark"
      >添加</el-button
    >
    <!-- //表格 -->
    <el-table border :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="date" label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="editTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="openRemove(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change="handleSizeChange"每页显示数据条数改变时触发
    @current-change="handleCurrentChange"页码变化时触发 -->
    <!-- current-page代表当前第几页
        pager-count代表一共显示多少页
        total总数据条数
        page-size一页显示多少数据
     -->
    <el-pagination
      :total="total"
      :page-size="limit"
      :current-page="page"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="  prev, pager, next, jumper,->,sizes,total"
      style="margintop: 30px; textalign: center"
      @current-change="getTradeMarkList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 上传或修改的对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogShow">
      <!-- :model="tmForm"收集表单数据，表单验证也需要这个用到属性 -->
      <el-form
        style="width: 80%"
        :model="tmForm"
        :rules="rules"
        ref="tmFormRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!-- 上传logo -->
        <!-- action属性：上传图片地址 -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "tradeMarkIndex",
  data() {
    return {
      //当前页码数
      page: 1,
      //每页显示数据条数
      limit: 3,
      //一共有多少数据
      total: 0,
      //列表要展示的数据
      list: [],
      //是否显示对话框
      dialogShow: false,
      //上传logo图片的信息
      //imageUrl: "",
      //表单数据
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 7,
            message: "长度在 3 到 7 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择图片" }],
      },
    };
  },
  mounted() {
    //这个函数用于获取品牌列表信息
    this.getTradeMarkList();
  },
  methods: {
    //发起请求获取品牌列表
    async getTradeMarkList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      const result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //每页展示多少条数据数量发生变化时触发
    handleSizeChange(limiter) {
      this.limit = limiter;
      //重新发起请求获取品牌信息
      this.getTradeMarkList();
    },
    //上传图片后触发
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = URL.createObjectURL(file.raw);
    },
    //上传图片前触发
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击添加品牌按钮
    upDataTradeMark() {
      //显示对话框
      this.dialogShow = true;
    },
    //点击编辑品牌按钮
    editTradeMark(row) {
      //显示对话框
      //row就是点击到的品牌的信息
      this.dialogShow = true;
      //这里要用浅拷贝，不然的话，修改本地数据会把服务器的数据直接修改了。我们不应该直接改，应该要点击确定按钮再改。
      this.tmForm = { ...row };
    },
    //点击确定按钮，添加或者修改品牌
    addOrUpdateTradeMark() {
      //验证成功后再执行提交操作
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          //发送请求
          const result = await this.$API.tradeMark.reqUpdateOrSaveTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //重新发起请求获取品牌信息
            //添加品牌成功回到第一页，编辑品牌成功停留当前页
            this.getTradeMarkList(this.tmForm.id ? this.page : 1);
          } else {
            this.$message.error(
              this.tmForm.id ? "修改品牌失败" : "添加品牌失败"
            );
          }
          //关闭对话框
          this.dialogShow = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击删除按钮
    openRemove(row) {
      console.log(row);
      this.$confirm(`确认删除${row.tmName}吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const result = await this.$API.tradeMark.reqDelTradeMark(row.id);
        if (result.code == 200) {
          //这个函数用于获取品牌列表信息
          //删除后如果所在页已经没有数据展示了，就往前跳一页
          this.getTradeMarkList(this.list.length>1?this.page:this.page-1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        } else {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
      });
    },
  },
  watch: {
    //如果对话框关闭，把对话框里面的数据清除
    dialogShow() {
      if (!this.dialogShow) {
        this.tmForm = {
          tmName: "",
          logoUrl: "",
        };
      }
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>