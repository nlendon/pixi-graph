(function() {
    let container;

    const createForceGraph = (data) => {
        // Get the data for the force graph
        const links = data.links.map((d) => Object.assign({}, d));
        const nodes = data.nodes.map((d) => Object.assign({}, d));

        // Get the width and height of container
        const containerRect = container.getBoundingClientRect();
        const height = containerRect.height;
        const width = containerRect.width;

        // Utilities function to handle color/icon/class settings
        const color = () => { return "#f0f8ff"; };
        const icon = (d) => {
            return d.gender === "male" ? "\uf222" : "\uf221";
        }
        const getClass = (d) => {
            return d.gender === "male" ? "male" : "female";
        };

        // Utility to handle drag in the graph
        const drag = (simulation) => {
            const dragstarted = (d) => {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            };

            const dragged = (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            };

            const dragended = (d) => {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            };

            return d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        };

        // Create the force simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        // Create the SVG surface
        const svg = d3
            .select(container)
            .append("svg")
            .attr("id", "graphSvg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform);
            }));

        // Create all the node links
        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        // Create all the graph nodes
        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 12)
            .attr("fill", color)
            .call(drag(simulation));

        // Create labels for the nodes
        const label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr("class", d => `fa ${getClass(d)}`)
            .text(d => {return icon(d);})
            .call(drag(simulation));

        // Updates the simulation elements positions
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => { return d.x; })
                .attr("y", d => { return d.y; })
        });
    };

    const loaded = () => {
        container = document.getElementById('force-graph-container');
        fetch('data.json').then((res) => {
            return res.json();
        }).then((data) => {
           createForceGraph(data);
        });
    };

    document.addEventListener('DOMContentLoaded', loaded);
})();
