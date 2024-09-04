/**
 * Directed Graph Node Definition
 */
class Node {
    charSet; // set of strings
    neighbors; // list of neighbor nodes
    isExitNode; // is node possible exit point of graph

    /**
     * 
     * @param {*} charSet 
     * @param {*} isExitNode 
     */
    constructor(charSet, isExitNode) {
        if (!Set.prototype.isPrototypeOf(charSet)) throw "charSet must be of type Set";
        if (typeof isExitNode == "boolean") throw "isExitNode must be of type of Boolean";
        this.charSet = charSet;
        this.neighbors = [];
        this.isExitNode = isExitNode;
    }
}

/**
 * A json graph is constructed according the the spec provided in https://www.json.org/json-en.html
 * 
 * @returns constructed json graph
 */
export function initJsonGraph() {
    return initObjectGraph();
}

/**
 * 
 * @returns 
 */
function initObjectGraph() {
    const openingCurlyNode = new Node(new Set(["{"]), false);
    const whiteSpaceNode = new Node(new Set([" "]), false);
    const closingCurlyNode = new Node(new Set(["}"]), true);
    const commaNodeNode = new Node(new Set([","]), false);
    const secondWhiteSpaceNode = new Node(new Set([" "]), false);
    const stringNode = initStringGraph();
    const thirdWhiteSpaceNode = new Node(new Set([" "]), false);
    const colonNode = new Node(new Set([":"]), false);
    const valueNode = initValueGraph();

    openingCurlyNode.neighbors.push(whiteSpaceNode);
    openingCurlyNode.neighbors.push(secondWhiteSpaceNode);

    whiteSpaceNode.neighbors.push(closingCurlyNode);

    secondWhiteSpaceNode.neighbors.push(stringNode);

    stringNode.neighbors.push(thirdWhiteSpaceNode);

    thirdWhiteSpaceNode.neighbors.push(colonNode);

    colonNode.neighbors.push(valueNode);

    valueNode.neighbors.push(closingCurlyNode);
    valueNode.neighbors.push(commaNode);

    commaNode.neighbors.push(secondWhiteSpaceNode);

    return openingCurlyNode;
}

/**
 * 
 * @returns 
 */
function initArrayGraph() {
    const openingSquareBracketNode = new Node(new Set(["["]), false);
    const whiteSpaceNode = initWhiteSpaceGraph();
    const valueNode = initValueGraph();
    const commaNode = new Node(new Set([","]), false);
    const closingSquareBracketNode = new Node(new Set(["]"]), true);

    openingSquareBracketNode.neighbors.push(whiteSpaceNode);
    openingSquareBracketNode.neighbors.push(valueNode);

    whiteSpaceNode.neighbors.push(closingSquareBracketNode);

    valueNode.neighbors.push(commaNode);
    valueNode.neighbors.push(closingSquareBracketNode);

    commaNode.neighbors.push(valueNode);

    return openingSquareBracketNode;
}

/**
 * 
 * @returns 
 */
function initValueGraph() {
    const openingwhiteSpaceNode = initWhiteSpaceGraph();
    const stringNode = initStringGraph();
    const [zeroNode, minusNode] = initNumberGraph();    
    // const objectNode
    const arrayNode = initArrayGraph();
    const trueFalseNullNode = new Node(new Set(["true", "false", "null"]), false);
    const closingWhiteSpaceNode = initWhiteSpaceGraph();
    closingWhiteSpaceNode.isExitNode = true;

    whiteSpaceNode.neighbors.push(stringNode);
    whiteSpaceNode.neighbors.push(zeroNode);
    whiteSpaceNode.neighbors.push(minusNode);
    whiteSpaceNode.neighbors.push(arrayNode);
    whiteSpaceNode.neighbors.push(trueFalseNullNode);

    stringNode.neighbors.push(closingWhiteSpaceNode);

    zeroNode.neighbors.push(closingWhiteSpaceNode);
    minusNode.neighbors.push(closingWhiteSpaceNode);

    arrayNode.neighbors.push(closingWhiteSpaceNode)

    trueFalseNullNode.neighbors.push(closingWhiteSpaceNode);

    return whiteSpaceNode;
}

/**
 * 
 * @param {*} codepoint 
 * @returns 
 */
function isValidCodepoint(codepoint) {
    return !(
        (codepoint >= 0x00 && codepoint <= 0x1F) || // Control characters U+0000 to U+001F
        codepoint === 0x7F ||                      // Control character U+007F
        codepoint === 0x22 ||                      // Double quote (")
        codepoint === 0x5C                         // Backslash (\)
    );
}

/**
 * 
 * @returns 
 */
function getValidCodepoints() {
    const validCodepoints = [];
    const maxCodepoint = 0x10FFFF;  // Maximum Unicode codepoint

    for (let i = 0; i <= maxCodepoint; i++) {
        if (isValidCodepoint(i)) {
            validCodepoints.push(i);
        }
    }

    return validCodepoints;
}

/**
 * 
 * @returns 
 */
function initStringGraph() {
    const openingDoubleQuoteNode = new Node(new Set(["\""]), false);
    const validCodePointList = getValidCodepoints();
    const validCodePointsNode = new Node(new Set(validCodePointList), false);
    const nonSenseNodes = new Node(new Set(["\"", "\\", "\/", "\b", "\f", "\n", "\r", "\t"]), false);
    const closingDoubleQuote = new Node(new Set(["\""]), true);

    openingDoubleQuoteNode.neighbors.push(validCodePointsNode);
    openingDoubleQuoteNode.neighbors.push(nonSenseNodes);

    validCodePointsNode.neighbors.push(closingDoubleQuote);
    validCodePointsNode.neighbors.push(validCodePointsNode);
    validCodePointsNode.neighbors.push(nonSenseNodes);

    nonSenseNodes.neighbors.push(closingDoubleQuote);
    nonSenseNodes.neighbors.push(nonSenseNodes);
    nonSenseNodes.neighbors.push(validCodePointsNode);

    return openingDoubleQuoteNode;
}

/**
 * 
 * @returns constructed json spec whitespace graph according to https://www.json.org/json-en.html
 */
function initWhiteSpaceGraph() {
    const whiteSpaceNode = new Node(new Set([" ", "\n", "\r", "\t"]), true);
    whiteSpaceNode.neighbors.push(whiteSpaceNode);
    return whiteSpaceNode;
}

/**
 * 
 * @returns constructed json spec number graph according to https://www.json.org/json-en.html
 */
function initNumberGraph() {
    const minusNode = new Node(new Set(["-"]), false);
    const zeroNode = new Node(new Set(["0"]), true);

    const digitNode = new Node(new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]), true);
    const secondDigitNode = new Node(new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]), true);
    const dotNode = new Node(new Set(["."]), false);
    const thirdDigitNode = new Node(new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]), true);
    const ENode = new Node(new Set(["E"]), false);
    const eNode = new Node(new Set(["e"]), false);
    const secondMinusNode = new Node(new Set(["-"]), false);
    const plusNode = new Node(new Set(["+"]), false);
    const fourthDigitNode = new Node(new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]), true);

    minusNode.neighbors.push(zeroNode);
    minusNode.neighbors.push(digitNode);

    zeroNode.neighbors.push(dotNode);
    zeroNode.neighbors.push(ENode);
    zeroNode.neighbors.push(eNode);

    digitNode.neighbors.push(secondDigitNode);
    digitNode.neighbors.push(dotNode);
    digitNode.neighbors.push(ENode);
    digitNode.neighbors.push(eNode);

    secondDigitNode.neighbors.push(secondDigitNode);
    secondDigitNode.neighbors.push(dotNode);
    secondDigitNode.neighbors.push(ENode);
    secondDigitNode.neighbors.push(eNode);

    dotNode.neighbors.push(thirdDigitNode);

    thirdDigitNode.neighbors.push(thirdDigitNode);
    thirdDigitNode.neighbors.push(ENode);
    thirdDigitNode.neighbors.push(eNode);

    ENode.neighbors.push(minusNode);
    ENode.neighbors.push(plusNode);
    ENode.neighbors.push(fourthDigitNode);

    eNode.neighbors.push(minusNode);
    eNode.neighbors.push(plusNode);
    eNode.neighbors.push(fourthDigitNode);

    fourthDigitNode.neighbors.push(fourthDigitNode);

    return [minusNode, zeroNode];
}