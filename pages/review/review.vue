<template>
  <view class="container">
    <view class="card" v-if="currentWord">
      <image :src="currentWord.image" mode="aspectFit" class="word-image"></image>
      
      <view class="word-content" v-if="showAnswer">
        <text class="word-text">{{ currentWord.word }}</text>
        <text class="word-info">{{ currentWord.chinese }} {{ currentWord.phonetic }}</text>
      </view>
      
      <view class="action-buttons">
        <button class="btn sound-btn" @click="playSound(currentWord)">
          🔊 发音
        </button>
        <button class="btn check-btn" @click="toggleAnswer">
          {{ showAnswer ? '隐藏答案' : '查看答案' }}
        </button>
      </view>
      
      <view class="review-buttons" v-if="showAnswer">
        <button class="btn wrong-btn" @click="nextWord(false)">不认识</button>
        <button class="btn right-btn" @click="nextWord(true)">认识</button>
      </view>
    </view>
    
    <view class="progress">
      <text>已复习: {{ reviewedCount }}/{{ totalWords }}</text>
      <text>正确率: {{ correctRate }}%</text>
    </view>
  </view>
</template>

<script>
import { words } from '@/common/words.js'

export default {
  data() {
    return {
      words: [...words],
      currentWord: null,
      showAnswer: false,
      reviewedCount: 0,
      correctCount: 0
    }
  },
  computed: {
    totalWords() {
      return this.words.length
    },
    correctRate() {
      return this.reviewedCount === 0 
        ? 0 
        : Math.round((this.correctCount / this.reviewedCount) * 100)
    }
  },
  methods: {
    shuffleWords() {
      for (let i = this.words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.words[i], this.words[j]] = [this.words[j], this.words[i]]
      }
      this.currentWord = this.words[0]
    },
    toggleAnswer() {
      this.showAnswer = !this.showAnswer
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
    nextWord(isCorrect) {
      this.reviewedCount++
      if (isCorrect) this.correctCount++
      
      this.words.shift()
      if (this.words.length > 0) {
        this.currentWord = this.words[0]
        this.showAnswer = false
      } else {
        uni.showModal({
          title: '复习完成',
          content: `正确率: ${this.correctRate}%`,
          showCancel: false,
          success: () => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      }
    }
  },
  onLoad() {
    this.shuffleWords()
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

.word-image {
  width: 200px;
  height: 200px;
  margin: 20px 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.review-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  border: none;
}

.wrong-btn {
  background-color: #FF3B30;
  color: white;
}

.right-btn {
  background-color: #34C759;
  color: white;
}

.progress {
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #666;
}
</style> 