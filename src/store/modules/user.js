import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        //用户名
        name: '',
        //头像
        avatar: '',
        //菜单权限标记
        routes: [],
        //按钮权限标记
        buttons: [],
        //角色
        roles: []
    }
}

const state = getDefaultState()

const mutations = {
    //重置数据
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    //获取token
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INFO: (state, userInfo) => {
        //用户名和用户头像
        state.name = userInfo.name;
        state.avatar = userInfo.avatar;
        //菜单权限标记
        state.routes = userInfo.routes;
        //按钮权限标记
        state.buttons = userInfo.buttons;
        //角色
        state.roles = userInfo.roles;
    }
}

const actions = {
    // 登录注册
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        const result = await login({ username: username.trim(), password: password })
        if (result.code == 200 || result.code == 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('file'))
        }
    },

    // 获取用户信息
    async getInfo({ commit, state }) {
        /* try {
            const result = await getInfo(state.token)
            console.log(result);
        } catch (err) {
            console.log(err);
        } */
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                console.log(data);

                commit('SET_INFO', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 退出登陆
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 删除token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    //namespaced: true,
    state,
    mutations,
    actions
}