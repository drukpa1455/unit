import { emptySpec, newSpecId } from './client/spec'
import { Object_ } from './Object'
import { GraphSpec, GraphSpecs, Spec, Specs } from './types'
import { Dict } from './types/Dict'
import { R } from './types/interface/R'
import { uuidNotIn } from './util/id'
import { clone } from './util/object'

export class Registry implements R {
  specs: Specs
  specs_: Object_<Specs>
  specsCount: Dict<number> = {}

  constructor(specs: Specs) {
    this.specs = specs
    this.specs_ = new Object_(specs)
  }

  newSpecId(): string {
    return uuidNotIn(this.specs)
  }

  hasSpec(id: string): boolean {
    return !!this.specs[id]
  }

  emptySpec() {
    const id = newSpecId(this.specs)

    const spec = emptySpec({ id })

    this.newSpec(spec)

    return spec
  }

  newSpec(spec: GraphSpec) {
    // console.log('newSpec', { spec })

    const specId = newSpecId(this.specs)

    spec.id = specId

    this.specs_.set(specId, spec)

    return spec
  }

  getSpec(id: string): Spec {
    return this.specs[id]
  }

  setSpec(specId: string, spec: GraphSpec) {
    // console.log('setSpec', { specId, spec })

    this.specs_.set(specId, spec)
  }

  injectSpecs(newSpecs: GraphSpecs): Dict<string> {
    // console.log('injectSpecs', { newSpecs })

    const mapSpecId: Dict<string> = {}

    const visited: Set<string> = new Set()

    const _set = (specId, spec) => {
      if (visited.has(specId)) {
        return
      }

      if (mapSpecId[specId]) {
        return
      }

      let nextSpecId = specId
      let hasSpec = false

      while (this.hasSpec(nextSpecId)) {
        nextSpecId = this.newSpecId()

        hasSpec = true
      }

      const { units } = spec

      for (const unitId in units) {
        const unit = units[unitId]

        if (this.hasSpec(unit.id) && !!this.specs[unit.id]) {
          //
        } else {
          const spec = newSpecs[unit.id]

          _set(unit.id, spec)
        }
      }

      visited.add(specId)

      if (hasSpec) {
        // TODO spec equality
        if (JSON.stringify(spec) === JSON.stringify(this.getSpec(specId))) {
          //
        } else {
          // TODO
          mapSpecId[specId] = nextSpecId

          this.specs_.set(specId, spec)
        }
      } else {
        this.specs_.set(specId, spec)
      }

      // specs_.set(nextSpecId, spec) // TODO
    }

    for (const spec_id in newSpecs) {
      const spec = newSpecs[spec_id]

      _set(spec_id, spec)
    }

    return mapSpecId
  }

  forkSpec(spec: GraphSpec): [string, GraphSpec] {
    if ((this.specsCount[spec.id] ?? 0) > 0) {
      const clonedSpec = clone(spec)

      const { id: newSpecId } = this.newSpec(clonedSpec)

      delete clonedSpec.system

      return [newSpecId, clonedSpec]
    } else {
      this.setSpec(spec.id, spec)

      return [spec.id, spec]
    }
  }

  registerUnit(id: string): void {
    // console.log('registerUnit', { id })

    if (this.specsCount[id] === undefined) {
      this.specsCount[id] = 0
    }

    this.specsCount[id] += 1
  }

  unregisterUnit(id: string): void {
    // console.log('unregisterUnit', { id })

    if (!this.specsCount[id]) {
      throw new Error(`unregisterUnit: no spec with id ${id}`)
    }

    this.specsCount[id] -= 1

    // if (this.specsCount[id] === 0) {
    //   console.log('delete', { id })
    //   delete this.specsCount[id]

    //   this.deleteSpec(id)
    // }
  }

  deleteSpec(id: string): void {
    // console.log('deleteSpec', id)

    this.specs_.delete(id)
  }
}
