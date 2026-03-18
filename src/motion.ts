import storageRef from './ref/storageRef';
import mediaRef from './ref/mediaRef';
import { computed, watch } from 'vue';

export enum Motions {
  Reduce = 'reduce',
  NoPreference = 'no-preference',
  Auto = 'auto',
}

export const motionValueList = [Motions.Auto, Motions.NoPreference, Motions.Reduce] as const;

export const motionValue = storageRef<Motions>('_k_motion', Motions.NoPreference, localStorage);
const matcherRef = mediaRef(window.matchMedia('(prefers-reduced-motion: reduce)'));

export const motion = computed(() => {
  const systemMotion = matcherRef.value ? Motions.Reduce : Motions.NoPreference;
    if (!motionValueList.includes(motionValue.value)) {
      motionValue.value = Motions.NoPreference;
    }
  if (motionValue.value === Motions.Auto) {
    return systemMotion;
  }
  return motionValue.value;
});
function updateDomMotion() {
  document.documentElement.dataset.motion = motion.value;
}
watch(motion, updateDomMotion, { immediate: true });
