import create from '../../../_styles/utils/create-component-base'

// no style, placeholder
export default create({
  theme: 'dark',
  name: 'BaseSlotMachine',
  getDerivedVariables ({ base, derived }) {
    return {}
  }
})