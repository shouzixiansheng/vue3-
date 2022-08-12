<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-left: 30px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-input v-model="formInline.name" placeholder="请输入用户ID" style="width: 150px"/>
              </span>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                    v-model="formInline.time"
                    type="datetimerange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                />
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
        <el-table :data="transferData" border>
          <el-table-column label="订单号">
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
          <el-table-column label="类型">
            <template #default="scope">
              <div>
                <span style="">{{transferType[scope.row.transferType]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="币种">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.currencyType }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.amount }} {{scope.row.currencyType}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="转出账号ID">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="转出账号名">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.nickName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="转入账号ID">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.otherUid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="转入账号名">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.otherNickName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.remark }}</span>
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
  name: '',
  time: ''
})
const loading = ref(false)

const transferData = ref([])

let transferParam = {
  page: 1,
  size: pagination.pageSize
}

const getTransferList = (param_) => {
  loading.value = true
  service.getTransferList(param_).then(res => {
    transferData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

getTransferList(transferParam)

const onSubmit = () => {
  let start_time;
  let end_time;
  if (formInline.value.time != null && formInline.value.time.length === 2) {
    start_time = dateToTs(formInline.value.time[0])
    end_time = dateToTs(formInline.value.time[1])
    transferParam.startTime = start_time
    transferParam.endTime = end_time
  }
  if (formInline.value.name.length !== 0){
    transferParam.name = formInline.value.name
  }

  getTransferList(transferParam)
}
const onReset = () => {
  transferParam = {
    page: 1,
    size: pagination.pageSize
  }
  formInline.value.name = ''
  formInline.value.time = ''
}

const handleCurrentChange = (val) => {
  transferParam.page = val
  getTransferList(transferParam)
}

let transferType = {
  TRANSFER: '转账',
  SCAN_CODE: '扫码',
}
</script>

<style scoped>

</style>