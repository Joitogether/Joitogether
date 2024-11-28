import { ref, nextTick } from "vue";
import { loadGoogleMapsAPI } from "@/utils/googleMapsLoader";

export function useGoogleMaps(apiKey) {
  const map = ref(null);
  const geocoder = ref(null);

  const previewMap = async (searchQuery) => {
    if (!searchQuery) return; // 若搜尋查詢為空則返回

    const googleMaps = await loadGoogleMapsAPI(apiKey);
    if (!geocoder.value) {
      geocoder.value = new googleMaps.Geocoder(); // 初始化地理編碼器
    }

    geocoder.value.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;

        nextTick(() => {
          const mapElement = document.getElementById("map");
          if (!mapElement) {
            console.error("地圖容器元素未找到");
            return;
          }

          map.value = new googleMaps.Map(mapElement, {
            center: location,
            zoom: 14,
          });
          new googleMaps.Marker({
            map: map.value,
            position: location,
          });
        });
      } else {
        console.error("地址無法解析為地圖位置", status);
      }
    });
  };


  const clearMap = () => {
    if (map.value) {
      map.value = null;
    }
  };

  return { map, geocoder, previewMap, clearMap };
}
