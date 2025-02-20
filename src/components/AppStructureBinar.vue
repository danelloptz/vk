<template>
    <div class="tree-container">
      <div class="tree-user" :style="{ width: lay != 1 ? (400 / (Math.pow(2, lay-1))) + 'px' : '400px' }">
        <div v-if="node" class="avatar-container">
          <img :src="node.avatar" :alt="node.name" class="avatar" />
        </div>

        <div class="lines" :style="{ justifyContent: (node.left_leg && !node.right_leg) || ((!node.left_leg && node.right_leg)) ? 'end' : 'center'}">
          <img src="@/assets/images/struct_line1.png" class="struct_line rotated" :style="{ visibility: node.left_leg ? 'visible' : 'hidden', width: (node.left_leg && !node.right_leg) ? (400 / (Math.pow(2, lay))) + 'px' : (400 / (Math.pow(2, lay))) + 'px' }">
          <img src="@/assets/images/struct_line1.png" class="struct_line" :style="{ visibility: node.right_leg ? 'visible' : 'hidden', width: (!node.left_leg && node.right_leg) ? (400 / (Math.pow(2, lay))) + 'px' : (400 / (Math.pow(2, lay))) + 'px' }">
        </div>
      
        <div v-if="(node.left_leg || node.right_leg) && lay < 4" class="children">
          <div v-if="node.left_leg" class="child left">
            <AppStructureBinar :node="node.left_leg" :lay="lay+1" :style="{ marginLeft: (node.left_leg && !node.right_leg) ? -(400 / (Math.pow(2, lay-1))) + 'px' : -(400 / (Math.pow(2, lay))) + 'px'}" />
          </div>
          <div v-if="node.right_leg" class="child right">
            <AppStructureBinar :node="node.right_leg" :lay="lay+1" :style="{ marginRight: (!node.left_leg && node.right_leg) ? -(400 / (Math.pow(2, lay-1))) + 'px' : -(400 / (Math.pow(2, lay))) + 'px'}" />
          </div>
        </div>
        <!-- <svg v-if="node.left_leg || node.right_leg" class="lines">
          <line x1="50%" y1="0" x2="50%" y2="50%" stroke="white" stroke-width="2" />
          <line v-if="node.left_leg" x1="50%" y1="50%" x2="10%" y2="50%" stroke="white" stroke-width="2" />
          <line v-if="node.right_leg" x1="50%" y1="50%" x2="90%" y2="50%" stroke="white" stroke-width="2" />
        </svg> -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AppStructureBinar",
    props: {
      node: Object,
      lay: Number
    },
    created() {
      console.log(this.node);
    }
  };
  </script>
  
  <style scoped>
  .tree-container {
    display: flex;
    justify-content: center;
  }
  
  .tree-user {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 200px;
  }
  
  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  
  .name {
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
    color: white;
  }
  
  .children {
    display: flex;
    justify-content: space-around;
    /* width: 200px; */
    position: relative;
  }
  
  .child {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .lines {
    display: flex;
    justify-content: center;
  }
  .vert_line {
    width: 2px;
    height: 40px;
    background: white;
    align-self: center;
  }
  .struct_line {
    width: 70px;
  }
  .rotated {
    transform: scaleX(-1);
  }
</style>
  