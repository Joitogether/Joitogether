import { ref, nextTick } from 'vue';
import { activityGeocodeAPI } from '@/apis/activityAPI';
import { loadGoogleMapsAPI } from '@/utils/googleMapsLoader';

/* global google */

export function useGoogleMaps() {
  const map = ref(null);
  const apiKey = import.meta.env.VITE_GOOGLE_KEY

  const previewMap = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await activityGeocodeAPI(searchQuery);
      const location = response.data.data;

      await loadGoogleMapsAPI(apiKey)

        nextTick(() => {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          return;
        }

      // 初始化Google Maps
        map.value = new google.maps.Map(mapElement, {
          center: location,
          zoom: 14,
        });
        new google.maps.Marker({
          map: map.value,
          position: location,
        });
      });
    } catch{
      return
    }
  };

  const clearMap = () => {
    if (map.value) {
      map.value = null;
    }
  };

  return { map, previewMap, clearMap };
}
