import Mock from 'mockjs'
import home from './data.json'

//Mock下面有mock方法，第一个参数是请求路径，第二个参数为根据请求返回的数据
Mock.mock('/mock/home', { code: 200, data: home })