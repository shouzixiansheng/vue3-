<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-left: 30px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-input v-model="formInline.user" placeholder="请输入用户ID" style="width: 150px"/>
              </span>
              </el-form-item>
              <el-form-item label="账单类型:">
                <el-select v-model="formInline.business" placeholder="请选择">
                  <el-option v-for="(val, key) in business" :label="val" :value="key"/>
                </el-select>
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
<!--            <el-descriptions-item>-->
<!--              <template #label>-->
<!--                <span class="small-title">销售额：</span>-->
<!--              </template>-->
<!--              <span>-->
<!--                  1000-->
<!--                </span>-->
<!--            </el-descriptions-item>-->
          </el-descriptions>
        </div>
        <el-table :data="phoneData" border>
          <el-table-column label="订单ID">
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
          <el-table-column label="用户ID">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template #default="scope">
              <div>
                <span style="">{{ business[scope.row.business] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="说明">
            <template #default="scope">
              <div>
                <span style="">{{ scope.row.des }}</span>
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
  user: '',
  business: '',
  time: ''
})
const loading = ref(false)

const phoneData = ref([])

let currencyParam = {
  page: 1,
  size: pagination.pageSize
}

const getCurrencyList = (param_) => {
  loading.value = true
  service.getCurrencyList(param_).then(res => {
    phoneData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

getCurrencyList(currencyParam)

const onSubmit = () => {
  let start_time;
  let end_time;
  if (formInline.value.time != null && formInline.value.time.length === 2) {
    start_time = dateToTs(formInline.value.time[0])
    end_time = dateToTs(formInline.value.time[1])
    currencyParam.startTime = start_time
    currencyParam.endTime = end_time
  }
  if (formInline.value.user.length !== 0){
    currencyParam.uid = formInline.value.user
  }
  if (formInline.value.business.length !== 0){
    currencyParam.business = formInline.value.business
  }
  getCurrencyList(currencyParam)
}
const onReset = () => {
  currencyParam = {
    page: 1,
    size: pagination.pageSize
  }
  formInline.value.user = ''
  formInline.value.business = ''
  formInline.value.time = ''
}

const handleCurrentChange = (val) => {
  currencyParam.page = val
  getCurrencyList(currencyParam)
}

let business = {
  TRANSFER:'转账',
  RECHARGE:'充值',
  U_WITHDRAW:'U币提现',
  FLAT_MONEY:'法币提现',
  APP_EXCHANGE:'平台闪兑',
  MARKET_EXCHANGE:'市场汇兑',
  WATER_BILLS_PAY:'水费缴纳',
  ELECTRICITY_BILLS_PAY:'电费缴纳',
  GAS_BILLS_PAY:'燃气费缴纳',
  PREPAID_RECHARGE:'话费充值',
  GO_SHOPPING:'商城购物',
}
</script>

<style scoped>

</style>