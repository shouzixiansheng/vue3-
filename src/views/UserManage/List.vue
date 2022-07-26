<template>
<div>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div style="margin-left: 30px">
          <el-form :inline="true" :model="formInline" class="">
            <el-form-item label="用户搜索:" style="margin-right: 30px">
              <span>
                <el-select v-model="formInline.type" placeholder="请选择" style="width: 70px">
                <el-option label="ID" value="ID"/>
                <el-option label="等于0" value="0"/>
                <el-option label="小于0" value="-1"/>
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
              <span style="margin-right: 20px">{{ scope.row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="scope">
            <div>
              <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="邮箱号">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.agent_id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template #default="scope">
            <div>
              <span style="">{{ scope.row.agent_id }}</span>
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
              <span style="">{{ scope.row.agent_id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总资产(USDT)">
          <template #default="scope">
            <div>
              <span style="margin-right: 20px">{{ scope.row.available_balance }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template #default="scope">
            <div>
              <span style="margin-right: 20px">
                <el-switch
                    v-model="scope.row.active"
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

const formInline = reactive({
  type: 'ID',
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
userData.value.push({id: 1, create_time: '2022-07-25T14:16:51.051066'})
const loading = ref(false)
const onSubmit = () => {
  console.log(1)
}
const onReset = () => {
  console.log(2)
}

const isBan = (index, row) => {
  console.log(row)
}

const handleCurrentChange = (val) => {
  console.log(val)
}

const router = useRouter()
const handleDetail = (index, row) => {
  router.push({
    path: '/user/detail',
    query: {
      'address': row.id,
    }
  })
}

</script>

<style scoped>

</style>