<template>
<div>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div style="margin-left: 30px">
          <el-form :inline="true" :model="formInline" class="">
            <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-select v-model="formInline.type" placeholder="请选择" style="width: 90px">
                <el-option label="ID" value="uid"/>
                <el-option label="手机号" value="mobile"/>
                <el-option label="邮箱" value="email"/>
              </el-select>
              </span>
              <span>
                <el-input v-model="formInline.user" placeholder="请输入搜索内容" style="width: 150px"/>
              </span>
            </el-form-item>
            <el-form-item label="注册时间">
            <el-date-picker
                v-model="formInline.time"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
            />
            </el-form-item>
            <el-form-item label="代理:">
              <el-input v-model="formInline.agent" placeholder="请输入代理ID"/>
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
      <el-table :data="userData" border>
        <el-table-column label="用户ID">
          <template #default="scope">
            <div>
              <span style="margin-right: 20px">{{ scope.row.userId }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="scope">
            <div>
              <span style="">{{ toTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="邮箱号">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.email }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.mobile }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.nickName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上级代理">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.invite_user }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="国家">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.country }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总资产(USDT)">
          <template #default="scope">
            <div>
              <span style="margin-right: 20px">{{ scope.row.actualAmount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template #default="scope">
            <div>
              <span style="margin-right: 20px">
                <el-switch
                    v-model="scope.row.userStatus"
                    size="large"
                    inline-prompt
                    active-text="可用"
                    inactive-text="禁用"
                    @change="isBan(scope.$index, scope.row)"
                />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <div style="text-align: center">
              <el-button size="small" @click="handleDetail(scope.$index, scope.row)"
              >详情
              </el-button
              >
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
import { reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard} from "../../utils/public";
import * as service from '../../api/user'

const formInline = reactive({
  type: 'uid',
  user: '',
  time: '',
  agent: ''
})
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})
const userData = ref([])
const loading = ref(false)

let userParam = {
  page: 1,
  size: pagination.pageSize
}

const getUserQuery = (param_) => {
  loading.value = true
  service.getUserQuery(param_).then(res => {
    userData.value = res.items
    pagination.page_count = res.total
    loading.value = false
  })
}

getUserQuery(userParam)

const onSubmit = () => {
  if (formInline.user.length !== 0){
    if (formInline.type === 'uid'){
      userParam.uid = formInline.user
    }
    if (formInline.type === 'mobile'){
      userParam.mobile = formInline.user
    }
    if (formInline.type === 'email'){
      userParam.email = formInline.user
    }
  }
  if (formInline.agent.length !== 0){
    userParam.invite_user = formInline.agent
  }
  let start_time;
  let end_time;
  if (formInline.time != null && formInline.time.length === 2) {
    start_time = toTime(dateToTs(formInline.time[0]), 'yyyy-MM-dd')
    end_time = toTime(dateToTs(formInline.time[1]), 'yyyy-MM-dd')
    userParam.start_time = start_time
    userParam.end_time = end_time
  }
  getUserQuery(userParam)
}
const onReset = () => {
  formInline.time = ''
  formInline.type = 'uid'
  formInline.user = ''
  formInline.agent = ''
  userParam = {
    page: 1,
    size: pagination.pageSize
  }
}

const isBan = (index, row) => {
  service.postUpdateUserStatus({uid: row.id, status: row.userStatus}).then(res => {
    getUserQuery(userParam)
  })
}

const handleCurrentChange = (val) => {
  userParam.page = val
  getUserQuery(userParam)
}

const router = useRouter()
const handleDetail = (index, row) => {
  let myCurrency = {}
  for (const currenciesKey in row.currencies) {
    for (const key in row.currencies[currenciesKey]){
      if (key === 'balance' || key === 'freeze' || key === 'remain') {
        myCurrency[row.currencies[currenciesKey].currencyType + '_' + key] = row.currencies[currenciesKey][key]
      }
    }
  }
  for (const currencyKey in myCurrency) {
    row[currencyKey] = myCurrency[currencyKey]
  }
  router.push({
    path: '/user/detail',
    query: row
  })
}

</script>

<style scoped>

</style>