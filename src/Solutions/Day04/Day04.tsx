import {Position2d} from "../Utils/Types.ts"
import DayWith from "../Utils/DayUtil.tsx"
import lodash from "lodash"

function Day04() {

    // Good grief, this is horrible!
    // The issue is that Maps use reference equality on keys, i.e. manually constructed keys will not work.
    // The 'stringify' function is a hack, and feels extremely wrong!
    type StringPosition = string

    type PuzzleInput = {
        map: Map<StringPosition, string>
    }

    function parseInput(input: string): PuzzleInput {
        const map = input.split("\n").flatMap(
            (line, y) => {
                return Array
                    .from(line)
                    .map<[StringPosition, string]>((char, x) => {
                        return [JSON.stringify({x: x, y: y}), char]
                    })
            })
        return {map: new Map(map)}
    }

    type AllDirections = {
        up: Position2d[],
        upRight: Position2d[],
        right: Position2d[],
        downRight: Position2d[],
        down: Position2d[],
        downLeft: Position2d[],
        left: Position2d[],
        upLeft: Position2d[]
    }

    function inAllDirections(position: Position2d): AllDirections {
        return {
            up: [
                {...position, y: position.y - 1},
                {...position, y: position.y - 2},
                {...position, y: position.y - 3}],
            upRight: [
                {x: position.x + 1, y: position.y - 1},
                {x: position.x + 2, y: position.y - 2},
                {x: position.x + 3, y: position.y - 3}
            ],
            right: [
                {...position, x: position.x + 1},
                {...position, x: position.x + 2},
                {...position, x: position.x + 3}
            ],
            downRight: [
                {x: position.x + 1, y: position.y + 1},
                {x: position.x + 2, y: position.y + 2},
                {x: position.x + 3, y: position.y + 3}
            ],
            down: [
                {...position, y: position.y + 1},
                {...position, y: position.y + 2},
                {...position, y: position.y + 3}
            ],
            downLeft: [
                {x: position.x - 1, y: position.y + 1},
                {x: position.x - 2, y: position.y + 2},
                {x: position.x - 3, y: position.y + 3}
            ],
            left: [
                {...position, x: position.x - 1},
                {...position, x: position.x - 2},
                {...position, x: position.x - 3}
            ],
            upLeft: [
                {x: position.x - 1, y: position.y - 1},
                {x: position.x - 2, y: position.y - 2},
                {x: position.x - 3, y: position.y - 3}
            ]
        }
    }

    function wordFromPositions(map: Map<StringPosition, string>, positions: Position2d[]): string {
        const result = positions.map((position) => {
            return map.get(JSON.stringify(position))
        }).join("")
        return result
    }

    function countFromPosition(map: Map<StringPosition, string>, position: StringPosition): number {
        const actualPosition: Position2d = JSON.parse(position)
        const allDirections = inAllDirections(actualPosition)
        const initial = map.get(position)
        if (initial === "X") {
            const words = Object.values(allDirections).map((direction) => wordFromPositions(map, direction))
            return words.filter((word) => word === "MAS").length
        } else return 0
    }

    function solvePart1(puzzleInput: PuzzleInput): bigint {
        const count = lodash.sum(Array
            .from(puzzleInput.map.keys())
            .map((position) => countFromPosition(puzzleInput.map, position))
        )

        return BigInt(count)
    }

    type Cross = {
        upLeft: Position2d,
        upRight: Position2d,
        downLeft: Position2d,
        downRight: Position2d
    }

    function crossFromPosition(position: Position2d): Cross {
        return {
            upLeft: {x: position.x - 1, y: position.y - 1},
            upRight: {x: position.x + 1, y: position.y - 1},
            downLeft: {x: position.x - 1, y: position.y + 1},
            downRight: {x: position.x + 1, y: position.y + 1}
        }
    }

    const matchingCrosses = ["MSMS", "MMSS", "SSMM", "SMSM"]

    function isMatchingPosition(map: Map<StringPosition, string>, stringPosition: StringPosition): boolean {
        function check() {
            const actualPosition: Position2d = JSON.parse(stringPosition)

            const cross = crossFromPosition(actualPosition)

            const letters = Object.values(cross).map((position) => map.get(JSON.stringify(position))).join("")
            return matchingCrosses.includes(letters)
        }

        return map.get(stringPosition) === "A" && check()
    }

    function solvePart2(puzzleInput: PuzzleInput): bigint {
        const count = Array
            .from(puzzleInput.map.keys())
            .filter((position) => isMatchingPosition(puzzleInput.map, position))
            .length
        return BigInt(count)
    }

    return DayWith(
        "04",
        parseInput,
        solvePart1,
        solvePart2
    )

}

export default Day04
