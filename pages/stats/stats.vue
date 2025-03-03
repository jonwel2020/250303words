<template>
  <view class="container">
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-value">{{ todayCount }}</text>
        <text class="stat-label">今日学习</text>
      </view>
      
      <view class="stat-card">
        <text class="stat-value">{{ totalDays }}</text>
        <text class="stat-label">总学习天数</text>
      </view>
      
      <view class="stat-card">
        <text class="stat-value">{{ favoriteCount }}</text>
        <text class="stat-label">收藏单词</text>
      </view>
    </view>

    <view class="weekly-chart">
      <text class="section-title">本周学习情况</text>
      <view class="chart">
        <view v-for="(item, index) in weeklyData" 
              :key="index" 
              class="chart-bar">
          <view class="bar" 
                :style="{ height: getBarHeight(item.count) }">
          </view>
          <text class="bar-label">{{ formatDate(item.date) }}</text>
        </view>
      </view>
    </view>

    <view class="recent-words">
      <text class="section-title">最近学习</text>
      <scroll-view scroll-x class="word-scroll">
        <view v-for="word in recentWords" 
              :key="word.id" 
              class="recent-word-card"
              @click="playSound(word)">
          <image :src="word.image" mode="aspectFit" class="word-thumb"></image>
          <text class="word-text">{{ word.word }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { words } from '@/common/words.js'
import { Storage } from '@/common/storage.js'

export default {
  data() {
    return {
      todayCount: 0,
      totalDays: 0,
      favoriteCount: 0,
      weeklyData: [],
      recentWords: []
    }
  },
  methods: {
    loadStats() {
      this.todayCount = Storage.getTodayStudyCount()
      this.totalDays = Storage.getTotalStudyDays()
      this.weeklyData = Storage.getWeeklyStudyData()
      
      // 获取收藏数量
      const favorites = uni.getStorageSync('favorites') || []
      this.favoriteCount = favorites.length
      
      // 获取最近学习的单词
      const today = new Date().toISOString().split('T')[0]
      const records = uni.getStorageSync('study_records') || {}
      const todayWords = records[today] || []
      this.recentWords = words.filter(word => todayWords.includes(word.id))
    },
    getBarHeight(count) {
      const maxHeight = 100
      const maxCount = Math.max(...this.weeklyData.map(d => d.count))
      return maxCount === 0 ? '0%' : `${(count / maxCount) * maxHeight}%`
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.getDate().toString()
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
    this.loadStats()
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.stat-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 15px;
  flex: 1;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #007AFF;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
}

.weekly-chart {
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
}

.chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 20px;
  background-color: #007AFF;
  border-radius: 10px;
  transition: height 0.3s;
}

.bar-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.word-scroll {
  white-space: nowrap;
}

.recent-word-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  width: 80px;
}

.word-thumb {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-bottom: 5px;
}

.word-text {
  font-size: 12px;
  color: #333;
}
</style> 