<template>
  <div class="sidebar">
    <!-- <el-menu
      :default-active="ActivePath"
      class="el-menu-vertical-demo"
      :collapse="sidebar.collapse"
    >
      <template v-for="item in permissionList">
        <el-submenu
          :index="item.path"
          :key="item.name"
          v-if="item.children.length > 0"
        >
          <template slot="title">
            <i
              v-if="item.meta && item.meta.icon"
              :class="['iconfont', item.meta.icon]"
            ></i>
            <span v-if="item.meta && item.meta.title" class="ml10"
              >{{ item.meta.title }}</span
            >
          </template>
          <template v-for="(child, index) in item.children">
            <router-link
              :to="item.path + '/' + child.path"
              :key="index"
              v-if="!child.meta.hidden"
            >
              <el-menu-item :index="item.path + '/' + child.path">
                <span v-if="child.meta && child.meta.title">{{
                  child.meta.title
                }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu> -->

    <el-menu
      class="sidebar-el-menu"
      :default-active="ActivePath"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="(item, index) in permissionList" :key="index">
        <el-submenu :index="index + ''">
          <template #title>
            <div style="">
              <el-icon
                style="margin-right:10px;vertical-align: baseline"
                :size="18"
                color="#ffffff"
              >
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </div>
          </template>
          <template v-for="(child, index) in item.children" :key="index">
            <router-link :to="child.path" v-if="!child.meta.hidden">
              <el-menu-item :index="child.path">
                <span v-if="child.meta && child.meta.title">{{
                  child.meta.title
                }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useSidebarStore } from '../store/sidebar'
import { asyncRouterMap } from '@/router'
const route = useRoute()
const router = useRouter()
let ActivePath = ref()
ActivePath.value = route.path
const onRoutes = computed(() => {
  return route.path
})

const sidebar = useSidebarStore()
let permissionList = ref([])
const getPermission = () => {
  let newArr = JSON.parse(JSON.stringify(asyncRouterMap)) //数组深拷贝
  newArr.forEach(item => {
    let arr = []
    item.children.forEach(child => {
      arr.push(child)
    })
    item.children = arr
  })
  permissionList.value = newArr
}

getPermission()
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
