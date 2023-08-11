<template>
  <!-- ***** Header Area Start ***** -->
  <header class="header-area header-sticky">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <!-- ***** Logo Start ***** -->
            <a href="index.html" class="logo">Tran<em> Huy</em></a>
            <!-- ***** Logo End ***** -->
            <!-- ***** Menu Start ***** -->
            <ul class="nav">
              <li class="scroll-to-section">
                <a class="active"><router-link to="/">Home</router-link></a>
              </li>
              <li class="scroll-to-section">
                <a href="#features">
                  <router-link to="/pt">PT</router-link>
                </a>
              </li>
              <li @click="handleOpenDialog('login')" class="scroll-to-section">
                <a> Login </a>
              </li>
              <li @click="handleOpenDialog('register')" class="main-button"><a>Sign Up</a></li>
            </ul>
            <a class="menu-trigger">
              <span>Menu</span>
            </a>
            <!-- ***** Menu End ***** -->
          </nav>
        </div>
      </div>
    </div>
  </header>
  <!-- ***** Header Area End ***** -->
  <!-- ***** Main Banner Area Start ***** -->
  <div class="main-banner" id="top">
    <video autoplay muted loop id="bg-video">
      <source src="../../assets/images/gym-video.mp4" type="video/mp4" />
    </video>

    <div class="video-overlay header-text">
      <div class="caption">
        <h6>work harder, get stronger</h6>
        <h2>easy with our <em>gym</em></h2>
        <div class="main-button scroll-to-section">
          <a @click="handleOpenDialog('register')">Become a member</a>
        </div>
      </div>
    </div>
  </div>
  <!-- ***** Main Banner Area End ***** -->

  <!-- Dialog Starts -->
  <el-dialog class="dialog" v-model="dialogVisible" title="Tips" :width="dialogWidth">
    <!-- Sign Up Start -->
    <template #header>
      <p v-if="dialogType === 'register'">Become a member!</p>
      <p v-if="dialogType === 'login'">Start Working Now!</p>
    </template>
    <ElRow v-if="loading">
      <ElCol :span="24">
        <el-progress :show-text="false" :percentage="100" :duration="1" :indeterminate="true" />
      </ElCol>
    </ElRow>
    <ElRow v-if="dialogType === 'register' && !loading">
      <ElCol :span="24">
        <el-form
          ref="ruleFormRegisterRef"
          :model="ruleFormRegister"
          :rules="rulesRegister"
          label-width="120px"
          status-icon
        >
          <ElRow>
            <ElCol :span="12">
              <el-form-item label="Fullname" prop="name">
                <el-input v-model="ruleFormRegister.name" />
              </el-form-item>
            </ElCol>
            <ElCol :span="12">
              <el-form-item label="Date of birth" prop="ngaysinh">
                <el-date-picker
                  v-model="ruleFormRegister.ngaysinh"
                  type="date"
                  label="Pick a date"
                  placeholder="Pick a date"
                ></el-date-picker>
              </el-form-item>
            </ElCol>
            <ElCol :span="12">
              <el-form-item label="Username" prop="tk">
                <el-input v-model="ruleFormRegister.tk" />
              </el-form-item>
            </ElCol>
            <ElCol :span="12">
              <el-form-item label="Password" prop="mk">
                <el-input v-model="ruleFormRegister.mk" />
              </el-form-item>
            </ElCol>
            <ElCol :span="12"
              ><el-form-item label="CCCD" prop="cccd">
                <el-input v-model="ruleFormRegister.cccd" /> </el-form-item
            ></ElCol>
            <ElCol :span="12"
              ><el-form-item label="Phone" prop="sdt">
                <el-input v-model="ruleFormRegister.sdt" /> </el-form-item
            ></ElCol>
          </ElRow>
        </el-form>
      </ElCol>
    </ElRow>
    <ElRow justify="center" v-if="dialogType === 'login' && !loading">
      <el-form
        ref="ruleFormLoginRef"
        :model="ruleFormLogin"
        :rules="rulesLogin"
        label-width="120px"
        status-icon
      >
        <ElCol :span="24">
          <el-form-item label="Username" prop="tk">
            <el-input v-model="ruleFormLogin.tk" />
          </el-form-item>
        </ElCol>
        <ElCol :span="24">
          <el-form-item label="Password" prop="mk">
            <el-input v-model="ruleFormLogin.mk" />
          </el-form-item>
        </ElCol>
      </el-form>
    </ElRow>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleOpenDialog('login')" v-if="dialogType === 'register'"
          >Sign In</el-button
        >
        <el-button @click="handleOpenDialog('register')" v-if="dialogType === 'login'"
          >Register</el-button
        >
        <el-button type="primary" @click="submitForm"> Confirm </el-button>
      </span>
    </template>

    <!-- Sign Up End -->
  </el-dialog>
  <!-- Dialog Ends -->
</template>
<script lang="ts" setup>
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElDatePicker,
  ElMessage,
  ElProgress
} from 'element-plus'
import { reactive, ref } from 'vue'
import AuthService from '../../services/auth.service'
import { useUserStore } from '../../stores/user'
const userStore = useUserStore()
const dialogVisible = ref(false)
const handleOpenDialog = (type) => {
  dialogVisible.value = true
  dialogType.value = type
  if (type === 'login') dialogWidth.value = '30%'
  else dialogWidth.value = '50%'
}

const dialogType = ref('register')
const loading = ref(false)
const dialogWidth = ref('50%')

// Register
const ruleFormRegisterRef = ref()
const ruleFormRegister = reactive({
  name: '',
  tk: '',
  mk: '',
  ngaysinh: '',
  gioitinh: '',
  cccd: '',
  sdt: ''
})

const rulesRegister = reactive({
  name: [{ required: true, message: 'Please input your name', trigger: 'blur' }],
  tk: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  mk: [{ required: true, message: 'Please input password', trigger: 'blur' }],
  ngaysinh: [{ required: true, message: 'Please input date of birth', trigger: 'blur' }],
  gender: [{ required: true, message: 'Please input gender', trigger: 'blur' }],
  cccd: [{ required: true, message: 'Please input CCCD', trigger: 'blur' }],
  sdt: [{ required: true, message: 'Please input phone number', trigger: 'blur' }]
})

// Login
const ruleFormLoginRef = ref()
const ruleFormLogin = reactive({
  tk: '',
  mk: ''
})
const rulesLogin = reactive({
  tk: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  mk: [{ required: true, message: 'Please input password', trigger: 'blur' }]
})

const submitForm = async () => {
  let formEl = ruleFormRegisterRef.value
  if (dialogType.value === 'login') formEl = ruleFormLoginRef.value
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (dialogType.value === 'register') {
          const response = await AuthService.register({
            user: {
              tk: ruleFormRegister.tk,
              mk: ruleFormRegister.mk,
              ten: ruleFormRegister.ten
            },
            khach: {
              ten: ruleFormRegister.name,
              ngaysinh: ruleFormRegister.ngaysinh,
              gioitinh: true,
              cccd: ruleFormRegister.cccd,
              sdt: ruleFormRegister.sdt
            }
          })
          ElMessage({
            message: `Register successfully! You can start working now, ${response.data.ten}!`,
            type: 'success'
          })
          return
        }
        const tokenResponse = await AuthService.login({
          tk: ruleFormLogin.tk,
          mk: ruleFormLogin.mk
        })
        userStore.setToken(tokenResponse)
        const currentUser = await AuthService.getIdentity()
        userStore.setUser(currentUser)
        console.log(currentUser)
        ElMessage({
          message: `Login successfully!`,
          type: 'success'
        })
      } catch (error) {
        console.log(error)
        ElMessage({
          message: error.response.data.msg,
          type: 'error'
        })
      }
      loading.value = false
      dialogVisible.value = false
    } else {
      ElMessage({
        message: 'Please check your info again',
        type: 'error'
      })
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'HeaderComponent'
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.dialog {
  transition: all 0.1s linear;
}
</style>
