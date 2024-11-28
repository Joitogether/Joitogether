import { ref } from "vue";
import { loadGoogleMapsAPI } from "@/utils/googleMapsLoader";
import debounce from "lodash/debounce";
import { useMessage } from "naive-ui"

export function useAutocomplete(apiKey) {
  const searchQuery = ref("");
  const suggestions = ref([]);
  const autocompleteInstance = ref(null);
  const isLoading = ref(false);
  const isLoadOK =ref(false);
  const message = useMessage()

  const initializeAutocomplete = async () => {
    if (!autocompleteInstance.value) {
      const googleMaps = await loadGoogleMapsAPI(apiKey);
      autocompleteInstance.value = new googleMaps.places.AutocompleteService();
    }
  };

  const fetchSuggestions = () => {
    if (!autocompleteInstance.value || !searchQuery.value) {
      suggestions.value = [];
      isLoading.value = false;
      return;
    }


  };
  const onInputChange = debounce(async () => {
    if (!autocompleteInstance.value || !searchQuery.value) {
      suggestions.value = [];
      isLoading.value = false;
      return;
    }

    suggestions.value = [];

    autocompleteInstance.value.getPlacePredictions(
      {
        input: searchQuery.value,
        types: ["geocode"],
        language: "zh-TW",
        componentRestrictions: { country: "TW" },
      },
      (predictions, status) => {
        isLoading.value = false;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          suggestions.value = predictions || [];
          isLoadOK.value =true
        } else {
          suggestions.value = [];
          isLoadOK.value =true
          message.warning('未搜尋到地址，請重新輸入')
          searchQuery.value=null
        }
      }
    );
  }, 2000);

  const triggerInputChange = () => {
    isLoading.value = true;
    onInputChange();
  };

  return {
    searchQuery,
    suggestions,
    onInputChange,
    triggerInputChange,
    initializeAutocomplete,
    fetchSuggestions,

    };
}
