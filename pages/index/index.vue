<template>
  <view class="container">
    <swiper class="swiper" :indicator-dots="true" :autoplay="false" @change="handleChange">
      <swiper-item v-for="word in words" :key="word.id">
        <view class="card">
          <view class="card-header">
            <text class="favorite-btn" @click="toggleFavorite(word.id)">
              {{ isFavorite(word.id) ? '❤️' : '🤍' }}
            </text>
          </view>
          
          <image :src="word.image" mode="aspectFit" class="word-image"></image>
          
          <view class="word-content">
            <text class="word-text">{{ word.word }}</text>
            <text class="word-info" v-if="showMeaning">{{ word.chinese }} {{ word.phonetic }}</text>
            
            <view class="action-buttons">
              <button class="btn sound-btn" @click="playSound(word)">
                🔊 发音
              </button>
              <button class="btn review-btn" @click="toggleMeaning">
                {{ showMeaning ? '隐藏释义' : '显示释义' }}
              </button>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="progress-bar">
      <text class="progress-text">{{ currentIndex + 1 }}/{{ words.length }}</text>
    </view>
  </view>
</template>

<script>
import { words } from '@/common/words.js'
import { Storage } from '@/common/storage.js'

export default {
  data() {
    return {
      words: words,
      currentIndex: 0,
      showMeaning: true,
      favorites: []
    }
  },
  methods: {
    handleChange(e) {
      this.currentIndex = e.detail.current
      // 记录学习记录
      const currentWord = this.words[this.currentIndex]
      Storage.saveStudyRecord(currentWord.id)
    },
    playSound(word) {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = word.audio
      innerAudioContext.onError((res) => {
        console.error('音频播放失败：', res)
        uni.showToast({
          title: '音频播放失败',
          icon: 'none'
        })
      })
      innerAudioContext.play()
    },
    toggleMeaning() {
      this.showMeaning = !this.showMeaning
    },
    toggleFavorite(wordId) {
      const index = this.favorites.indexOf(wordId)
      if (index === -1) {
        this.favorites.push(wordId)
      } else {
        this.favorites.splice(index, 1)
      }
      // 保存到本地存储
      uni.setStorageSync('favorites', this.favorites)
    },
    isFavorite(wordId) {
      return this.favorites.includes(wordId)
    }
  },
  onLoad() {
    // 从本地存储加载收藏列表
    const savedFavorites = uni.getStorageSync('favorites')
    if (savedFavorites) {
      this.favorites = savedFavorites
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.swiper {
  height: 80vh;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.favorite-btn {
  font-size: 24px;
  padding: 10px;
}

.word-image {
  width: 200px;
  height: 200px;
  margin: 20px 0;
}

.word-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.word-text {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.word-info {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  border: none;
}

.sound-btn {
  background-color: #007AFF;
  color: white;
}

.review-btn {
  background-color: #34C759;
  color: white;
}

.progress-bar {
  text-align: center;
  padding: 10px;
}

.progress-text {
  font-size: 14px;
  color: #666;
}
</style> 