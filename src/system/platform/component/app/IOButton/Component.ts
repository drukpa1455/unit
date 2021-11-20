import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/parentElement'
import { userSelect } from '../../../../../client/style/userSelect'
import { getActiveColor } from '../../../../../client/theme'
import { Dict } from '../../../../../types/Dict'
import { System } from '../../../../../system'
import TextDiv from '../TextDiv/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  value?: string
}

export const DEFAULT_STYLE = {
  width: 'fit-content',
  fontSize: '14px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '3px',
  padding: '6px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  ...userSelect('none'),
}

export default class IOButton extends Element<HTMLDivElement, Props> {
  private _button: TextDiv

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { value, style } = $props

    const button = new TextDiv(
      {
        value,
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system
    )
    this._button = button

    const $element = parentElement()

    this.$element = $element
    this.$slot = button.$slot
    this.$unbundled = false
    this.$subComponent = {
      button,
    }

    this.registerRoot(button)
  }

  onPropChanged(prop: string, current: any): void {
    // TODO
  }

  onMount(): void {
    // this._refresh_color()
  }

  private _refresh_color = () => {
    const { $theme } = this.$context
    const color = getActiveColor($theme)
    mergePropStyle(this._button, {
      borderColor: color,
      color,
    })
  }
}
