import request from '@/utils/request'


//依靠三级id获取spu列表
export const reqSpuList = (page, limit, category3Id) => {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: "GET",
        params: { category3Id }
    })
}

//获取某个spu信息
export const reqGetSpu = (spuId) => {
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: "GET"
    })
}

//获取SPU图片
export const reqSpuImg = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: "GET"
    })
}

//获取品牌数据
export const reqTradeMarkList = () => {
    return request({
        url: "/admin/product/baseTrademark/getTrademarkList",
        method: "GET"
    })
}

//获取平台销售属性
export const reqSaleAttrList = () => {
    return request({
        url: "/admin/product/baseSaleAttrList",
        method: "GET"
    })
}

//提交新建或修改SPU
export const reqAddOrDateSpu = (spuInfo) => {
    //因为他们提交的数据是一样的，把他们写在一个函数里
    //如果携带id，说明它是修改操作
    if (spuInfo.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'POST',
            data: spuInfo
        })
    } else {
        //不携带id，是为添加操作
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'POST',
            data: spuInfo
        })
    }
}

//删除SPU
export const reqDeleteSpu = (spuId) => {
    return request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method: "DELETE"
    })
}

//点击添加sku按钮发的请求------------------------
//获取spu图片
export const reqSpuImgList = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: "GET"
    })
}

//获取spu销售属性的数据
export const regSpuSaleAttrList = (spuId) => {
    return request({
        url: `admin/product/spuSaleAttrList/${spuId}`,
        method: "GET"
    })
}

//获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: "GET"
    })
}

//点击保存按钮，添加sku
export const reqAddSku = (skuInfo) => {
    return request({
        url: "/admin/product/saveSkuInfo",
        method: "POST",
        data: skuInfo
    })
}

//点击按钮查看sku列表
//获取平台属性的数据
export const reqSkuList = (spuId) => {
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: "GET"
    })
}