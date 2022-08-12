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
          <el-table-column label="创建时间" width="200">
            <template #default="scope">
              {{ tsToDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="用户ID" width="150">
            <template #default="scope">
              {{scope.row.uid}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template #default="scope">
              <span>{{withdrawStatus[scope.row.withdrawStatus]}}</span>
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
              提现币种
            </template>
            <template #default="scope">
              <span class="">{{scope.row.currencyType}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              提现银行卡名
            </template>
            <template #default="scope">
              <span class="">{{scope.row.bankName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header>
              持卡人
            </template>
            <template #default="scope">
              <span class="">{{scope.row.nickName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200">
            <template #header>
              银行卡号
            </template>
            <template #default="scope">
              <span class="">{{scope.row.bankCardNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="到账时间" width="180">
            <template #default="scope">
              <span v-if="scope.row.modifiedTime!==null">{{ tsToDate(scope.row.modifiedTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button v-if="scope.row.withdrawStatus==='created'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
              >审核
              </el-button
              >
              <el-button v-if="scope.row.withdrawStatus!=='created'" size="small" type="primary" @click="dialogVisible=true; handleResult(scope.$index, scope.row)"
              >审核记录
              </el-button
              >

              <el-button size="small" v-if="scope.row.withdrawStatus==='review_success'" type="primary" @click="dialogImgVisible=true; handleImgResult(scope.$index, scope.row)"
              >
                上传截图
                <span v-if="scope.row.withdrawStatus==='withdraw_success'">查看截图</span>
              </el-button
              >
              <el-button size="small" v-if="scope.row.withdrawStatus==='withdraw_success'" type="primary" @click="dialogImgVisible=true; handleImgResult(scope.$index, scope.row)"
              >
                查看截图
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          style="margin-top: 10px;text-align: end;"
          v-model:currentPage="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :background="background = true"
          layout="prev, pager, next"
          :total="pagination.page_count"
          @current-change="handleProfitCurrentChange"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" title="审核结果" width="50%" :before-close="handleClose">
      <div v-if="resultData.iwithdrawStatus ==='created'">
        <el-form :model="resultData">
          <el-form-item label="提现币种：" label-width="120px">
            <el-input disabled v-model="resultData.currencyType" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提现数额：" label-width="120px">
            <el-input disabled v-model="resultData.amount" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提现银行卡名：" label-width="120px">
            <el-input disabled v-model="resultData.bankName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="持卡人：" label-width="120px">
            <el-input disabled v-model="resultData.nickName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="银行卡号：" label-width="120px">
            <el-input disabled v-model="resultData.bankCardNumber" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提现手续费：" label-width="120px">
            <el-input disabled v-model="resultData.fee" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="提示：" label-width="120px">
            <span>若结算成功则实际到账为 <span style="color: red">{{resultData.actualAmount}}</span> USDT</span>
          </el-form-item>
          <el-form-item label="*审核：" label-width="120px">
            <el-select v-model="resultData.withdrawStatus" placeholder="请选择">
              <el-option label="待审核" value="created"/>
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
      <div v-if="resultData.iwithdrawStatus !=='created'">
        <el-form :model="resultData">
          <el-form-item label="审核结果：" label-width="120px">
            <span v-if="resultData.withdrawStatus==='review_fail'">审核失败</span>
            <span v-if="resultData.withdrawStatus!=='review_fail'">审核成功</span>
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
        <el-button v-if="resultData.iwithdrawStatus !=='created'" @click="dialogVisible = false">确认</el-button>
        <el-button v-if="resultData.iwithdrawStatus ==='created'" type="primary" @click="handleSubmit"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogImgVisible" title="截图" width="50%">
      <div v-if="resultData.iwithdrawStatus ==='review_success'">
        <el-form :model="resultData">
          <el-form-item label="*提现结果：" label-width="120px">
            <el-select v-model="resultData.withdrawStatus" placeholder="请选择">
              <el-option label="提现成功" value="withdraw_success"/>
              <el-option label="提现失败" value="withdraw_fail"/>
            </el-select>
          </el-form-item>
          <el-form-item label="上传截图：" label-width="120px">
            <el-upload
                action='#'
                :http-request="uploadInAction"
                :show-file-list="false"
                :auto-upload="true"
                :on-success="handleInAvatarSuccess"
                :before-upload="beforeUpload" class="left-view">
              <img v-if="resultData.img" :src="resultData.img" class="avatar"/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="resultData.iwithdrawStatus ==='withdraw_success'">
        <el-form :model="resultData">
          <el-form-item label-width="120px">
            <img v-if="resultData.img" :src="resultData.img" class="avatar"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button v-if="resultData.iwithdrawStatus ==='withdraw_success'" @click="dialogImgVisible = false">确认</el-button>
        <el-button v-if="resultData.iwithdrawStatus ==='review_success'" type="primary" @click="handleImgSubmit"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

  </div>

</template>

<script lang="ts" setup>
import {dateToTs, format as toTime, parseTo, tsToDate} from "../../utils/public";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import * as service from '../../api/funds'
import * as ipublic from '../../api/public'
import axios from "axios";


const loading = ref(false)
const withdrawData = ref([])
const resultData = ref({
  withdrawStatus: '',
  iwithdrawStatus: '',
  id: '',
  remark: '',
  currencyType: '',
  bankName: '',
  nickName: '',
  bankCardNumber: '',
  actualAmount: '',
  amount: '',
  fee: '',
  img: '',
})
const dialogVisible = ref(false)
const dialogImgVisible = ref(false)
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

const getFlatMoneyWithdrawalList = (param_) => {
  loading.value = true
  service.getFlatMoneyWithdrawalList(param_).then(res => {
    withdrawData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

let params = {
  page: 1,
  size: 20
}
getFlatMoneyWithdrawalList(params)

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
    start_time = dateToTs(formInline.time[0])
    end_time = dateToTs(formInline.time[1])
    params.startTime = start_time
    params.endTime = end_time
  }
  if (formInline.uid.length !== 0){
    params.uid = formInline.uid
  }
  if (formInline.status.length !== 0){
    params.status = formInline.status
  }
  getFlatMoneyWithdrawalList(params)
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
  resultData.value.remark = row.remark
  resultData.value.actualAmount = row.actualAmount
  resultData.value.withdrawStatus = row.withdrawStatus
  resultData.value.iwithdrawStatus = row.withdrawStatus
  resultData.value.amount = row.amount
  resultData.value.img = row.image
  resultData.value.fee = row.fee
  resultData.value.bankCardNumber = row.bankCardNumber
  resultData.value.currencyType = row.currencyType
  resultData.value.bankName = row.bankName
  resultData.value.nickName = row.nickName
}

const handleImgResult = (index, row) => {
  resultData.value.withdrawStatus = ''
  resultData.value.iwithdrawStatus = row.withdrawStatus
  resultData.value.img = row.image
  resultData.value.id = row.id
  console.log(resultData.value.img)
}

const handleClose = () => {
  dialogVisible.value = false
}

const onResultSubmit = () => {

}

const handleSubmit = () => {
  let result;
  console.log(resultData.value.withdrawStatus)
  if (resultData.value.withdrawStatus === 'review_success') {
    result = true
  }
  if (resultData.value.withdrawStatus === 'review_fail') {
    result = false
  }
  service.postFlatMoneyWithdrawalAudit({id: resultData.value.id, result: result, note: resultData.value.remark}).then(res => {
    if (res === null){
      ElMessage({
        message: '审核成功！！！',
        type: 'success',
      })
    }
    getFlatMoneyWithdrawalList(params)
    dialogVisible.value = false
  })
}

const handleImgSubmit = () => {
  let result;
  if (resultData.value.withdrawStatus === 'withdraw_success') {
    result = true
  }
  if (resultData.value.withdrawStatus === 'withdraw_fail') {
    result = false
  }
  service.postFlatMoneyWithdrawalEvidence({id: resultData.value.id, result: result, image: resultData.value.img}).then(res => {
    if (res === null){
      ElMessage({
        message: '审核成功！！！',
        type: 'success',
      })
    }
    getFlatMoneyWithdrawalList(params)
    dialogImgVisible.value = false
  })
}

const handleProfitCurrentChange = (val) => {
  params.page = val
  getFlatMoneyWithdrawalList(params)
}

const uploadInAction = (option) => {
  let signData;
  ipublic.getImgPreSign({filename: option.file.name}).then(res => {
    signData = res
    let form_data = new FormData()
    for (let v in res.fields) {
      form_data.append(v, res.fields[v])
    }
    form_data.append('file', option.file)

    axios.post(res.url, form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(res => {
      resultData.value.img = signData.url + '/' + signData.fields.key
    })
  })
}

const handleInAvatarSuccess = (response, uploadFile) => {
  resultData.value.img = URL.createObjectURL(uploadFile.raw)
}

const beforeUpload = (file) => {
  const type = ['image/jpeg', 'image/jpg', 'image/png']
  if (type.indexOf(file.type) === -1) {
    ElMessage.error('上传的文件必须是JPG、JPEG、PNG三种之一!')
    return false
  } else if (file.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过4MB!')
    return false
  }
  return true
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
.el-icon.avatar-uploader-icon {
  margin-top: 40px;
  font-size: 100px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  text-align: center;
  width: 178px;
  height: 178px;
  /*display: block;*/
}
</style>