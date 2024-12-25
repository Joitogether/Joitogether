let isAPILoaded = false
let onLoadCallbacks = []

// 動態渲染google 地圖
export const loadGoogleMapsAPI = (apiKey, libraries = 'places', language = 'zh-TW') => {
  return new Promise((resolve, reject) => {
    if (isAPILoaded) {
      resolve(window.google.maps)
      return
    }

    // 如果已經在載入中，添加回調函數
    onLoadCallbacks.push(resolve)

    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&language=${language}`
      script.async = true
      script.defer = true
      script.onload = () => {
        isAPILoaded = true
        onLoadCallbacks.forEach((callback) => callback(window.google.maps))
        onLoadCallbacks = []
      }
      script.onerror = () => {
        reject(new Error('Google Maps API 加載失敗'))
      }
      document.head.appendChild(script)
    }
  })
}
