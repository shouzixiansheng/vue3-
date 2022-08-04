<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-bottom: 10px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户ID:">
                <el-input v-model="formInline.uid" placeholder="输入用户ID"/>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                  <el-option v-for="(v,k) in withdrawStatus" :label="v" :value="k"/>
                </el-select>
              </el-form-item>
              <el-form-item label="提现时间">
                <el-date-picker
                    v-model="formInline.time"
                    type="datetimerange"
                    range-separator="To"
                    start-placeholder="选择开始时间"
                    end-placeholder="选择结束时间"
                />
              </el-form-item>
              <div style="text-align: end">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" @click="onReset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-table :data="withdrawData" border>
          <el-table-column label="订单号" width="250">
            <template #default="scope">
              <span class="">{{scope.row.sn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160">
            <template #default="scope">
              {{ toTime(dateToTs(scope.row.createTime), 'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="用户ID" width="150">
            <template #default="scope">
              {{scope.row.uid}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template #default="scope">
              <span>{{withdrawStatus[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现数额(USDT)" width="130">
            <template #default="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现手续费(USDT)" width="150">
            <template #default="scope">
              <div>
                <span>{{scope.row.fee}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际到账(USDT)" width="150">
            <template #default="scope">
              <div>
                <span>{{scope.row.actualAmount}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              提现网络
            </template>
            <template #default="scope">
              <span class="">{{scope.row.network}}</span>
            </template>
          </el-table-column>
          <el-table-column width="380">
            <template #header>
              转出地址
            </template>
            <template #default="scope">
              <span class="">{{scope.row.fromAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column label="接收地址" width="380">
            <template #default="scope">
              <span class="">{{scope.row.toAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易哈希" width="380">
            <template #default="scope">
              <span class="">{{scope.row.hash}}</span>
            </template>
          </el-table-column>
          <el-table-column label="到账时间" width="160">
            <template #default="scope">
              <span v-if="scope.row.completeTime!==null">{{ toTime(dateToTs(scope.row.completeTime), 'yyyy-MM-dd HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="scope">
              <el-button v-if="scope.row.status==='created'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
              >审核
              </el-button
              >
              <el-button v-if="scope.row.status!=='created'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
              >审核记录
              </el-button
              >
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
            @current-change="handleProfitCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="审核结果" width="50%" :before-close="handleClose">
      <div v-if="resultData.istatus ==='created'">
        <el-form :model="resultData">
          <el-form-item label="可提现数额：" label-width="120px">
            <el-input disabled v-model="resultData.actualAmount" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提现数额：" label-width="120px">
            <el-input disabled v-model="resultData.amount" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="网络：" label-width="120px">
            <el-input disabled v-model="resultData.network" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提现手续费：" label-width="120px">
            <el-input disabled v-model="resultData.fee" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提示：" label-width="120px">
            <span>若结算成功则实际到账为 <span style="color: red">{{resultData.actualAmount}}</span> USDT</span>
          </el-form-item>
          <el-form-item label="*审核：" label-width="120px">
            <el-select v-model="resultData.status" placeholder="请选择">
              <el-option label="等待审核" value="created"/>
              <el-option label="审核失败" value="review_fail"/>
              <el-option label="审核成功" value="review_success"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      v-model="resultData.note" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="resultData.istatus !=='created'">
        <el-form :model="resultData">
          <el-form-item label="审核结果：" label-width="120px">
            <span v-if="resultData.status==='review_fail'">审核失败</span>
            <span v-if="resultData.status!=='review_fail'">审核成功</span>
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input :autosize="{ minRows: 2, maxRows: 4 }"
                      disabled
                      type="textarea"
                      v-model="resultData.note" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="resultData.istatus !=='created'" @click="dialogVisible = false">确认</el-button>
        <el-button v-if="resultData.istatus ==='created'" type="primary" @click="handleSubmit"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

  </div>

</template>

<script lang="ts" setup>
import {dateToTs, format as toTime, parseTo} from "../../utils/public";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import * as service from '../../api/funds'


const loading = ref(false)
const withdrawData = ref([])
const resultData = ref({
  status: '',
  istatus: '',
  id: '',
  note: '',
  actualAmount: '',
  network: '',
  amount: '',
  fee: '',
})
const dialogVisible = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})

const formInline = reactive({
  uid: '',
  time: '',
  status: ''
})

const getUsdtWithdrawalList = (param_) => {
  loading.value = true
  service.getUsdtWithdrawalList(param_).then(res => {
    withdrawData.value = res.items
    pagination.page_count = res.count
    loading.value = false
  })
}

let params = {
  page: 1,
  size: 20
}
getUsdtWithdrawalList(params)

const onSubmit = () => {
  withdrawData.value = []
  let start_time;
  let end_time;
  pagination.currentPage = 1
  params = {
    page: 1,
    size: 20
  }
  if (formInline.time != null && formInline.time.length === 2) {
    start_time = toTime(dateToTs(formInline.time[0]), 'yyyy-MM-dd')
    end_time = toTime(dateToTs(formInline.time[1]), 'yyyy-MM-dd')
    params.startTime = start_time
    params.endTime = end_time
  }
  if (formInline.uid.length !== 0){
    params.uid = formInline.uid
  }
  if (formInline.status.length !== 0){
    params.status = formInline.status
  }
  getUsdtWithdrawalList(params)
}



const onReset = () => {
  params = {
    page: 1,
    size: 20
  }
  formInline.uid = ''
  formInline.time = ''
  formInline.status = ''
}

const handleResult = (index, row) => {
  resultData.value.id = row.id
  resultData.value.note = row.note
  resultData.value.actualAmount = row.actualAmount
  resultData.value.status = row.status
  resultData.value.istatus = row.status
  resultData.value.amount = row.amount
  resultData.value.network = row.network
  resultData.value.fee = row.fee
}

const handleClose = () => {
  dialogVisible.value = false
}

const onResultSubmit = () => {

}

const handleSubmit = () => {
  let result;
  if (resultData.value.status === 'review_success') {
    result = true
  }
  if (resultData.value.status === 'review_fail') {
    result = false
  }
  service.postUsdtWithdrawalAudit({id: resultData.value.id, result: result, note: resultData.value.note}).then(res => {
    if (res === null){
      ElMessage({
        message: '审核成功！！！',
        type: 'success',
      })
    }
    getUsdtWithdrawalList(params)
    dialogVisible.value = false
  })
}

const handleProfitCurrentChange = (val) => {
  params.page = val
  getUsdtWithdrawalList(params)
}

let withdrawStatus = {
  created: '新创建/待审核',
  review_fail: '审核失败',
  review_success: '审核成功',
  withdrawing: '提现中',
  withdraw_fail: '提现失败',
  withdraw_success: '提现成功',
}
</script>

<style scoped>

</style>