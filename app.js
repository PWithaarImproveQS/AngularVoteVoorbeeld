
require("./server.js").startServer(true, 8080, '127.0.0.1', done);
 
function done() {
    console.log("Started");
}