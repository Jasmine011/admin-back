import request from '@/utils/request'

//请求sku列表
export const reqGetSkuLIst = (page, limit) => {
    return request({
        url: `/admin/product/list/${page}/${limit}`,
        method: "GET"
    })
}

//上架
export const reqSkuOnSale = (skuId) => {
    return request({
        url: `/admin/product/onSale/${skuId}`,
        method: "GET"
    })
}

//下架
export const reqSkuCancel = (skuId) => {
    return request({
        url: `/admin/product/cancelSale/${skuId}`,
        method: "GET"
    })
}

//获取sku详情
export const reqSkuInfo = (skuId) => {
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method: "GET"
    })
}