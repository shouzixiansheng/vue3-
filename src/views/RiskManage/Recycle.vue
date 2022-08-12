<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="margin-bottom: 10px">
            <el-form :inline="true" :model="formInline" class="">
              <el-form-item label="交易哈希:">
                <el-input v-model="formInline.hash" placeholder="输入交易Hash"/>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                  <el-option label="待归集" value="0"/>
                  <el-option label="正在归集" value="1"/>
                  <el-option label="归集成功" value="2"/>
                  <el-option label="归集失败" value="3"/>
                </el-select>
              </el-form-item>
              <span style="margin-left: 20px"></span>
              <el-form-item label="时间">
                <el-date-picker
                    v-model="formInline.time"
                    type="datetimerange"
                    range-separator="To"
                    start-placeholder="选择开始时间"
                    end-placeholder="选择结束时间"
                />
              </el-form-item>
              <span style="margin-left: 20px"></span>

              <el-form-item label="网络">
                <el-select v-model="formInline.network" placeholder="请选择">
                  <el-option label="ERC20" value="usdt_erc20"/>
                  <el-option label="TRC20" value="usdt_trc20"/>
                  <el-option label="BEP20" value="usdt_bep20"/>
                </el-select>
              </el-form-item>
              <div style="text-align: end">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" @click="onReset">重置</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="dialogVisible=true"
                  >归集
                  </el-button
                  >
                </el-form-item>

              </div>
            </el-form>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-table :data="lotteryData" border>
          <el-table-column label="归集时间" width="120">
            <template #default="scope">
              <div>
                {{ tsToDate(scope.row.create_time) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>
              归集数额(USDT)
            </template>
            <template #default="scope">
              <span class="">{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>
              网络
            </template>
            <template #default="scope">
              <span class="">{{scope.row.network}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易哈希" width="350">
            <template #default="scope">
              <span class="">{{scope.row.hash}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <span v-if="scope.row.status===0">待归集</span>
              <span v-if="scope.row.status===1">正在归集</span>
              <span v-if="scope.row.status===2">归集成功</span>
              <span v-if="scope.row.status===3">归集失败</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" @click="dialogResultVisible=true; handleResult(scope.$index, scope.row)"
              >详情
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

    <el-dialog v-model="dialogVisible" title="归集" width="50%" :before-close="handleClose">
      <div>
        <el-form :model="resultData">
          <el-form-item label="*币种类型：" label-width="120px">
            <el-radio-group v-model="resultData.network">
              <el-radio label="USDT-ERC20"/>
              <el-radio label="USDT-TRC20"/>
              <el-radio label="USDT-BEP20"/>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*归集地址：" label-width="120px">
            <el-input v-model="resultData.to" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogResultVisible" title="详情" width="80%">
      <div>
        <el-table :data="detailData" border>
          <el-table-column label="保证金地址">
            <template #default="scope">
              <div>
                {{scope.row.address}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="归集金额" >
            <template #default="scope">
              <div>
                {{scope.row.amount}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;text-align: end;"
            v-model:currentPage="detailPagination.currentPage"
            v-model:page-size="detailPagination.pageSize"
            :background="background = true"
            layout="prev, pager, next"
            :total="detailPagination.page_count"
            @current-change="handleDetailCurrentChange"
        />
      </div>
    </el-dialog>

  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard, tsToDate} from "../../utils/public";
import * as service from '../../api/risk'

const loading = ref(false)
const lotteryData = ref([])
const detailData = ref([])
const resultData = ref({
  network: '',
  to: '',
})
const dialogVisible = ref(false)
const dialogResultVisible = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})
const detailPagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})

const formInline = reactive({
  time: '',
  status: '',
  network: '',
  hash: '',
})


const getRecoveryLog = (param_) => {
  loading.value = true
  service.getRecoveryLog(param_).then(res => {
    lotteryData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

let params = {
  page: 1,
  size: 20
}
getRecoveryLog(params)

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
    start_time = dateToTs(formInline.time[0])
    end_time = dateToTs(formInline.time[1])
    params.start_time = start_time
    params.end_time = end_time
  }
  if (formInline.network.length !== 0){
    params.network = formInline.network
  }
  if (formInline.status.length !== 0){
    params.status = formInline.status
  }
  if (formInline.hash.length !== 0){
    params.hash = formInline.hash
  }
  getRecoveryLog(params)
}



const onReset = () => {
  params = {
    page: 1,
    size: 20
  }
  formInline.status = ''
  formInline.hash = ''
  formInline.network = ''
  formInline.time = ''
}


const handleClose = () => {
  dialogVisible.value = false
}


const handleSubmit = () => {
  if (resultData.value.network === "USDT-BEP20"){
    resultData.value.network = 'BEP20'
  }
  if (resultData.value.network === "USDT-TRC20"){
    resultData.value.network = 'TRC20'
  }
  if (resultData.value.network === "USDT-ERC20"){
    resultData.value.network = 'ERC20'
  }
  service.postRecovery(resultData.value).then(res => {
    console.log(res)
  })
  resultData.value.network = ''
  resultData.value.to = ''
  dialogVisible.value = false
  getRecoveryLog(params)
}

const handleProfitCurrentChange = (val) => {
  params.page = val
  getRecoveryLog(params)
}

let detailParam = {
  page: 1,
  size: 20
}
let myhash;

const getRecoveryLogDetail = (hash, param_) => {
  service.getRecoveryLogDetail(hash, param_).then(res => {
    detailData.value = res.items
    detailPagination.page_count = res.total
  })
}

const handleResult = (index, row) => {
  detailParam = {
    page: 1,
    size: 20
  }
  myhash = row.hash
  // detailParam.address = row.to
  getRecoveryLogDetail(myhash, detailParam)
}

const handleDetailCurrentChange = (val) => {
  detailParam.page = val
  getRecoveryLogDetail(myhash, detailParam)
}
</script>

<style scoped>

</style>