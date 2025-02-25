<template>
    <div class="tree-container">
      <div class="tree-user" :style="{ width: lay != 1 ? (400 / (Math.pow(2, lay-1))) + 'px' : '400px', alignItems: lay == 4 ? 'center' : 'normal' }">
        <div v-if="node" class="avatar-container" :style="{ justifyContent: lay == 1 ? 'space-between' : 'center' }">
          <div class="text_header" v-if="lay == 1">
            <span><strong>Лево</strong></span>
            <span>69 рефералов</span>
            <span>11 601.5 USDT</span>
          </div>
          <img :src="node.avatar" :alt="node.name" class="avatar" @click="open" />
          <div class="text_header" v-if="lay == 1">
            <span><strong>Право</strong></span>
            <span>263 реферала</span>
            <span>13 357.44 USDT</span>
          </div>
        </div>

        <div class="lines" :style="{ justifyContent: (node.left_leg && !node.right_leg) || ((!node.left_leg && node.right_leg)) ? 'end' : 'center'}">
          <img src="@/assets/images/struct_line1.png" class="struct_line rotated" :style="{ visibility: node.left_leg ? 'visible' : 'hidden', width: (node.left_leg && !node.right_leg) ? (400 / (Math.pow(2, lay))) + 'px' : (400 / (Math.pow(2, lay))) + 'px' }">
          <img src="@/assets/images/struct_line1.png" class="struct_line" :style="{ visibility: node.right_leg ? 'visible' : 'hidden', width: (!node.left_leg && node.right_leg) ? (400 / (Math.pow(2, lay))) + 'px' : (400 / (Math.pow(2, lay))) + 'px' }">
        </div>

        <div class="modal_wrapper" v-if="visibility">
            <div class="modal">
              <img src="@/assets/images/close.png" class="close" @click="close">
              <img :src="node.avatar" class="avatar">
              <h2>{{ node.name }}</h2>
              <div class="row">
                <span>Первая линия / всего: </span>
                <span>{{ node.first_line_referrals }}/{{ node.total_referrals }}</span>
              </div>
              <div class="row">
                <span>ID:</span>
                <span>{{ node.vk_id }}</span>
              </div>
              <div class="row">
                <span>Реферер ID:</span>
                <span>{{ referer }}</span>
              </div>
            </div>
          </div>

        <div v-if="(node.left_leg || node.right_leg) && lay < 4" class="children">
          <div v-if="node.left_leg" class="child left">
            <AppStructureBinar :node="node.left_leg" :lay="lay+1" :referer="node.vk_id" :style="{ marginLeft: (node.left_leg && !node.right_leg) ? -(400 / (Math.pow(2, lay-1))) + 'px' : -(400 / (Math.pow(2, lay))) + 'px'}" />
          </div>
          <div v-if="node.right_leg" class="child right">
            <AppStructureBinar :node="node.right_leg" :lay="lay+1" :referer="node.vk_id" :style="{ marginRight: (!node.left_leg && node.right_leg) ? -(400 / (Math.pow(2, lay-1))) + 'px' : -(400 / (Math.pow(2, lay))) + 'px'}" />
          </div>
        </div>
        <div class="plus" v-if="lay == 4" @click="nextUser(node)">
          <span>+</span>
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
      lay: Number,
      referer: Number
    },
    data() {
      return {
        visibility: false,
      }
    },
    methods: {
      nextUser(node) {
        console.log(node);
        this.$parent.$parent.$parent.$emit("nextUser", node.vk_id);
      },
      open() {
        this.visibility = true;
      },
      close() {
        this.visibility = false;
      }
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
    align-items: center;
  }

  .text_header {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }

  .text_header span {
    color: white;
    font-size: 14px;  
    font-family: 'OpenSans';
  }
  
  .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
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
  .modal_wrapper {
    position: absolute;
    right: 0;
    top: 0;
    width: 256px;
    background: #2F3251;
    border-radius: 10px;
    z-index: 989;
  }
  .modal {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
    position: relative;
  }
  .modal h2 {
    font-size: 16px;
    color: white;
    font-family: 'OpenSans';
  }
  .avatar {
    width: 71px;
    height: 71px;
    border-radius: 50%;
    border: 1px solid white;
  }
  .close {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
  }
  .row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .row span {
    color: white;
    font-size: 14px;
    font-family: 'OpenSans';
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
  .plus {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #252847;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .plus span {
    font-size: 12px;
    color: white;
    font-weight: bold;
  }
</style>
  