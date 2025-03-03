// 用于管理本地存储的工具类
export const Storage = {
  // 保存学习记录
  saveStudyRecord(wordId) {
    const today = new Date().toISOString().split('T')[0]
    const records = uni.getStorageSync('study_records') || {}
    
    if (!records[today]) {
      records[today] = []
    }
    
    if (!records[today].includes(wordId)) {
      records[today].push(wordId)
    }
    
    uni.setStorageSync('study_records', records)
  },

  // 获取今日学习的单词数量
  getTodayStudyCount() {
    const today = new Date().toISOString().split('T')[0]
    const records = uni.getStorageSync('study_records') || {}
    return (records[today] || []).length
  },

  // 获取总学习天数
  getTotalStudyDays() {
    const records = uni.getStorageSync('study_records') || {}
    return Object.keys(records).length
  },

  // 获取本周学习记录
  getWeeklyStudyData() {
    const records = uni.getStorageSync('study_records') || {}
    const today = new Date()
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      weekData.push({
        date: dateStr,
        count: (records[dateStr] || []).length
      })
    }
    
    return weekData
  }
} 