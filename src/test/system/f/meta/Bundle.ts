import * as assert from 'assert'
import { system } from '../../../util/system'
import { watchUnitAndLog } from '../../../../debug'
import Bundle from '../../../../system/f/meta/Bundle'
import { ID_IDENTITY } from '../../../spec/id'

const bundle = new Bundle(system)

bundle.play()

false && watchUnitAndLog(bundle)

const Class = system.fromBundle({
  spec: {},
  specs: {},
})

const graph = new Class(system)

graph.play()

bundle.push('opt', {})
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
  },
  specs: {},
})

graph.addUnitSpec('identity', {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '1',
      },
    },
  },
})

bundle.push('opt', {})
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
    units: {
      identity: {
        id: '260d774e-bc89-4027-aa92-cb1985fb312b',
        input: {
          a: {
            constant: false,
            data: undefined,
            ignored: false,
          },
        },
        memory: undefined,
        output: {
          a: {
            constant: false,
            data: undefined,
            ignored: false,
          },
        },
      },
    },
  },
  specs: {},
})

const identity = graph.refUnit('identity')

identity.push('a', 1)

bundle.push('opt', { snapshot: true })
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
    units: {
      identity: {
        id: '260d774e-bc89-4027-aa92-cb1985fb312b',
        memory: {
          input: {
            a: {
              _register: '1',
              _invalid: 'false',
              _constant: 'false',
              _ignored: 'false',
              _idle: 'false',
            },
          },
          output: {
            a: {
              _register: '1',
              _invalid: 'false',
              _constant: 'false',
              _ignored: 'false',
              _idle: 'false',
            },
          },
          memory: {
            __buffer: {},
            _forwarding: {},
            _backwarding: {},
            _forwarding_empty: {},
            _looping: {},
          },
        },
        input: { a: { ignored: false, constant: false, data: undefined } },
        output: { a: { ignored: false, constant: false, data: undefined } },
      },
    },
  },
  specs: {},
})
