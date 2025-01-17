import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import {
  getGlobalComponent,
  listenGlobalComponent,
} from '../../../../globalComponent'
import { ID_SIZE_OBSERVER } from '../../../../_ids'

export type I = {
  component: Component_
}

export type O = {
  width: number
  height: number
}

export default class SizeObserver extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component'],
        fo: [],
        i: [],
        o: ['width', 'height'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_SIZE_OBSERVER
    )
  }

  private _observer: ResizeObserver

  f({ component }: I, done: Done<O>) {
    const __global_id = component.getGlobalId()

    let _component = getGlobalComponent(
      this.__system,
      __global_id
    ) as Component<HTMLElement>

    const setup = (_next_component: Component) => {
      if (!this._observer) {
        const observer_callback: ResizeObserverCallback = (
          entries: ResizeObserverEntry[]
        ) => {
          const entry = entries[0]

          const { width, height } = entry.contentRect

          this._output.width.push(width)
          this._output.height.push(height)
        }

        const observer = new ResizeObserver(observer_callback)

        this._observer = observer
      }

      if (_component) {
        this._observer.unobserve(_component.$element)
      }

      _component = _next_component as Component<HTMLElement>

      const { $element } = _component

      // this._observer.observe($element)
    }

    if (_component) {
      setup(_component)
    }

    const unlisten_global = listenGlobalComponent(
      this.__system,
      __global_id,
      (_component) => {
        setup(_component)
      }
    )
  }

  d() {
    // TODO
  }
}
