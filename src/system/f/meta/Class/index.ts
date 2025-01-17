import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { cloneBundle } from '../../../../spec/cloneBundle'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_CLASS } from '../../../_ids'

export interface I<T> {
  unit: Unit
}

export interface O<T> {
  class: UnitBundle<any>
}

export default class Class<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'any'],
        o: ['class'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_CLASS
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    const Class = cloneBundle(unit)

    done({ class: Class })
  }
}
