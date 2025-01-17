import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_DIV, ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { system } from '../util/system'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'
const UNIT_ID_IDENTITY_1 = 'identity1'
const UNIT_ID_DIV = 'div'
const UNIT_ID_DIV_0 = 'div0'

const spec0 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
  },
})

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec0,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

const empty0 = composition0.refUnit(UNIT_ID_EMTPY) as Graph

composition0.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [],
    plug: [],
  },
  { merge: {}, link: {}, unit: {}, plug: {} },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getMergeCount(), 1)

assert.equal(empty0.getUnitCount(), 0)
assert.equal(empty0.getInputCount(), 0)
assert.equal(empty0.getOutputCount(), 0)

const spec1 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
  },
})

const composition1 = new Graph<{ number: number }, { sum: number }>(
  spec1,
  {},
  system
)

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.play()

const empty1 = composition1.refUnit(UNIT_ID_EMTPY) as Graph

composition1.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: ['0'],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: {},
    },
    [UNIT_ID_IDENTITY_0]: {
      input: {},
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition1.getUnitCount(), 1)
assert.equal(composition1.getMergeCount(), 0)

assert.equal(empty1.getUnitCount(), 2)
assert.equal(empty1.getInputCount(), 1)
assert.equal(empty1.getOutputCount(), 1)

assert(empty1.hasInputNamed('a'))
assert(empty1.hasOutputNamed('a'))

assert.deepEqual(empty1.getExposedInputSpec('a'), {
  plug: {
    '0': {
      unitId: UNIT_ID_IDENTITY,
      pinId: 'a',
    },
  },
  ref: false,
})
assert.deepEqual(empty1.getExposedOutputSpec('a'), {
  plug: {
    '0': {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})

assert.deepEqual(empty1.getMergeSpec('0'), {
  [UNIT_ID_IDENTITY]: {
    output: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY_0]: {
    input: {
      a: true,
    },
  },
})

empty1.push('a', 0)

assert.equal(empty1.peakInput('a'), 0)
assert.equal(empty1.takeOutput('a'), 0)

const spec2 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
  },
})

const composition2 = new Graph<{ number: number }, { sum: number }>(
  spec2,
  {},
  system
)

false && watchUnitAndLog(composition2)
false && watchGraphAndLog(composition2)

composition2.play()

const empty2 = composition2.refUnit(UNIT_ID_EMTPY) as Graph

composition2.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 1)
assert.equal(composition2.getMergeCount(), 1)

assert.equal(empty2.getUnitCount(), 2)
assert.equal(empty2.getInputCount(), 2)
assert.equal(empty2.getOutputCount(), 2)

const spec3 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
  },
  inputs: {
    a: {
      plug: {
        0: {
          unitId: UNIT_ID_IDENTITY,
          pinId: 'a',
        },
      },
    },
  },
})

const composition3 = new Graph<{ number: number }, { sum: number }>(
  spec3,
  {},
  system
)

false && watchUnitAndLog(composition3)
false && watchGraphAndLog(composition3)

composition3.play()

const empty3 = composition3.refUnit(UNIT_ID_EMTPY) as Graph

composition3.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition3.getUnitCount(), 1)
assert.equal(composition3.getMergeCount(), 1)

assert.equal(empty3.getUnitCount(), 2)
assert.equal(empty3.getInputCount(), 2)
assert.equal(empty3.getOutputCount(), 2)

assert.deepEqual(composition3.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_EMTPY,
      pinId: 'a',
    },
  },
})

const spec4 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
  },
  merges: {},
  inputs: {
    a: {
      plug: {
        0: {
          unitId: UNIT_ID_IDENTITY,
          pinId: 'a',
        },
      },
      ref: false,
    },
  },
})

const composition4 = new Graph<{ number: number }, { sum: number }>(
  spec4,
  {},
  system
)

false && watchUnitAndLog(composition4)
false && watchGraphAndLog(composition4)

composition4.play()

const empty4 = composition4.refUnit(UNIT_ID_EMTPY) as Graph

composition4.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [
      { unitId: UNIT_ID_IDENTITY, type: 'input', pinId: 'a' },
      { unitId: UNIT_ID_IDENTITY, type: 'output', pinId: 'a' },
    ],
    unit: [UNIT_ID_IDENTITY],
    plug: [{ type: 'input', pinId: 'a', subPinId: '0' }],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY]: {
        input: {
          a: {
            mergeId: null,
            oppositePinId: null,
          },
        },
        output: {
          a: {
            mergeId: null,
            oppositePinId: null,
          },
        },
      },
    },
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {
      a: {
        0: {
          unitId: UNIT_ID_IDENTITY,
          pinId: 'a',
        },
      },
    },
    output: {},
  },
  {},
  {}
)

assert.equal(composition4.getUnitCount(), 1)

assert.equal(composition4.getMergeCount(), 0)

assert.equal(empty4.getUnitCount(), 1)
assert.equal(empty4.getInputCount(), 1)
assert.equal(empty4.getOutputCount(), 0)

assert.deepEqual(empty4.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY,
      pinId: 'a',
    },
  },
})

const spec5 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_1]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
    1: {
      [UNIT_ID_IDENTITY_0]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_1]: {
        input: {
          a: true,
        },
      },
    },
  },
  inputs: {},
})

const composition5 = new Graph<{ number: number }, { sum: number }>(
  spec5,
  {},
  system
)

false && watchUnitAndLog(composition5)
false && watchGraphAndLog(composition5)

composition5.play()

const empty5 = composition5.refUnit(UNIT_ID_EMTPY) as Graph

composition5.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: {
            mergeId: '0',
            oppositePinId: 'a',
          },
        },
        output: {
          a: {
            mergeId: '1',
            oppositePinId: 'a',
          },
        },
      },
    },
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition5.getUnitCount(), 3)
assert.equal(composition5.getMergeCount(), 2)

assert.equal(empty5.getUnitCount(), 1)
assert.equal(empty5.getInputCount(), 1)
assert.equal(empty5.getOutputCount(), 1)

assert.deepEqual(empty5.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})

const spec6 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
    [UNIT_ID_IDENTITY_1]: {
      id: ID_IDENTITY,
    },
  },
  merges: {
    0: {
      [UNIT_ID_IDENTITY]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: true,
        },
      },
    },
    1: {
      [UNIT_ID_IDENTITY_0]: {
        output: {
          a: true,
        },
      },
      [UNIT_ID_IDENTITY_1]: {
        input: {
          a: true,
        },
      },
    },
  },
  inputs: {},
})

const composition6 = new Graph<{ number: number }, { sum: number }>(
  spec6,
  {},
  system
)

false && watchUnitAndLog(composition6)
false && watchGraphAndLog(composition6)

composition6.play()

const empty6 = composition6.refUnit(UNIT_ID_EMTPY) as Graph

composition6.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: ['0', '1'],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {
      '0': '0',
      '1': '1',
    },
    link: {},
    unit: {
      [UNIT_ID_IDENTITY_0]: UNIT_ID_IDENTITY_0,
    },
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          unitId: UNIT_ID_IDENTITY_0,
          pinId: 'a',
        },
      },
      output: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
    },
    1: {
      input: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          unitId: UNIT_ID_IDENTITY_0,
          pinId: 'a',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition6.getUnitCount(), 3)
assert.equal(composition6.getMergeCount(), 2)

assert.equal(empty6.getUnitCount(), 1)
assert.equal(empty6.getInputCount(), 1)
assert.equal(empty6.getOutputCount(), 1)

assert.deepEqual(empty6.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})
assert.deepEqual(empty6.getExposedPinSpec('output', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})

composition6.setUnitInputData(UNIT_ID_IDENTITY, 'a', 1)

const spec7 = system.newSpec({
  units: {
    [UNIT_ID_EMTPY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_DIV]: {
      id: ID_DIV,
    },
    [UNIT_ID_DIV_0]: {
      id: ID_DIV,
    },
  },
  merges: {},
  component: {
    subComponents: {
      [UNIT_ID_DIV]: {
        children: [UNIT_ID_DIV_0],
      },
      [UNIT_ID_DIV_0]: {},
    },
    children: [UNIT_ID_DIV],
  },
})

const composition7 = new Graph<{ number: number }, { sum: number }>(
  spec7,
  {},
  system
)

false && watchUnitAndLog(composition7)
false && watchGraphAndLog(composition7)

composition7.play()

const empty7 = composition7.refUnit(UNIT_ID_EMTPY) as Graph

composition7.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: ['0', '1'],
    link: [],
    unit: [UNIT_ID_DIV, UNIT_ID_DIV_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {
      [UNIT_ID_DIV]: UNIT_ID_DIV,
      [UNIT_ID_DIV_0]: UNIT_ID_DIV_0,
    },
    plug: {},
  },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {
    [UNIT_ID_DIV_0]: UNIT_ID_DIV,
  },
  {
    [UNIT_ID_DIV]: [UNIT_ID_DIV_0],
  }
)

assert.equal(composition7.getUnitCount(), 1)

assert.equal(empty7.getUnitCount(), 2)

assert.deepEqual(empty7.getComponentSpec(), {
  subComponents: {
    [UNIT_ID_DIV]: {
      children: [UNIT_ID_DIV_0],
      childSlot: {
        [UNIT_ID_DIV_0]: 'default',
      },
    },
    [UNIT_ID_DIV_0]: {
      children: [],
    },
  },
  children: [UNIT_ID_DIV],
})
