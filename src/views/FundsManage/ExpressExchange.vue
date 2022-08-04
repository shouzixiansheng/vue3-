<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-left: 30px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-input v-model="formInline.uid" placeholder="请输入用户id" style="width: 150px"/>
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
        <div>
          <el-descriptions
              class="margin-top"
              :column="1"
          >
            <el-descriptions-item>
              <template #label>
                <span class="small-title">销售额：</span>
              </template>
              <span>
                  1000
                </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-table :data="expressData" border>
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
                <span style="">{{ toTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户ID">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="货币对">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.inputCurrency }}/{{ scope.row.baseCurrency }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="消耗">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.inputAmount }} {{ scope.row.inputCurrency }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手续费">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.profit }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="获得">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.baseAmount }} {{ scope.row.baseCurrency }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="当前汇率">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.exchangeRate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="溢价后汇率">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.floatExchangeRate }}</span>
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
import * as service from '../../api/funds'

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})
const formInline = ref({
  uid: '',
  time: ''
})
const loading = ref(false)

const expressData = ref([])

let expressParam = {
  page: 1,
  size: pagination.pageSize
}

const getExpressExchangeList = (param_) => {
  loading.value = true
  service.getExpressExchangeList(param_).then(res => {
    expressData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

getExpressExchangeList(expressParam)

const onSubmit = () => {
  let start_time;
  let end_time;
  if (formInline.value.time != null && formInline.value.time.length === 2) {
    start_time = toTime(dateToTs(formInline.value.time[0]), 'yyyy-MM-dd')
    end_time = toTime(dateToTs(formInline.value.time[1]), 'yyyy-MM-dd')
    expressParam.startTime = start_time
    expressParam.endTime = end_time
  }
  if (formInline.value.uid.length !== 0){
    expressParam.uid = formInline.value.uid
  }

  getExpressExchangeList(expressParam)
}
const onReset = () => {
  expressParam = {
    page: 1,
    size: pagination.pageSize
  }
  formInline.value.uid = ''
  formInline.value.time = ''
}

const handleCurrentChange = (val) => {
  expressParam.page = val
  getExpressExchangeList(expressParam)
}

</script>

<style scoped>

</style>