<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-left: 30px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-input v-model="formInline.uid" placeholder="请输入用户ID" style="width: 150px"/>
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
        <el-table :data="rechargeData" border>
          <el-table-column label="订单号" width="260">
            <template #default="scope">
              <div>
                <span style="margin-right: 20px">{{ scope.row.sn }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="scope">
              <div>
                <span style="">{{ tsToDate(scope.row.createTime) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户ID" width="150">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额(USDT)" width="100">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.amount }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <div>
                <span style="">成功</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络" width="100">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.network }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="转出地址" width="200">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.fromAddress }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="接收地址" width="200">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.toAddress }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="交易哈希" width="290">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.hash }}</span>
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
import {dateToTs, format as toTime, parseTo, toClipboard, tsToDate} from "../../utils/public";
import * as service from '../../api/funds'

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})
const formInline = ref({
  uid: ''
})
const loading = ref(false)

const rechargeData = ref([])

let rechargeParam = {
  page: 1,
  size: pagination.pageSize
}

const getCurrencyList = (param_) => {
  loading.value = true
  service.getRechargeList(param_).then(res => {
    rechargeData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}
getCurrencyList(rechargeParam)

const onSubmit = () => {
  if (formInline.value.uid.length !== 0) {
    rechargeParam.uid = formInline.value.uid
  }
  getCurrencyList(rechargeParam)
}
const onReset = () => {
  rechargeParam = {
    page: 1,
    size: pagination.pageSize
  }
  formInline.value.uid = ''
}

const handleCurrentChange = (val) => {
  rechargeParam.page = val
  getCurrencyList(rechargeParam)
}
</script>

<style scoped>

</style>