import {
  h,
  Transition,
  computed,
  defineComponent,
  inject,
  withDirectives,
  vShow,
  CSSProperties,
  ref,
  nextTick
} from 'vue'
import { useTheme } from '../../_mixins'
import { loadingBarLight } from '../styles'
import { loadingBarProviderInjectionKey } from './LoadingBarProvider'
import style from './styles/index.cssr'

function createClassName (
  status: 'error' | 'finishing' | 'starting',
  clsPrefix: string
): string {
  return `${clsPrefix}-loading-bar ${clsPrefix}-loading-bar--${status}`
}

export default defineComponent({
  name: 'LoadingBar',
  setup () {
    const {
      props: providerProps,
      mergedClsPrefixRef
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = inject(loadingBarProviderInjectionKey)!
    const loadingBarRef = ref<HTMLElement | null>(null)
    const enteringRef = ref(false)
    const loadingRef = ref(false)
    const transitionDisabledRef = ref(false)
    let finishing = false
    let erroring = false
    async function init (): Promise<void> {
      enteringRef.value = false
      loadingRef.value = false
      finishing = false
      erroring = false
      transitionDisabledRef.value = true
      await nextTick()
      transitionDisabledRef.value = false
    }
    async function start (
      fromProgress = 0,
      toProgress = 80,
      status: 'starting' | 'error' = 'starting'
    ): Promise<void> {
      await init()
      loadingRef.value = true
      await nextTick()
      const el = loadingBarRef.value
      if (!el) return
      el.style.maxWidth = `${fromProgress}%`
      el.style.transition = 'none'
      void el.offsetWidth
      el.className = createClassName(status, mergedClsPrefixRef.value)
      el.style.transition = ''
      el.style.maxWidth = `${toProgress}%`
    }
    function finish (): void {
      if (finishing || erroring) return
      if (!loadingRef.value) {
        void start(100, 100).then(() => {
          finishing = true
          const el = loadingBarRef.value
          if (!el) return
          el.className = createClassName('finishing', mergedClsPrefixRef.value)
          void el.offsetWidth
          loadingRef.value = false
        })
      } else {
        finishing = true
        const el = loadingBarRef.value
        if (!el) return
        el.className = createClassName('finishing', mergedClsPrefixRef.value)
        el.style.maxWidth = '100%'
        void el.offsetWidth
        loadingRef.value = false
      }
    }
    function error (): void {
      if (finishing || erroring) return
      if (!loadingRef.value) {
        void start(100, 100, 'error').then(() => {
          erroring = true
          const el = loadingBarRef.value
          if (!el) return
          el.className = createClassName('error', mergedClsPrefixRef.value)
          void el.offsetWidth
          loadingRef.value = false
        })
      } else {
        erroring = true
        const el = loadingBarRef.value
        if (!el) return
        el.className = createClassName('error', mergedClsPrefixRef.value)
        el.style.maxWidth = '100%'
        void el.offsetWidth
        loadingRef.value = false
      }
    }
    function handleEnter (): void {
      enteringRef.value = true
    }
    function handleAfterEnter (): void {
      enteringRef.value = false
    }
    async function handleAfterLeave (): Promise<void> {
      await init()
    }
    const themeRef = useTheme(
      'LoadingBar',
      'LoadingBar',
      style,
      loadingBarLight,
      providerProps,
      mergedClsPrefixRef
    )
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      loadingBarRef,
      loading: loadingRef,
      entering: enteringRef,
      transitionDisabled: transitionDisabledRef,
      start,
      error,
      finish,
      handleEnter,
      handleAfterEnter,
      handleAfterLeave,
      cssVars: computed(() => {
        const {
          self: { height, colorError, colorLoading }
        } = themeRef.value
        return {
          '--height': height,
          '--color-loading': colorLoading,
          '--color-error': colorError
        }
      })
    }
  },
  render () {
    const { mergedClsPrefix } = this
    return (
      <Transition
        name="fade-in-transition"
        appear
        onEnter={this.handleEnter}
        onAfterEnter={this.handleAfterEnter}
        onAfterLeave={this.handleAfterLeave}
        css={!this.transitionDisabled}
      >
        {/*
          BUG: need to use v-show nor it will glitch when triggers start, end,
          start. This could be a bug of vue but currently I have no time to verify
          it.
        */}
        {{
          default: () =>
            withDirectives(
              <div class={`${mergedClsPrefix}-loading-bar-container`}>
                <div
                  ref="loadingBarRef"
                  class={`${mergedClsPrefix}-loading-bar`}
                  style={this.cssVars as CSSProperties}
                />
              </div>,
              [[vShow, this.loading || (!this.loading && this.entering)]]
            )
        }}
      </Transition>
    )
  }
})
