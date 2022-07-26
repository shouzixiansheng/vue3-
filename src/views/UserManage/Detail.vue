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
                    <span>
                  用户名
                </span>
                    <br>
                    <span>
                  id
                </span>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    手机号: 18100000000
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    邮箱: 未绑定
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    注册时间：2019-07-27 19:35:30
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>

                    </template>
                    上级代理：4567890987654
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
                      {{ data.key }}:
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
                      <span style="font-size: 13px">总资产折算(USDT)：<span>354,5646.78</span></span>
                    </template>
                    <el-descriptions-item v-for="data in assets_data">
                      <template #label>
                        {{ data.key }}:
                      </template>
                      <span>
                  <span>{{ data.val }}</span><span> (锁定: {{ data.lock }})</span>
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
                245034.45
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  收入(USDT):
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
              <el-table-column label="说明">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
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
                245034.45
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="网络">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="转出地址" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接收地址" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="交易哈希">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
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
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="到账时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
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
              <el-table-column label="状态" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现数额(USDT)">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现手续费(USDT)">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="实际到账(USDT)">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="提现网络">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="转出地址">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="接收地址">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="交易哈希">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="到账时间" width="180">
                <template #default="scope">
                  <div>
                    <span style="">{{ toTime(scope.row.create_time, 'yyyy-MM-dd HH:mm:ss') }}</span>
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
                :column="2"
            >
              <el-descriptions-item>
                <template #label>
                  转出金额(USDT):
                </template>
                245034.45
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  转入金额(USDT):
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
              <el-table-column label="币种">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.username }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="对方账号ID">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="对方账号名">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <div>
                    <span style="">{{ scope.row.agent_id }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-div" v-if="myIndex===5">
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
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="持卡人">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="卡号">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="支行">
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
        <div class="dialog-div" v-if="myIndex===10">
          <div>
            <el-table :data="static_data[myIndex].tableData" border>
              <el-table-column label="网络">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="收款地址">
                <template #default="scope">
                  <div>
                    <span style="margin-right: 20px">{{ scope.row.id }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注">
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
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {dateToTs, format as toTime, parseTo, toClipboard} from "../../utils/public";
import {ElMessage} from "element-plus";

const myIndex = ref(0)

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
    val: 'TRSy3YtZN2Q5x85FKitmaWygqvCnHUpybi'
  },
  {
    key: 'ERC',
    val: 'TRSy3YtZN2Q5x85FKitmaWygqvCnHUpybi'
  },
  {
    key: 'BEP',
    val: 'TRSy3YtZN2Q5x85FKitmaWygqvCnHUpybi'
  },
])

const assets_data = reactive([
  {
    key: 'USDT',
    val: 3000,
    lock: 2000
  },
  {
    key: '美元($)',
    val: 3000,
    lock: 2000
  },
  {
    key: '人民币(￥)',
    val: 3000,
    lock: 2000
  },
  {
    key: '泰铢(THB)',
    val: 3000,
    lock: 2000
  },
])

const static_data = ref([
  {
    name: '账单',
    dialog: false,
    tableData: []
  },
  {
    name: '充值',
    dialog: false,
    tableData: []
  },
  {
    name: '法币提现',
    dialog: false,
    tableData: []
  },
  {
    name: 'U币提现',
    dialog: false,
    tableData: []
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

const router = useRouter()
let params = router.currentRoute.value.query // query参数跳转
console.log(params)

const openDialog = (index, data) => {
  formInline.value.time = ''
  static_data.value[index].dialog = true
  static_data.value[index].tableData = []
  myIndex.value = index
  console.log(index, data)
  console.log(static_data.value[index].dialog)
}

const onSubmit = (index) => {
  console.log(index)
}

const onReset = (index) => {
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
  console.log(myIndex.value)
  console.log(val)
}

const showImg = (index, row) => {
  // show_url.value = row.screen
  // showImgDialogVisible.value = true
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