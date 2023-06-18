import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types/GraphSpec'
import { system } from '../../util/system'

const spec =
  require('../../../system/core/array/ArrayBuilder/spec.json') as GraphSpec

const ArrayBuilder = fromSpec(spec, _specs)

const arrayBuilder = new ArrayBuilder(system)

false && watchUnitAndLog(arrayBuilder)
false && watchGraphAndLog(arrayBuilder)

arrayBuilder.play()
