<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-left: 30px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="手机号搜索:" style="margin-right: 30px">
              <span>
                <el-input v-model="formInline.phone" placeholder="请输入搜索内容" style="width: 150px"/>
              </span>
              </el-form-item>
              <div style="text-align: end">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button @click="onReset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-table :data="phoneData" border>
          <el-table-column label="国家">
            <template #default="scope">
              <div>
                <span style="margin-right: 20px">{{ scope.row.country }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template #default="scope">
              <div>
                <span style="margin-right: 20px">{{ scope.row.mobile }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发送时间">
            <template #default="scope">
              <div>
                <span style="">{{ toTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="验证码">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.verifyCode }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <div>
                <span style="">{{ verifyCodeStatus[scope.row.verifyCodeStatusEnum] }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;text-align: end;"
            v-model:currentPage="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :background="background = true"
            layout="prev, pager, next"
            :total="pagination.page_count"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard} from "../../utils/public";
import * as service from '../../api/user'

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})
const formInline = ref({
  phone: ''
})
const loading = ref(false)

const phoneData = ref([])
let verifyParam = {
  page: 1,
  size: pagination.pageSize,
  code_type: 'MOBILE'
}

const getVerifyCodeAdminQuery = (param_) => {
  loading.value = true
  service.getVerifyCodeAdminQuery(param_).then(res => {
    phoneData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

getVerifyCodeAdminQuery(verifyParam)

const onSubmit = () => {
  if (formInline.value.phone.length !== 0){
    verifyParam.mobile = formInline.value.phone
  }
  getVerifyCodeAdminQuery(verifyParam)
}
const onReset = () => {
  formInline.value.phone = ''
  verifyParam = {
    page: 1,
    size: pagination.pageSize,
    code_type: 'EMAIL'
  }
}

const handleCurrentChange = (val) => {
  verifyParam.page = val
  getVerifyCodeAdminQuery(verifyParam)
}

let verifyCodeStatus = {
  accept_success: '接收成功',
  accept_fail: '接收失败',
  send_success: '发送成功',
  send_fail: '发送失败'
}
</script>

<style scoped>

</style>