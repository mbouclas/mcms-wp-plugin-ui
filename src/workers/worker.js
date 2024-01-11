let sharedResult = 0;

onconnect = (e) => {
    const port = e.ports[0];

    port.onmessage = (event) => {
        const data = event.data;
        const result = performComputation(data);
        port.postMessage(result);
    };
};

function performComputation(data) {
    // Your heavy computation logic goes here
    // This function runs in the shared worker
    return data * 2;
}
