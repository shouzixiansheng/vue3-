<template>
  <div>
    <el-row :gutter="20" justify="center">
      <el-col :span="24">
        <el-card shadow="hover" class="mgb20" style="">
          <div class="" style="margin-left: 30px">
            <div>
              <p class="p1">提现</p>
              <br>
              <div style="margin-top: 1%">
                <el-descriptions
                    class="margin-top"
                    :column="3"
                >
                  <el-descriptions-item v-for="(data,index) in withdraw_data">
                    <template #label>
                      {{ data.key }}:
                    </template>
                    <span>
                      <el-input v-model="withdraw_data[index].val" placeholder="请输入" style="width: 150px"/>
                    </span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div style="margin-top: 3%">
              <p class="p1">汇兑</p>
              <br>
              <div>
                <el-descriptions
                    class="margin-top"
                    :column="3"
                >
                  <el-descriptions-item v-for="(data,index) in exchange_data">
                    <template #label>
                      {{ data.key }}(%):
                    </template>
                    <span>
                      <el-input v-model="exchange_data[index].val" placeholder="请输入" style="width: 150px"/>
                    </span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 5%">
            <el-button type="primary" @click="onSubmit">确认</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard} from "../../utils/public";
import {ElMessage} from "element-plus";
import * as service from '../../api/risk'


const withdraw_data = reactive([
  {
    key: 'u币单日提现最大额度   ',
    val: '',
  },
  {
    key: '法币单日提现最大额度',
    val: '',
  },
  {
    key: 'U币提现手续费(单位：U)',
    val: '',
  },
  {
    key: '法币提现手续费(单位：%)',
    val: '',
  },
  {
    key: 'u币人工审核最低值(包含)',
    val: '',
  },
])

const exchange_data = reactive([
  {
    key: '美元/USDT溢价',
    val: '',
  },
  {
    key: '美元/人民币溢价',
    val: '',
  },
  {
    key: '美元/泰铢溢价',
    val: '',
  },
  {
    key: 'USDT/人民币溢价',
    val: '',
  },
  {
    key: 'USDT/泰铢溢价',
    val: '',
  },
  {
    key: '泰铢/人民币溢价',
    val: '',
  },
])

const getRiskConfig = () => {
  service.getRiskConfig().then(res => {
    withdraw_data[0].val = res.usdtWithdrawalDailyLimit
    withdraw_data[2].val = res.usdtWithdrawalFixedFee
    withdraw_data[4].val = res.usdtWithdrawalAuditAmount
    exchange_data[1].val = res.usdCnyFloat * 100
    exchange_data[2].val = res.usdThbFloat * 100
    exchange_data[0].val = res.usdUsdtFloat * 100
    exchange_data[3].val = res.usdtCnyFloat * 100
    exchange_data[4].val = res.usdtThbFloat * 100
    exchange_data[5].val = res.thbCnyFloat * 100
  })
}

getRiskConfig()

const onSubmit = () => {
  let _exchange_data = exchange_data
  let param = {
    usdtWithdrawalDailyLimit: withdraw_data[0].val,
    usdtWithdrawalFixedFee: withdraw_data[2].val,
    usdtWithdrawalAuditAmount: withdraw_data[4].val,
    usdCnyFloat: _exchange_data[1].val / 100,
    usdThbFloat: _exchange_data[2].val / 100,
    usdUsdtFloat: _exchange_data[0].val / 100,
    usdtCnyFloat: _exchange_data[3].val / 100,
    usdtThbFloat: _exchange_data[4].val / 100,
    thbCnyFloat: _exchange_data[5].val / 100,
  }
  service.postRiskConfigUpdate(param).then(res => {
    if (res === null) {
      ElMessage({
        message: '设置成功！！！',
        type: 'success',
      })
      getRiskConfig()
    }
  })
}


</script>

<style scoped>
.p1 {
  border-left: 2px solid #409EFF;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
}

.p2 {
  margin-top: 10px;
}

.sp1 {
  font-size: 14px;
}

.div1 {
  margin-top: 5%;
}

.li1 {
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.sp2 {
  font-size: 14px;
  color: #999;
}
.dialog-div {
  margin-left: 3%;
  margin-top: 1%;
}
</style>