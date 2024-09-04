import { initJsonGraph } from "./jsonSpecGraph.js";

const jsonGraphNode = initJsonGraph(initJsonGraph());

const jsonInput = document.querySelector("#jsonInput");

jsonInput.addEventListener("input", (event) => {
    const input = event.target.value;
    console.log(input);


});