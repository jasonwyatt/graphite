# Graphite

Graphite is a graph library for JavaScript.

# Example

    var nodes = [
        new graphite.Node(),
        new graphite.Node(),
        new graphite.Node(),
        new graphite.Node()
    ];
    var edges = [
        new graphite.Edge(nodes[0], nodes[1]),
        new graphite.Edge(nodes[0], nodes[2]),
        new graphite.Edge(nodes[0], nodes[3]),
        new graphite.Edge(nodes[1], nodes[2]),
        new graphite.Edge(nodes[1], nodes[3]),
        new graphite.Edge(nodes[2], nodes[3])
    ];
    var graph = new graphite.Graph(nodes, edges);
    
## TODO

1. Implement shortest-path algorithm (dijkstra?)
1. Implement minimum-spanning-tree algorithm
1. Implement topological sort.

All of the above will be implemented with the ability to pass a callback to the functions which calculates edge weight.
