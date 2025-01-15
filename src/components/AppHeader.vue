<template>
    <header class="header">
      <!-- Логотип -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="Intelektaz Logo" />
        <span>INTELEKTAZ</span>
      </div>
  
      <!-- Навигация -->
      <nav class="navigation">
        <ul>
          <li><a href="#">Новости</a></li>
          <li><a href="#">Помощь</a></li>
        </ul>
      </nav>
  
      <!-- Прогресс и профиль -->
      <div class="profile-section">
        <!-- Прогресс -->
        <div class="progress">
          <span>{{ progress }}%</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
  
        <!-- Профиль -->
        <div class="profile">
          <img
            class="profile-avatar"
            :src="profile.avatar"
            alt="Profile Avatar"
          />
          <span class="profile-role">{{ profile.role }}</span>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "AppHeader",
    data() {
      return {
        progress: 33, // Пример статичного значения прогресса
        profile: {
          avatar: "https://via.placeholder.com/40", // Временная ссылка на аватар
          role: "Leader",
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #1a1a2e;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
  }
  
  .logo img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  
  .navigation ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }
  
  .navigation li {
    margin-left: 20px;
  }
  
  .navigation a {
    color: white;
    text-decoration: none;
    font-size: 16px;
  }
  
  .navigation a:hover {
    color: #00aaff;
  }
  
  .profile-section {
    display: flex;
    align-items: center;
  }
  
  .progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
  }
  
  .progress span {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .progress-bar {
    width: 100px;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #00aaff;
    transition: width 0.3s ease;
  }
  
  .profile {
    display: flex;
    align-items: center;
  }
  
  .profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .profile-role {
    font-size: 14px;
    color: #a0a0a0;
  }
  </style>
  