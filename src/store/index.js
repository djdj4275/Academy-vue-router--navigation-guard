import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router';
import '@/datasources/firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
const auth = getAuth();

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    oUser : null
  },
  getters: {
    fnGetUser(state) {
      return state.oUser;
    },
    fnGetAuthStatus(state) {
      return state.oUser != null;
    }
  },
  mutations: {
    fnSetUser(state,payload) {
      state.oUser = payload;
    }
  },
  actions: {
    fnDoGoogleLogin_Popup( {commit} ) {
      const oProvider = new GoogleAuthProvider();
      oProvider.addScope('profile');
      oProvider.addScope('email');
      signInWithPopup(auth, oProvider)
      .then( (pUserInfo)=>{
        commit('fnSetUser', {
          name : pUserInfo.user.displayName,
          email : pUserInfo.user.email,
          photoURL : pUserInfo.user.photoURL
        });
        router.push('/main');
      } )
      .catch( (err)=>{
        console.log(err.message);
      } )
    },

    DoLogin( {commit}, payload ) {
      // 서버사용시 방법 = 서버측 주소 (axios > POST payload의 값 전달 > then을 통해 그 값을 commit에 저장)
      signInWithEmailAndPassword(auth, payload.pEmail, payload.pPassword)
      .then( (pUserInfo)=>{
        commit('fnSetUser', {
          name : pUserInfo.user.displayName,
          email : pUserInfo.user.email,
          photoURL : pUserInfo.user.photoURL
        });
        router.push('/main')
      } )
      .catch( (err)=>{
        console.log(err.message);
      } )
    },

    fnRegisterUser( {commit}, payload ) {
      createUserWithEmailAndPassword(auth, payload.pEmail, payload.pPassword)
      .then( (pUserInfo)=>{
        commit('fnSetUser', {
          name : pUserInfo.user.displayName,
          email : pUserInfo.user.email,
          photoURL : pUserInfo.user.photoURL
        });
        router.push('/main');
      } )
      .catch( (err)=>{
        console.log(err.message);
      } )
    },

    fnDoLogout( {commit} ) {
      auth.signOut();
      commit('fnSetUser', null);
      router.push('/');
    },

    fnDoDelete( {commit} ) {
      const user = auth.currentUser;
      user.delete()
      .then( ()=>{
        commit('fnSetUser', null);
        router.push('/');
      } )
      .catch( (err)=>{
        console.log(err.message);
      } )
    }
  },
  modules: {
  }
})
