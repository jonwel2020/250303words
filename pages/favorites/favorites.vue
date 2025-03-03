<template>
  <view class="container">
    <view v-if="favoriteWords.length === 0" class="empty-state">
      <text class="empty-text">还没有收藏的单词哦～</text>
    </view>
    
    <view v-else class="word-list">
      <view v-for="word in favoriteWords" 
            :key="word.id" 
            class="word-item"
            @click="playSound(word)">
        <image :src="word.image" mode="aspectFit" class="word-image"></image>
        <view class="word-info">
          <text class="word-text">{{ word.word }}</text>
          <text class="word-translation">{{ word.chinese }}</text>
          <text class="word-phonetic">{{ word.phonetic }}</text>
        </view>
        <text class="unfavorite-btn" @click.stop="removeFavorite(word.id)">
          ❌
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { words } from '@/common/words.js'

export default {
  data() {
    return {
      favoriteWords: []
    }
  },
  methods: {
    loadFavorites() {
      const favorites = uni.getStorageSync('favorites') || []
      this.favoriteWords = words.filter(word => favorites.includes(word.id))
    },
    removeFavorite(wordId) {
      uni.showModal({
        title: '确认移除',
        content: '确定要将这个单词从收藏夹中移除吗？',
        success: (res) => {
          if (res.confirm) {
            const favorites = uni.getStorageSync('favorites') || []
            const newFavorites = favorites.filter(id => id !== wordId)
            uni.setStorageSync('favorites', newFavorites)
            this.loadFavorites()
            
            uni.showToast({
              title: '已移除收藏',
              icon: 'success'
            })
          }
        }
      })
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
    }
  },
  onShow() {
    this.loadFavorites()
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.empty-text {
  color: #999;
  font-size: 16px;
}

.word-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.word-item {
  background: #ffffff;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.word-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
}

.word-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.word-text {
  font-size: 18px;
  font-weight: bold;
}

.word-translation {
  font-size: 14px;
  color: #666;
}

.word-phonetic {
  font-size: 12px;
  color: #999;
}

.unfavorite-btn {
  padding: 10px;
  font-size: 16px;
}
</style> 