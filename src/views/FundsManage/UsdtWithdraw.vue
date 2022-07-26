<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-bottom: 10px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="用户ID:">
                <el-input v-model="formInline.user_id" placeholder="输入用户ID"/>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                  <el-option label="等待审核" value="AUDIT_ING"/>
                  <el-option label="审核失败" value="AUDIT_FAIL"/>
                  <el-option label="审核成功" value="AUDIT_SUCCESS"/>
                  <el-option label="交易中" value="AUDIT_ING"/>
                  <el-option label="交易成功" value="TRADE_SUCCESS"/>
                  <el-option label="交易失败" value="TRADE_FAIL"/>
                </el-select>
              </el-form-item>
              <el-form-item label="撤回时间">
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
        <el-table :data="lotteryData" border>
          <el-table-column label="订单ID" width="230">
            <template #default="scope">
              <span class="">{{scope.row.order_id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="合伙人ID" width="150">
            <template #default="scope">
              <span class="">{{scope.row.uid}}</span>
            </template>
          </el-table-column>
          <el-table-column label="撤回数额(USDT)" width="150">
            <template #default="scope">
              {{scope.row.flow_amount}}
            </template>
          </el-table-column>
          <el-table-column label="撤回手续费(USDT)" width="150">
            <template #default="scope">
              <span>{{scope.row.withdraw_poundage}}</span>
            </template>
          </el-table-column>
          <el-table-column label="实际到账(USDT)" width="130">
            <template #default="scope">
              <span>{{scope.row.actual_amount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="120">
            <template #default="scope">
              <div>
                {{ toTime(dateToTs(scope.row.create_time), 'yyyy-MM-dd') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="380">
            <template #header>
              转出地址
            </template>
            <template #default="scope">
              <span class="">{{scope.row.from_address}}</span>
            </template>
          </el-table-column>
          <el-table-column width="380">
            <template #header>
              接受地址
            </template>
            <template #default="scope">
              <span class="">{{scope.row.to_address}}</span>
            </template>
          </el-table-column>
          <el-table-column label="转账网络" width="100">
            <template #default="scope">
              <span class="">{{scope.row.transfer_account}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <span v-if="scope.row.agent_margin_status_enum==='WAIT_AUDIT'">等待审核</span>
              <span v-if="scope.row.agent_margin_status_enum==='AUDIT_FAIL'">审核失败</span>
              <span v-if="scope.row.agent_margin_status_enum==='AUDIT_SUCCESS'">审核成功</span>
              <span v-if="scope.row.agent_margin_status_enum==='TRADE_SUCCESS'">交易成功</span>
              <span v-if="scope.row.agent_margin_status_enum==='TRADE_FAIL'">交易失败</span>
              <span v-if="scope.row.agent_margin_status_enum==='AUDIT_ING'">交易中</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button v-if="scope.row.agent_margin_status_enum==='WAIT_AUDIT'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
              >审核
              </el-button
              >
              <el-button v-if="scope.row.agent_margin_status_enum!=='WAIT_AUDIT'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
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
      <div v-if="resultData.status ==='WAIT_AUDIT'">
        <el-form :model="resultData">
          <el-form-item label="可撤回保证金：" label-width="120px">
            <el-input disabled v-model="resultData.expect_deposit" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="撤回数额：" label-width="120px">
            <el-input disabled v-model="resultData.flow_amount" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="网络：" label-width="120px">
            <el-input disabled v-model="resultData.transfer_account" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="撤回手续费：" label-width="120px">
            <el-input disabled v-model="resultData.withdraw_poundage" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提示：" label-width="120px">
            <span>若结算成功则实际到账为 <span style="color: red">{{resultData.actual_amount}}</span> USDT</span>
          </el-form-item>
          <el-form-item label="*审核：" label-width="120px">
            <el-select v-model="resultData.agent_margin_status_enum" placeholder="请选择">
              <el-option label="等待审核" value="WAIT_AUDIT"/>
              <el-option label="审核失败" value="AUDIT_FAIL"/>
              <el-option label="审核成功" value="AUDIT_SUCCESS"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      v-model="resultData.remark" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="resultData.status !=='WAIT_AUDIT'">
        <el-form :model="resultData">
          <el-form-item label="审核结果：" label-width="120px">
            <span v-if="resultData.agent_margin_status_enum==='AUDIT_FAIL'">审核失败</span>
            <span v-if="resultData.agent_margin_status_enum!=='AUDIT_FAIL'">审核成功</span>
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input :autosize="{ minRows: 2, maxRows: 4 }"
                      disabled
                      type="textarea"
                      v-model="resultData.remark" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="resultData.status !=='WAIT_AUDIT'" @click="dialogVisible = false">确认</el-button>
        <el-button v-if="resultData.status ==='WAIT_AUDIT'" type="primary" @click="handleSubmit"
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

const loading = ref(false)
const lotteryData = ref([])
const resultData = ref({
  id: '',
  agent_margin_status_enum: '',
  flow_amount: '',
  transfer_account: '',
  remark: '',
  withdraw_poundage	: '',
  actual_amount: '',
  status: '',
})
const dialogVisible = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})

const formInline = reactive({
  user_id: '',
  time: '',
  status: ''
})

// const getWithdrawAuthList = (param_) => {
//   loading.value = true
//   service.getWithdrawAuthList(param_).then(res => {
//     lotteryData.value = res.agentWithdrawDTOS
//     pagination.page_count = res.count
//     loading.value = false
//   })
// }

let params = {
  page: 1,
  size: 20
}
// getWithdrawAuthList(params)

const onSubmit = () => {
  lotteryData.value = []
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
    params.start_time = start_time
    params.end_time = end_time
  }
  if (formInline.partner_id.length !== 0){
    params.uid = formInline.partner_id
  }
  if (formInline.status.length !== 0){
    params.marginStatusEnum = formInline.status
  }
  // getWithdrawAuthList(params)
}



const onReset = () => {
  params = {
    page: 1,
    size: 20
  }
  formInline.partner_id = ''
  formInline.time = ''
  formInline.status = ''
}

const handleResult = (index, row) => {
  resultData.value.id = row.id
  resultData.value.remark = row.remark
  resultData.value.actual_amount = row.actual_amount
  resultData.value.status = row.agent_margin_status_enum
  resultData.value.agent_margin_status_enum = row.agent_margin_status_enum
  resultData.value.flow_amount = row.flow_amount
  resultData.value.transfer_account = row.transfer_account
  resultData.value.withdraw_poundage = row.withdraw_poundage
}

const handleClose = () => {
  dialogVisible.value = false
}

const onResultSubmit = () => {

}

const handleSubmit = () => {
  // service.postAgentMarginAuth({id: resultData.value.id, agent_margin_status_enum: resultData.value.agent_margin_status_enum, remark: resultData.value.remark}).then(res => {
  //   if (res ==='审核成功'){
  //     ElMessage({
  //       message: '审核成功！！！',
  //       type: 'success',
  //     })
  //   }
    // getWithdrawAuthList(params)
    dialogVisible.value = false
  // })
}

const handleProfitCurrentChange = (val) => {
  params.page = val
  // getWithdrawAuthList(params)
}
</script>

<style scoped>

</style>