<template>
  <div>
    <div>
      <el-row :gutter="20" justify="center">
        <el-col :span="24">
          <el-card shadow="hover" class="mgb20" style="">
            <div style="margin-left: 30px">
              <div>
                <p class="p1">基础信息</p>
                <br>
                <el-descriptions
                    class="margin-top"
                    :column="5"
                >
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    <div>
                      <span>
                      <img src="@/assets/img/img.jpg" class="user-avator" alt />
                    </span>
                      <span class="user-avator-text">
                      <ul style="list-style-type: none;">
                        <li>{{params.nickName}}</li>
                        <li>{{params.userId}}</li>
                      </ul>
                    </span>
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    <span style="visibility: hidden;">----</span>
                    <span class="small-title">手机号:</span> <span>{{params.mobile}}</span>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    <span class="small-title">邮箱:</span> <span>{{params.email}}</span><span v-if="params.email===null">未绑定</span>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    <span class="small-title">注册时间：</span>{{ toTime(params.createTime, 'yyyy-MM-dd HH:mm:ss') }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    <span class="small-title">上级代理：</span><span>{{params.invite_user}}</span><span v-if="params.invite_user===null">无</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div class="div1" style="margin-left: 30px">
              <div>
                <p class="p1">资产信息</p>
                <br>
                <el-descriptions
                    class="margin-top"
                    :column="1"
                >
                  <el-descriptions-item v-for="data in wallet_data">
                    <template #label>
                      <span class="small-title">{{ data.key }}:</span>
                    </template>
                    <span>
                  {{ data.val }} <el-icon @click="handleCopy(data.val)"><DocumentCopy/></el-icon>
                </span>
                  </el-descriptions-item>
                </el-descriptions>
                <div style="margin-top: 2%">
                  <el-descriptions
                      class="margin-top"
                      :column="4"
                  >
                    <template #title>
                      <span style="font-size: 13px">总资产折算(USDT)：<span>{{params.actualAmount}}</span></span>
                    </template>
                    <el-descriptions-item v-for="data in assets_data">
                      <template #label>
                        <span class="small-title">{{ data.key }}:</span>
                      </template>
                      <span>
                  <span>{{ data.val === undefined ? 0 : data.val}}</span><span> (锁定: {{ data.lock === undefined ? 0 : data.lock }})</span>
                </span>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </div>
            <div style="margin-left: 30px; margin-bottom: 5%; margin-top: 5%">
              <div>
                <p class="p1">数据</p>
                <br>
                <el-descriptions
                    class="margin-top"
                    :column="6"
                >
                  <el-descriptions-item v-for="(data, index) in static_data">
                <span>
                  <el-button size="large" style="width: 98px"
                             @click="openDialog(index, data)">{{ data.name }}</el-button>
                </span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-drawer
          v-model="static_data[myIndex].dialog"
          direction="rtl"
          size="50%"
          :title="static_data[myIndex].name"
      >
        <div class="dialog-div">
          <el-descriptions
              class="margin-top"
              :column="3"
          >
            <el-descriptions-item>
              <template #label>
                创建时间:
              </template>
              <el-date-picker
                  v-model="formInline.time"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
              />
            </el-descriptions-item>
            <el-descriptions-item>
              <el-button type="primary" @click="onSubmit(myIndex)">搜索</el-button>
            </el-descriptions-item>
            <el-descriptions-item>
              <el-button @click="onReset(myIndex)">重置</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="dialog-div" v-if="myIndex===0">
          <div>
            <el-descriptions
                class="margin-top"
                :column="2"
            >
              <el-descriptions-item>
                <template #label>
                  支出结算(USDT):
                </template>
                {{static_data[0]['paidAmount']}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  收入(USDT):
                </template>
                {{static_data[myIndex]['increaseAmount']}}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" max-height="500" border>
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
                    <span style="">{{ scope.row.amount }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===1">
          <div>
            <el-descriptions
                class="margin-top"
                :column="1"
            >
              <el-descriptions-item>
                <template #label>
                  充值金额(USDT):
                </template>
                {{static_data[myIndex].totalAmount}}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" max-height="500" border>
              <el-table-column label="网络">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.network }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="转出地址" width="200">
                <template #default="scope">
                  <div>
                    <span style="">{{scope.row.fromAddress}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接收地址" width="200">
                <template #default="scope">
                  <div>
                    <span style="">{{scope.row.toAddress}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="交易哈希">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.hash }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===2">
          <div>
            <el-descriptions
                class="margin-top"
                :column="1"
            >
              <el-descriptions-item>
                <template #label>
                  提现金额折算((USDT):
                </template>
                245034.45
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="银行卡号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.bankCardNumber }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.remark }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="到账时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.modifiedTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="交易截图" fixed="right" width="100">
                <template #default="scope">
                  <div style="text-align: center">
                    <el-button size="small" @click="showImg(scope.$index, scope.row)"
                    >查看
                    </el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===3">
          <div>
            <el-descriptions
                class="margin-top"
                :column="1"
            >
              <el-descriptions-item>
                <template #label>
                  提现金额(USDT):
                </template>
                {{static_data[myIndex].totalAmount}}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" max-height="500" border>
              <el-table-column label="订单号" width="180">
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
              <el-table-column label="状态" width="100">
                <template #default="scope">
                  <div>
                    <span style="">{{withdrawStatus[scope.row.status]}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现数额(USDT)" width="100">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.amount }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现手续费(USDT)" width="100">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.fee }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="实际到账(USDT)" width="100">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.actualAmount }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现网络" width="100">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.network }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="转出地址" width="200">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.fromAddress }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接收地址" width="200">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.toAddress }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="交易哈希" width="200">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.hash }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="到账时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.completeTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===4">
          <div>
            <el-descriptions
                class="margin-top"
                :column="4"
            >
              <el-descriptions-item v-for="(v,k) in transfer_data">
                <template #label>
                  <span v-if="k.split('_')[0]==='from'">转出金额</span>
                  <span v-if="k.split('_')[0]==='to'">转入金额</span>
                  ({{k.split('_')[1]}}):
                </template>
                <span>{{v}}</span>
              </el-descriptions-item>

            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
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
                    <span style="">{{ scope.row.amount }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template #default="scope">
                  <div>
                    <span style="">{{ transferType[scope.row.transferType] }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="对方账号ID">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.otherUid }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="对方账号名">
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
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===5">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="订单号" width="200">
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
                    <span style="">{{ scope.row.inputAmount }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="汇兑手续费">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.profit }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="实际获得">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.baseAmount }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===6">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="订单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="货币对">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="消耗">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="汇兑手续费">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="实际获得">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===7">
          <div>
            <el-descriptions
                class="margin-top"
                :column="1"
            >
              <el-descriptions-item>
                <template #label>
                  充值金额((USDT):
                </template>
                245034.45
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="订单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="国家">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="充值号码">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="充值金额(USDT)">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="运营商">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商家订单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===8">
          <div>
            <el-descriptions
                class="margin-top"
                :column="1"
            >
              <el-descriptions-item>
                <template #label>
                  缴费金额((USDT):
                </template>
                245034.45
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="订单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="缴费单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="缴费金额(USDT)">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="收费单位">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商家订单号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===9">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="银行名">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.bankName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="持卡人">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.nickName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="卡号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.bankCard }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="支行">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.bankAddress }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="添加时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ toTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否默认">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px" v-if="scope.row.hasDefault===true">是</span>
                    <span style="margin-right: 20px" v-else>否</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===10">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="地址ID" width="200">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="网络" width="100">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.network }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="收款地址" width="200">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.addressCollection }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="180">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.remark }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="添加时间" width="200">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ toTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否默认">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px" v-if="scope.row.hasDefault===true">是</span>
                    <span style="margin-right: 20px" v-else>否</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===11">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="园区">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="详细地址">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="收货手机号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="收货人">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="添加时间">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否默认">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div>
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
      </el-drawer>
    </div>
    <el-dialog v-model="showImgDialogVisible" title="查看图片" width="40%" center>
      <div style="text-align: center">
        <el-image style="width: auto;height: auto;" fit="contain" :src="show_url"/>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="showImgDialogVisible = false"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard} from "../../utils/public";
import {ElMessage} from "element-plus";
import * as service from '../../api/user'
import * as funds from '../../api/funds'


const myIndex = ref(0)
const show_url = ref('')
const showImgDialogVisible = ref(false)
const formInline = ref({
  time: ''
})
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  page_count: 15
})

const wallet_data = reactive([
  {
    key: 'TRC',
    val: ''
  },
  {
    key: 'ERC',
    val: ''
  },
  {
    key: 'BEP',
    val: ''
  },
])


const assets_data = reactive([
  {
    key: 'USDT',
    val: 0,
    lock: 0,
    type: 'USDT'
  },
  {
    key: '美元($)',
    val: 0,
    lock: 0,
    type: 'USD'
  },
  {
    key: '人民币(￥)',
    val: 0,
    lock: 0,
    type: 'CNY'
  },
  {
    key: '泰铢(THB)',
    val: 0,
    lock: 0,
    type: 'THB'
  },
])

const static_data = ref([
  {
    name: '账单',
    dialog: false,
    tableData: [],
    paidAmount: '',
    increaseAmount: ''
  },
  {
    name: '充值',
    dialog: false,
    tableData: [],
    totalAmount: ''
  },
  {
    name: '法币提现',
    dialog: false,
    tableData: []
  },
  {
    name: 'U币提现',
    dialog: false,
    tableData: [],
    totalAmount: ''
  },
  {
    name: '转账',
    dialog: false,
    tableData: []
  },
  {
    name: '平台闪兑',
    dialog: false,
    tableData: []
  },
  {
    name: '市场汇兑',
    dialog: false,
    tableData: []
  },
  {
    name: '话费充值',
    dialog: false,
    tableData: []
  },
  {
    name: '生活缴费',
    dialog: false,
    tableData: []
  },
  {
    name: '银行卡',
    dialog: false,
    tableData: []
  },
  {
    name: '地址簿',
    dialog: false,
    tableData: []
  },
  {
    name: '收货地址',
    dialog: false,
    tableData: []
  }
])

const transfer_data = reactive({
  from_CNY: 0,
  from_THB: 0,
  from_USD: 0,
  from_USDT: 0,
  to_CNY: 0,
  to_THB: 0,
  to_USD: 0,
  to_USDT: 0,
})
const router = useRouter()
let params = router.currentRoute.value.query // query参数跳转
for (const key in assets_data) {
  assets_data[key].val = params[assets_data[key].type+'_balance']
  assets_data[key].lock = params[assets_data[key].type+'_freeze']
}
service.getUserAddress({uid: params.userId}).then(res => {
  wallet_data[0].val = res.tron
  wallet_data[1].val = res.eth
  wallet_data[2].val = res.bsc
})

const getCurrencyLogStat = (param_) => {
  service.getCurrencyLogStat(param_).then(res => {
    static_data.value[myIndex.value].increaseAmount = res.increaseAmount
    static_data.value[myIndex.value].paidAmount = res.paidAmount
  })
}
const getRechargeStat = (param_) => {
  service.getRechargeStat(param_).then(res => {
    static_data.value[myIndex.value].totalAmount = res.totalAmount
  })
}
const getUsdtWithdrawStat = (param_) => {
  service.getRechargeStat(param_).then(res => {
    static_data.value[myIndex.value].totalAmount = res.totalAmount
  })
}

const getUserStatistical = (param_) => {
  service.getUserStatistical(param_).then(res => {
    for (const resKey in res) {
      transfer_data[resKey] = res[resKey]
    }
    // static_data.value[myIndex.value].totalAmount = res.totalAmount
  })
}

const getCurrencyList = (param_) => {
  funds.getCurrencyList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

const getRechargeList = (param_) => {
  funds.getRechargeList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}
const getUsdtWithdrawalList = (param_) => {
  funds.getUsdtWithdrawalList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.count
  })
}

const getExpressExchangeList = (param_) => {
  funds.getExpressExchangeList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

const getFlatMoneyWithdrawalList = (param_) => {
  funds.getFlatMoneyWithdrawalList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

const getTransferList = (param_) => {
  funds.getTransferList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

const getBankList = (param_) => {
  funds.getBankList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

const getAddressCollectionList = (param_) => {
  funds.getAddressCollectionList(param_).then(res => {
    static_data.value[myIndex.value].tableData = res.items
    pagination.page_count = res.total
  })
}

let myParams = {
  page: 1,
  size: pagination.pageSize,
  uid: params.userId
}

const dialogSwitch = (index) => {
  if (index === 0) {
    getCurrencyLogStat(myParams)
    getCurrencyList(myParams)
  }
  if (index === 1) {
    getRechargeStat(myParams)
    getRechargeList(myParams)
  }
  if (index === 2) {
    getFlatMoneyWithdrawalList(myParams)
  }
  if (index === 3) {
    getUsdtWithdrawStat(myParams)
    getUsdtWithdrawalList(myParams)
  }
  if (index === 4) {
    getTransferList(myParams)
    getUserStatistical(myParams)
  }
  if (index === 5) {
    getExpressExchangeList(myParams)
  }
  if (index === 9) {
    getBankList(myParams)
  }
  if (index === 10) {
    getAddressCollectionList(myParams)
  }
}

const openDialog = (index, data) => {
  formInline.value.time = ''
  static_data.value[index].dialog = true
  static_data.value[index].tableData = []
  myIndex.value = index
  dialogSwitch(index)
  console.log(index, data)
}

const onSubmit = (index) => {
  let start_time;
  let end_time;
  if (formInline.value.time != null && formInline.value.time.length === 2) {
    start_time = toTime(dateToTs(formInline.value.time[0]), 'yyyy-MM-dd')
    end_time = toTime(dateToTs(formInline.value.time[1]), 'yyyy-MM-dd')
    myParams.startTime = start_time
    myParams.endTime = end_time
  }

  dialogSwitch(index)

  console.log(index)
}

const onReset = (index) => {
  myParams = {
    page: 1,
    size: pagination.pageSize,
    uid: params.userId
  }
  formInline.value.time = ''
  console.log(index)
}

const handleCopy = async (val) => {
  try {
    await toClipboard(val)
    ElMessage({
      message: '复制成功！！！',
      type: 'success',
    })
  } catch (e) {
    console.error(e)
  }
}

const handleCurrentChange = (val) => {
  myParams.page = val
  dialogSwitch(myIndex.value)
}

const showImg = (index, row) => {
  show_url.value = row.image
  showImgDialogVisible.value = true
}
let withdrawStatus = {
  created: '新创建/待审核',
  review_fail: '审核失败',
  review_success: '审核成功',
  withdrawing: '提现中',
  withdraw_fail: '提现失败',
  withdraw_success: '提现成功',
}

let transferType = {
  TRANSFER: '转账',
  SCAN_CODE: '扫码',
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

.user-avator {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user-avator-text {
  position: absolute;
  margin-top: 5px;
  margin-left: 5px;
}
.small-title {
  color: #8d8d8d;
}
</style>