import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

import "@/datasources/firebase" // 인증을 위해 파베를 불러오고
import { getAuth } from "firebase/auth" // 인증객체 생성
const auth = getAuth();

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: function () {
      return import('../views/RegisterView.vue')
    }
  },
  {
    path: '/main',
    name: 'main',
    component: function () {
      return import('../components/MainPage.vue')
    },
    meta : {bAuth : true}, // 네비게이션 가드를 위한 메타데이터
  },
  {
    path: '/login',
    name: 'login',
    component: function () {
      return import('../components/LoginPage.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// < 네비게이션 가드 >
// main에 접근했을때 로그인이 되어있다면 main 페이지로
// 로그인이 되어있지 않다면 login 페이지로 이동할수있게 네비게이션 가드 사용
// 라우트 메타필드를 확인해서 main 페이지에 접근한것을 확인
// to 는 이동할 위치 / from 은 현재 위치
router.beforeEach( (to,from,next)=>{
  console.log("네비게이션가드 확인");
  // 이동할 위치(to-라우터객체($router))가 main인지 확인 (라우터 이동시 main페이지라면 bNeedAuth = true를 뱉음)
  const bNeedAuth = to.matched.some( (record)=>record.meta.bAuth );
  // 로그인이 되어있는지 확인 : firebase인증 필요
  const bCheckAuth = auth.currentUser;

  console.log(bNeedAuth);

  // main페이지이면서 로그인이 되어있지않다면 > login페이지로 이동
  // 그외 > 그대로 이동
  if ( bNeedAuth && !bCheckAuth ) {
    next('/login');
  }
  else {
    next();
  }
} );

export default router
