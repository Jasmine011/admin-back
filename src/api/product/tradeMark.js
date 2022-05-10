import request from '@/utils/request'


//获取品牌列表
export const reqTradeMarkList = (page, limit) => {
    return request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: "GET"
    })
}

//新增和修改品牌
export const reqUpdateOrSaveTradeMark = (data) => {
    if (data.id) {
        //有id属性说明是修改品牌
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'PUT',
            data
        })
    } else {
        //新增品牌
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'POST',
            data
        })
    }
}

//删除品牌
export const reqDelTradeMark = (id) => {
    return request({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'DELETE'
    })
}