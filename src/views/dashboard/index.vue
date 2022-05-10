<template>
  <div class="board-container">
    <card-index/>
    <sale-index/>
    <exhibition-index/>
  </div>
</template>
<script>
import CardIndex from './card'
import SaleIndex from './sale'
import ExhibitionIndex from './exhibition'
export default {
  name:"BoardIndex",
  components:{
    CardIndex,
    SaleIndex,
    ExhibitionIndex
  }
}
</script>
<style >
</style>