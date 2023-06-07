import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_RANGE } from '../../system/_ids'
import { system } from '../util/system'

const UNIT_ID_RANGE = 'UNIT_ID_RANGE'
const UNIT_ID_RANGE_CLONE = 'UNIT_ID_RANGE_CLONE'

const spec = system.emptySpec()

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnitSpec(UNIT_ID_RANGE, {
  unit: {
    id: ID_RANGE,
    output: {
      test: {
        ignored: true,
      },
    },
  },
})

composition0.setUnitPinData(UNIT_ID_RANGE, 'input', 'a', 0)
composition0.setUnitPinData(UNIT_ID_RANGE, 'input', 'b', 3)

composition0.cloneUnit(UNIT_ID_RANGE, UNIT_ID_RANGE_CLONE)

const clonedRange = composition0.getUnit(UNIT_ID_RANGE_CLONE) as Graph

assert(!clonedRange.paused())

assert.deepEqual(clonedRange.takeOutput('i'), 0)
assert.deepEqual(clonedRange.takeOutput('i'), 1)
assert.deepEqual(clonedRange.takeOutput('i'), 2)
assert.deepEqual(clonedRange.takeOutput('i'), undefined)
