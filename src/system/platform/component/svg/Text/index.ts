import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_TEXT } from '../../../../_ids'

export interface I {
  style: Dict<string>
}

export interface O {}

export default class SVGText extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_TEXT
    )
  }
}
