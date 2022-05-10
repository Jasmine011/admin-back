import request from '@/utils/request'

//获取一级分类数据
export const reqGetCategory1List = () => {
    return request({
        url: "/admin/product/getCategory1",
        method: "GET"
    })
}

//获取二级分类数据
export const reqGetCategory2List = (category1Id) => {
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: "GET"
    })
}

//获取三级分类数据
export const reqGetCategory3List = (category2Id) => {
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: "GET"
    })
}

//根据1、2、3级id获取属性
export const reqGetAttr = (category1Id, category2Id, category3Id) => {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: "GET"
    })
}

//新增或者修改属性
export const reqSaveAttr = (data) => {
    return request({
        url: "/admin/product/saveAttrInfo",
        method: "POST",
        data
    })
}