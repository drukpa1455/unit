import { Graph } from '.'
import { Pin } from '../../Pin'
import { SELF } from '../../constant/SELF'
import { emptyIO } from '../../spec/emptyIO'
import {
  forEachPinOnMerge,
  getMergePinCount,
  getMergeUnitPinCount,
  opposite,
} from '../../spec/util'
import pathGet from '../../system/core/object/DeepGet/f'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../../system/core/object/KeyCount/f'
import { GraphConnectUnitOpt } from '../../system/platform/component/app/Editor/Component'
import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphPinsSpec,
  GraphPlugOuterSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { IO } from '../../types/IO'
import { IOOf, _IOOf, forIO, forIOObjKV } from '../../types/IOOf'
import { C } from '../../types/interface/C'
import { G } from '../../types/interface/G'
import { U } from '../../types/interface/U'
import { UCG } from '../../types/interface/UCG'
import {
  clone,
  forEachObjKV,
  forEachObjVK,
  getObjSingleKey,
  pathOrDefault,
  pathSet,
} from '../../util/object'
import Merge from '../Merge'
import { Unit } from '../Unit'
import { GraphMoveSubGraphData } from './interface'

export function moveUnit(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  unitId: string,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphConnectUnitOpt,
  ignoredUnit: Set<string>,
  unitIgnoredPin: Dict<IOOf<Set<string>>>,
  ignoredMerge: Set<string>,
  pinSpecs: IOOf<Dict<GraphPinSpec>>,
  reverse: boolean
) {
  const {
    nextIdMap,
    nextPinIdMap,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
  } = collapseMap

  const unit = source.getUnit(unitId)

  const nextUnitId = nextIdMap.unit[unitId] || unitId
  const nextSubComponentParent = nextSubComponentParentMap[unitId] || null
  const nextSubComponentChildren = nextSubComponentChildrenMap[unitId] || []
  const nextUnitPinMap = nextPinIdMap[unitId] || {}

  const ignoredPin = unitIgnoredPin[unitId] || {
    input: new Set(),
    output: new Set(),
  }

  source.removeUnit(unitId, false, false, false)

  target.addUnit(nextUnitId, unit, undefined, false)

  if (nextSubComponentParent) {
    if (target.hasUnit(nextSubComponentParent)) {
      target.moveRoot(nextSubComponentParent, nextUnitId, 'default')
    }
  }

  if (nextSubComponentChildren) {
    for (const nextSubComponentChildId of nextSubComponentChildren) {
      if (target.hasUnit(nextSubComponentChildId)) {
        target.moveRoot(nextUnitId, nextSubComponentChildId, 'default')
      }
    }
  }

  const movePinInto = (type: IO, pinId: string): void => {
    // console.log('movePinInto', unitId, type, pinId)

    if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
      const {
        pinId: nextPinId,
        subPinId: nextSubPinId,
        mergeId,
        merge,
      } = pathOrDefault(nextUnitPinMap, [type, pinId], {
        pinId: undefined,
        subPinId: undefined,
      })

      const shouldSwapMergePin = mergeId && !ignoredMerge.has(mergeId)

      if (reverse) {
        //
      } else {
        if (target.hasPinNamed(type, nextPinId)) {
          //
        } else {
          forEachObjVK(pinSpecs[type] || {}, ({ plug = {} }, id) => {
            for (const subPinId in plug) {
              const subPinSpec = plug[subPinId]

              if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
                source.unplugPin(type, id, subPinId, false, false)

                break
              }
            }
          })
        }
      }

      if (nextPinId && nextSubPinId) {
        if (reverse) {
          if (source.hasPlug(type, nextPinId, nextSubPinId)) {
            source.coverPin(type, nextPinId, nextSubPinId, false)

            if (source.getPinPlugCount(type, nextPinId) === 0) {
              source.coverPinSet(type, nextPinId, false)
            }
          }

          const { pinId: _pinId, subPinId: _subPinId } =
            connectOpt.plugs?.[type]?.[pinId] || {}

          if (_pinId && _subPinId) {
            if (target.hasPinNamed(type, _pinId)) {
              target.plugPin(
                type,
                _pinId,
                _subPinId,
                {
                  unitId,
                  pinId,
                },
                false,
                false
              )
            } else {
              target.exposePinSet(
                type,
                _pinId,
                {
                  plug: {
                    [_subPinId]: {
                      unitId,
                      pinId,
                    },
                  },
                },
                false,
                false
              )
            }
          }

          // forEachValueKey(pinSpecs[type] || {}, ({ plug }, id) => {
          //   for (const subPinId in plug) {
          //     const subPinSpec = plug[subPinId]

          //     if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
          //       if (target.hasPinNamed(type, id)) {
          //         target.plugPin(
          //           type,
          //           id,
          //           subPinId,
          //           {
          //             unitId,
          //             pinId,
          //           },
          //           false,
          //           false
          //         )
          //       } else {
          //         target.exposePinSet(
          //           type,
          //           id,
          //           {
          //             plug: {
          //               '0': {
          //                 unitId,
          //                 pinId,
          //               },
          //             },
          //           },
          //           false,
          //           false
          //         )
          //       }

          //       break
          //     }
          //   }
          // })
        } else {
          if (target.hasPinNamed(type, nextPinId)) {
            target.exposePin(
              type,
              nextPinId,
              nextSubPinId,
              {
                unitId: nextUnitId,
                pinId,
              },
              false
            )
          } else {
            const ref = unit.isPinRef(type, pinId)
            const data = unit.getPinData(type, pinId)

            target.exposePinSet(
              type,
              nextPinId,
              {
                plug: {
                  '0': {
                    unitId: nextUnitId,
                    pinId,
                  },
                },
                ref,
              },
              data,
              false,
              false
            )

            forEachValueKey(pinSpecs[type] || {}, ({ plug }, id) => {
              for (const subPinId in plug) {
                const subPinSpec = plug[subPinId]

                if (
                  subPinSpec.unitId === unitId &&
                  subPinSpec.pinId === pinId
                ) {
                  source.plugPin(
                    type,
                    id,
                    subPinId,
                    {
                      unitId: graphId,
                      pinId: nextPinId,
                    },
                    false
                  )

                  break
                }
              }
            })
          }
        }

        const constant = unit.isPinConstant(type, pinId)

        if (constant) {
          if (reverse) {
            //
          } else {
            target.setUnitPinConstant(unitId, type, pinId, false)
            target.setPinConstant(type, nextPinId, true)
          }
        }

        if (shouldSwapMergePin) {
          if (reverse) {
            if (!target.hasMerge(mergeId)) {
              target.addMerge(merge ?? {}, mergeId, false, false)
            }

            if (target.hasMergePin(mergeId, graphId, type, pinId)) {
              target.removePinFromMerge(
                mergeId,
                graphId,
                type,
                pinId,
                false,
                false
              )
            }

            target.addPinToMerge(mergeId, unitId, type, pinId, false, false)
          } else {
            if (!source.hasMerge(mergeId)) {
              source.addMerge(merge ?? {}, mergeId, false, false)
            }

            if (source.hasMergePin(mergeId, unitId, type, pinId)) {
              source.removePinFromMerge(
                mergeId,
                unitId,
                type,
                pinId,
                false,
                false
              )
            }

            if (!source.hasMergePin(mergeId, graphId, type, nextPinId)) {
              source.addPinToMerge(
                mergeId,
                graphId,
                type,
                nextPinId,
                false,
                false
              )
            }
          }
        }
      }
    }
  }

  const inputs = unit.getInputNames()
  for (const input_id of inputs) {
    movePinInto('input', input_id)
  }
  const outputs = unit.getOutputNames()
  for (const output_id of outputs) {
    movePinInto('output', output_id)
  }
}

export function moveLinkPinInto(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  unitId: string,
  type: IO,
  pinId: string,
  collapseMap: GraphMoveSubGraphData,
  oppositeMergeId: string | null,
  oppositePinId: string | null,
  plugPinSpec: { pinId: string; subPinId: string } | null,
  ignoredUnit: Set<string> = new Set(),
  reverse: boolean
): void {
  if (ignoredUnit.has(unitId)) {
    return
  }

  const { nextPinIdMap } = collapseMap

  const { mergeId, merge } = pathOrDefault(nextPinIdMap, [type, pinId], {
    pinId: undefined,
    subPinId: undefined,
  })

  if (graphId === unitId) {
    if (mergeId && merge) {
      const mergeUnit = merge[unitId]

      const mergePinCount = getMergePinCount(merge)
      const unitMergePinCount = getMergeUnitPinCount(mergeUnit)

      if (mergePinCount - unitMergePinCount > 0) {
        //
      } else {
        target.coverPinSet(type, pinId, false)
      }
    } else {
      target.coverPinSet(type, pinId, false)
    }
  } else {
    if (oppositeMergeId && oppositePinId) {
      const oppositeType = opposite(type)

      if (reverse) {
        if (source.hasPinNamed(oppositeType, oppositePinId)) {
          source.coverPinSet(oppositeType, oppositePinId, false)
        } else {
          //
        }
      } else {
        if (target.hasPinNamed(oppositeType, oppositePinId)) {
          //
        } else {
          const unit = source.getUnit(unitId)

          const data = source.getUnitPinData(unitId, type, pinId)

          const ref = unit.isPinRef(type, pinId)

          const pinSpec = { plug: { '0': {} }, ref }

          target.exposePinSet(
            oppositeType,
            oppositePinId,
            pinSpec,
            data,
            false,
            false
          )
        }

        if (source.hasMerge(oppositeMergeId)) {
          const merge = source.getMergeSpec(oppositeMergeId)

          if (!merge?.[graphId]?.[oppositeType]?.[oppositePinId]) {
            source.addPinToMerge(
              oppositeMergeId,
              graphId,
              oppositeType,
              oppositePinId,
              false,
              false
            )
          }

          source.addPinToMerge(
            oppositeMergeId,
            unitId,
            type,
            pinId,
            false,
            false
          )
        } else {
          const merge = {
            [unitId]: {
              [type]: {
                [pinId]: true,
              },
            },
            [graphId]: {
              [oppositeType]: {
                [oppositePinId]: true,
              },
            },
          }

          source.addMerge(merge, oppositeMergeId, false, false)
        }
      }
    } else {
      //
    }

    if (plugPinSpec) {
      const nextUnitId = unitId // TODO

      const newPinSpec =
        graphId !== unitId
          ? { plug: { '0': { unitId: nextUnitId, pinId } } }
          : { plug: { '0': {} } }

      target.exposePinSet(type, plugPinSpec.pinId, newPinSpec, false)

      source.plugPin(type, plugPinSpec.pinId, plugPinSpec.subPinId, {
        unitId: graphId,
        pinId: plugPinSpec.pinId,
      })
    }
  }
}

export function moveMerge(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  mergeId: string,
  mergeSpec: GraphMergeSpec,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphConnectUnitOpt,
  ignoredUnit: Set<string> = new Set(),
  pinSpecs: IOOf<Dict<GraphPinSpec>>,
  reverse: boolean
) {
  const { nextIdMap, nextMergePinId } = collapseMap

  const { input: nextInput = null, output: nextOutput = null } =
    nextMergePinId[mergeId] || {}

  let pinIntoCount = 0

  const nextMerge: GraphMergeSpec = {}

  const { merges: graphMerges } = connectOpt

  if (source.hasMerge(mergeId)) {
    source.removeMerge(mergeId, false, false)
  }

  const moveMergePinInto = (unitId: string, type: IO, pinId: string): void => {
    if (ignoredUnit.has(unitId) || unitId === graphId) {
      if (unitId === graphId) {
        const pinSpec = target.getExposedPinSpec(type, pinId)

        const { plug } = pinSpec

        for (const subPinId in plug) {
          const subPin = plug[subPinId]

          if (subPin.unitId && subPin.pinId) {
            pathSet(nextMerge, [subPin.unitId, type, subPin.pinId], true)
          } else if (subPin.mergeId) {
            const mergeSpec = target.getMergeSpec(subPin.mergeId)

            forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
              pathSet(nextMerge, [unitId, type, pinId], true)
            })
          }
        }

        pinIntoCount++
      } else {
        pathSet(nextMerge, [unitId, type, pinId], true)

        pinIntoCount++
      }
    }

    if (nextInput || nextOutput) {
      const isInput = type === 'input'

      const {
        mergeId: nextMergeId,
        pinId: nextPinId,
        subPinSpec: nextSubPinSpec,
      } = isInput ? nextOutput : nextInput

      if (source.hasMerge(mergeId)) {
        // source.removePinOrMerge(mergeId, unitId, type, pinId, false, false)
      }

      moveLinkPinInto(
        source,
        target,
        graphId,
        unitId,
        type,
        pinId,
        collapseMap,
        nextMergeId,
        nextPinId,
        null,
        ignoredUnit,
        reverse
      )
    }
  }

  forEachPinOnMerge(mergeSpec, moveMergePinInto)

  if (reverse) {
    if (pinIntoCount > 1) {
      target.addMerge(nextMerge, mergeId, false, false)
    }
  } else {
    if (pinIntoCount === 0 || pinIntoCount > 1) {
      target.addMerge(nextMerge, mergeId, false, false)
    }
  }

  if (pinIntoCount > 1) {
    const originalMergeCount = keyCount(mergeSpec)

    if (originalMergeCount === pinIntoCount) {
      const graphMerge = mergeSpec[graphId]

      if (graphMerge) {
        forIOObjKV(graphMerge, (type, pinId) => {
          target.coverPinSet(type, pinId, false)
        })
      }
    }
  }

  const processMergePin = (
    type: IO,
    nextPin: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      oppositeMerge?: GraphMergeSpec
    }
  ) => {
    const { pinId, subPinSpec, oppositeMerge } = nextPin

    if (pinId && subPinSpec) {
      if (reverse) {
        if (source.getPinPlugCount(type, pinId) > 1) {
          source.coverPin(type, pinId, '0', false)
        } else {
          source.coverPinSet(type, pinId, false)
        }

        for (const graphMergeId in graphMerges) {
          const merge = graphMerges[graphMergeId]

          const graphMerge = merge[graphId]

          if (graphMerge?.output?.[SELF]) {
            return
          }

          for (const graphPinType in graphMerge) {
            const graphMergeTypePins = graphMerge[graphPinType]

            for (const graphPinId in graphMergeTypePins) {
              const pinSpec = pinSpecs[graphPinType][graphPinId]

              const { plug } = pinSpec

              for (const subPinId in plug) {
                const subPinSpec = plug[subPinId]

                if (subPinSpec.mergeId) {
                  const newMergeId =
                    nextIdMap.merge[subPinSpec.mergeId] || subPinSpec.mergeId

                  const mergeClone = clone(merge)

                  delete mergeClone[graphId]

                  const otherUnitId = getObjSingleKey(mergeClone)
                  const otherUnitPinType = getObjSingleKey(
                    mergeClone[otherUnitId]
                  ) as IO
                  const otherUnitPinId = getObjSingleKey(
                    mergeClone[otherUnitId][otherUnitPinType]
                  )

                  if (target.hasMerge(newMergeId)) {
                    forEachPinOnMerge(mergeClone, (unitId, type, pinId) => {
                      target.addPinToMerge(
                        newMergeId,
                        unitId,
                        type,
                        pinId,
                        false
                      )
                    })
                  } else {
                    const newMergeSpec = {
                      [otherUnitId]: {
                        [otherUnitPinType]: { [otherUnitPinId]: true },
                      },
                    }

                    target.addMerge(newMergeSpec, newMergeId, false, false)
                  }
                } else if (subPinSpec.unitId && subPinSpec.pinId) {
                  const newUnitId =
                    nextIdMap.unit[subPinSpec.unitId] || subPinSpec.unitId

                  if (target.hasMerge(graphMergeId)) {
                    target.addPinToMerge(
                      graphMergeId,
                      newUnitId,
                      graphPinType as IO,
                      subPinSpec.pinId,
                      false
                    )
                  } else {
                    if (oppositeMerge) {
                      const mergeClone = clone(oppositeMerge)

                      delete mergeClone[subPinSpec.unitId]

                      const otherUnitId = getObjSingleKey(mergeClone)

                      if (!otherUnitId) {
                        return
                      }

                      const otherUnitPinType = getObjSingleKey(
                        mergeClone[otherUnitId]
                      )
                      const otherUnitPinId = getObjSingleKey(
                        mergeClone[otherUnitId][otherUnitPinType]
                      )

                      target.addMerge(
                        {
                          [newUnitId]: {
                            [graphPinType]: { [subPinSpec.pinId]: true },
                          },
                          [otherUnitId]: {
                            [otherUnitPinType]: { [otherUnitPinId]: true },
                          },
                        },
                        mergeId,
                        false,
                        false,
                        undefined
                      )
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (target.hasPinNamed(type, pinId)) {
          if (subPinSpec.mergeId) {
            if (target.hasMerge(subPinSpec.mergeId)) {
              target.exposePin(type, pinId, '0', subPinSpec, false)
            } else {
              target.exposePin(type, pinId, '0', {}, false)
            }
          } else {
            if (target.hasUnit(subPinSpec.unitId)) {
              target.exposePin(type, pinId, '0', subPinSpec, false)
            } else {
              target.exposePin(type, pinId, '0', {}, false)
            }
          }
        } else {
          target.exposePinSet(
            type,
            pinId,
            {
              plug: {
                '0': subPinSpec,
              },
            },
            false
          )
        }
      }
    }
  }

  nextInput && processMergePin('input', nextInput)
  nextOutput && processMergePin('output', nextOutput)

  forIO(pinSpecs, (type, pinsSpec) => {
    forEachObjKV(pinsSpec, (pinId, pinSpec) => {
      const { plug } = pinSpec

      for (const subPinId in plug) {
        const subPin = plug[subPinId]

        if (subPin.mergeId === mergeId) {
          const isInput = type === 'input'

          const { mergeId: nextMergeId } =
            (isInput ? nextOutput : nextInput) ?? {}

          if (target.hasPlug(type, pinId, subPinId)) {
            if (reverse) {
              target.unplugPin(type, pinId, subPinId, false, false)
            } else {
              target.plugPin(
                type,
                pinId,
                subPinId,
                { mergeId: nextMergeId },
                false,
                false
              )
            }
          }
        }
      }
    })
  })
}

export function movePlugInto(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  type: IO,
  pinId: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec,
  nextPlugSpec: _IOOf<Dict<Dict<GraphSubPinSpec>>>,
  nextPinIdMap: _IOOf<Dict<{ pinId: string; subPinId: string }>>,
  nextMergePinId: _IOOf<{ mergeId: string }>,
  nextIdMap: {
    merge: Dict<string>
    link: Dict<_IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
    plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
    unit: Dict<string>
  },
  plugs
) {
  const plugCount = source.getPinPlugCount(type, pinId)

  if (plugCount === 1) {
    source.coverPinSet(type, pinId, false)
  } else {
    source.coverPin(type, pinId, subPinId, false)
  }

  const oppositeType = opposite(type)

  const nextPinId = pathOrDefault(
    nextPlugSpec,
    [type, pinId, subPinId, 'pinId'],
    pinId
  )

  const plug = pathGet(plugs, [type, pinId, subPinId])

  const finalType = pathOrDefault(
    nextIdMap,
    ['plug', type, pinId, subPinId, 'type'],
    type
  )

  const nextSubPinSpec = pathOrDefault(
    nextPlugSpec,
    [type, pinId, subPinId],
    {}
  )

  if (target.hasPinNamed(finalType, pinId)) {
    target.exposePin(finalType, pinId, subPinId, nextSubPinSpec, false)
  } else {
    target.exposePinSet(
      finalType,
      pinId,
      {
        plug: {
          [subPinId]: nextSubPinSpec,
        },
      },
      false
    )

    if (plug.active()) {
      // TODO sub pin
      // graph.setPlugData(finalType, pinId, subPinId, plug.peak(), false)
      target.setPinData(finalType, pinId, plug.peak())
    }
  }

  if (subPinSpec.unitId && subPinSpec.pinId) {
    let nextMergeId = pathOrDefault(
      nextIdMap,
      ['link', subPinSpec.unitId, subPinSpec.type, pinId, 'mergeId'],
      null
    )

    if (nextMergeId) {
      source.addPinToMerge(
        nextMergeId,
        graphId,
        finalType,
        nextPinId,
        false,
        false
      )
    } else {
      nextMergeId = pathOrDefault(
        nextIdMap,
        ['plug', type, pinId, subPinId, 'mergeId'],
        null
      )

      if (nextMergeId) {
        source.addMerge(
          {
            [graphId]: {
              [finalType]: {
                [nextPinId]: true,
              },
            },
            [subPinSpec.unitId]: {
              [type]: {
                [subPinSpec.pinId]: true,
              },
            },
          },
          nextMergeId,
          false,
          false,
          undefined
        )
      }
    }
  } else if (subPinSpec.mergeId) {
    const nextMergeId = pathOrDefault(
      nextMergePinId,
      ['merge', subPinSpec.mergeId, type],
      null
    )

    if (nextMergeId) {
      source.addPinToMerge(
        nextMergeId,
        graphId,
        finalType,
        nextPinId,
        false,
        false
      )
    } else {
      const nextMergeId = pathOrDefault(
        nextIdMap,
        ['plug', type, pinId, subPinId, 'mergeId'],
        null
      )

      if (nextMergeId) {
        source.addPinToMerge(
          nextMergeId,
          graphId,
          finalType,
          nextPinId,
          false,
          false
        )
      }
    }
  }
}

export type GraphLike<T extends UCG = UCG> = Pick<
  T,
  | 'getMergeSpec'
  | 'getMergesSpec'
  | 'coverPinSet'
  | 'hasPinNamed'
  | 'hasMergePin'
  | 'getUnit'
  | 'exposePinSet'
  | 'getUnitPinData'
  | 'hasUnit'
  | 'addUnit'
  | 'removeUnit'
  | 'removeMerge'
  | 'moveRoot'
  | 'unplugPin'
  | 'plugPin'
  | 'exposePin'
  | 'setPinData'
  | 'addPinToMerge'
  | 'getPinPlugCount'
  | 'getPinData'
  | 'setPinConstant'
  | 'setUnitPinConstant'
  | 'hasPlug'
  | 'coverPin'
  | 'isUnitPinRef'
  | 'addMerge'
  | 'hasMerge'
  | 'getExposedPinSpec'
  | 'getExposedPinSpecs'
  | 'removePinOrMerge'
  | 'removePinFromMerge'
  | 'isPinConstant'
>

export function moveSubgraph<T extends UCG<any, any, any>>(
  source: GraphLike<T>,
  target: GraphLike<T>,
  graphId: string,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphConnectUnitOpt,
  _pinSpecs: _IOOf<GraphPinsSpec>,
  plugs: IOOf<Dict<Dict<Pin>>>,
  reverse: boolean = true
) {
  const {
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
  } = collapseMap

  const { merge, link, unit, plug } = nodeIds

  if (source.getMergesSpec() === undefined) {
    throw new Error()
  }

  const mergeSpecs = clone(source.getMergesSpec())

  if (!mergeSpecs) {
    throw new Error()
  }

  const pinSpecs = clone(source.getExposedPinSpecs())

  const ignoredUnitPin: Dict<{ input: Set<string>; output: Set<string> }> = {}
  const ignoredUnit = new Set<string>(unit)
  const ignoredMerge = new Set<string>(merge)

  const setUnitPinIgnored = (unitId: string, type: IO, pinId: string) => {
    // console.log('setUnitPinIgnored', unitId, type, pinId)

    ignoredUnitPin[unitId] = ignoredUnitPin[unitId] || {
      input: new Set(),
      output: new Set(),
    }

    ignoredUnitPin[unitId][type].add(pinId)
  }

  const findUnitPinPlug = (
    unitId: string,
    type: IO,
    pinId: string
  ): GraphPlugOuterSpec => {
    let plugSpec: GraphPlugOuterSpec | undefined

    forEachObjKV(pinSpecs[type], (_pinId, _pinSpec: GraphPinSpec) => {
      const { plug } = _pinSpec

      for (const subPinId in plug) {
        const subPin = plug[subPinId]

        if (subPin.unitId === unitId && subPin.pinId === pinId) {
          plugSpec = {
            type,
            pinId: _pinId,
            subPinId,
          }
        }
      }
    })

    return plugSpec
  }

  for (const { unitId, type, pinId } of link) {
    const pinPlug = findUnitPinPlug(unitId, type, pinId)

    if (
      pinPlug &&
      !plug.find((plugObj) => {
        return (
          plugObj.type === pinPlug.type &&
          plugObj.pinId === pinPlug.pinId &&
          plugObj.subPinId === pinPlug.subPinId
        )
      })
    ) {
      continue
    }

    setUnitPinIgnored(unitId, type, pinId)
  }

  const nextMergeSpecs: GraphMergesSpec = {}

  for (const mergeId of merge) {
    if (source.hasMerge(mergeId)) {
      const mergeSpec = source.getMergeSpec(mergeId)

      nextMergeSpecs[mergeId] = mergeSpec

      forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
        setUnitPinIgnored(unitId, type, pinId)
      })
    }
  }

  for (const { unitId, type, pinId } of link) {
    const { mergeId, oppositePinId } = nextIdMap.link[unitId][type][pinId]

    const plugPinSpec: { pinId: string; subPinId: string } | null = null

    moveLinkPinInto(
      source,
      target,
      graphId,
      unitId,
      type,
      pinId,
      collapseMap,
      mergeId,
      oppositePinId,
      plugPinSpec,
      ignoredUnit,
      reverse
    )
  }

  for (const unitId of unit) {
    moveUnit(
      source,
      target,
      graphId,
      unitId,
      collapseMap,
      connectOpt,
      ignoredUnit,
      ignoredUnitPin,
      ignoredMerge,
      pinSpecs,
      reverse
    )
  }

  for (const mergeId of merge) {
    if (!mergeSpecs) {
      throw new Error()
    }

    const mergeSpec = mergeSpecs[mergeId]

    moveMerge(
      source,
      target,
      graphId,
      mergeId,
      mergeSpec,
      collapseMap,
      connectOpt,
      ignoredUnit,
      pinSpecs,
      reverse
    )
  }

  for (const { type, pinId, subPinId } of plug) {
    const subPinSpec = pathGet(pinSpecs, [type, pinId, 'plug', subPinId])

    movePlugInto(
      source,
      target,
      graphId,
      type,
      pinId,
      subPinId,
      subPinSpec,
      nextPlugSpec,
      nextPinIdMap,
      nextMergePinId,
      nextIdMap,
      plugs
    )
  }
}
