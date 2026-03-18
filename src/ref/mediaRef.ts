import { ref } from "vue";

export default function mediaRef(mediaQuery: MediaQueryList) {
  const result = ref<boolean>(mediaQuery.matches);
  mediaQuery.addEventListener('change', (e) => {
    result.value = e.matches;
  });
  return result;
}
