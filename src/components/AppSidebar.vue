<template>
    <div class="sidebar">
      <div class="balance">Баланс: 50 USDT</div>
      <nav>
        <ul>
          <li>Главная</li>
          <li>ИИ Генератор</li>
          <li>Структура</li>
          <li>Ротация</li>
          <li>Настройки</li>
          <li>Инструкции</li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AppSidebar',
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background: #161629;
    padding: 20px;
  }
  .balance {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
  }
  nav ul {
    list-style: none;
    padding: 0;
  }
  nav ul li {
    margin: 10px 0;
    cursor: pointer;
  }
  </style>
  