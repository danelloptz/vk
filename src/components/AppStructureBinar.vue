<template>
    <div class="tree-container">
      <div class="tree-user">
        <img v-if="lay > 1" src="@/assets/images/struct_line.png" class="struct_line" :style="{ marginLeft: 35 + 'px' }">
        <div v-if="node" class="avatar-container">
          <img :src="node.avatar" :alt="node.name" class="avatar" />
        </div>
        <div v-if="(node.left_leg || node.right_leg) && lay < 4" class="children">
          <div v-if="node.left_leg" class="child left">
            <AppStructureBinar :node="node.left_leg" :lay="lay+1" :style="{ marginRight: 70 + 'px' }" />
          </div>
          <div v-if="node.right_leg" class="child right">
            <AppStructureBinar :node="node.right_leg" :lay="lay+1" :style="{ marginLeft: 70 + 'px' }" />
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
    border: 2px solid white;
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
    width: 200px;
    position: relative;
  }
  
  .child {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .lines {
    position: absolute;
    width: 100%;
    height: 50px;
    top: 50px;
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
</style>
  