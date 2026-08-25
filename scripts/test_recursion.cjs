// Trace call loop
let callCount = 0;
function onStateSelect(id) {
  handleStateSelection(id);
}
function handleStateSelection(id) {
  callCount++;
  if (callCount > 10) {
    console.error("INFINITE RECURSION DETECTED! Call count exceeded 10");
    return;
  }
  selectState(id);
}
function selectState(id) {
  onStateSelect(id);
}

handleStateSelection("INTN");
