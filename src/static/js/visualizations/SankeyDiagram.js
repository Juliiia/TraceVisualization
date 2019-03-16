const d3 = require('d3');
const d3_sankey = require('d3-sankey');

class SankeyDiagram {

    constructor() {
        this.entityAndRelationTypeManager = new EntityAndRelationTypeManager();
        this.parentElement = $('#sankeyDiagram');
    }

    visualizeSankeyDiagram(arrayWithJsons) {
        console.log('visualizeSankeyDiagram');
        console.log(arrayWithJsons);

        UiElementLib.removeChildElementIfExists(this.parentElement, '.loader');

        this.createDiagram(arrayWithJsons);
        return;
    }

    createDiagram(array) {

        let artifactName = array.artifactName;
        let entities = array.baseInfo.entities;
        let sankeyData = array.viewInfo;

        let width = sankeyData['links'].length * 2;
        let height = sankeyData['links'].length * 5;
        console.log(height);
        let opacity = 0.4;

        let that = this;

        // create parent svg and title
        let childDiv = document.createElement('div');
        childDiv.setAttribute('id', 'svgDiv' + artifactName);
        childDiv.setAttribute('class', 'halfWidth');

        let childId = UiElementLib.getD3Id(artifactName);

        // clean old
        UiElementLib.removeChildElementIfExists(this.parentElement, '#' + childId);

        let sectionTitle = UiElementLib.getSectionTitle(artifactName + ' ' + ViewRegister.getSankeyDiagramTitle());
        let svgElement = UiElementLib.getSVGTag(childId, width, height);
        this.parentElement.append(childDiv);
        childDiv.append(sectionTitle);
        childDiv.append(svgElement);

        const svg = d3.select('#' + childId)
            .append("g")
            .attr("transform", "translate(0, 10)");

        // Calculating the best nodePadding
        const nested = d3.nest()
            .key(function (d) {
                return d.group;
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(sankeyData.nodes);

        const maxNodes = d3.max(nested, function (d) {
            return d.values;
        });

        const bestPadding = d3.min([10, (height - maxNodes) / maxNodes]);

        // create sankey object
        const sankey = d3_sankey.sankey()
            .nodeWidth(10)
            .nodePadding(bestPadding)
            .size([width, height]);

        // use the loaded data
        console.log(sankeyData);
        sankey(sankeyData);


        // add values to nodes
        sankeyData.nodes.forEach(function (d) {
            // get height for each node
            d.dx = d.x1 - d.x0;
            d.dy = d.y1 - d.y0;
            // check if the name is a number

            if (!isNaN(+d.name)) {
                d.name = +d.name;
            }
        });

        // Re-sorting nodes
        const nestedGroup = d3.nest()
            .key(function (d) {
                return d.group;
            })
            .entries(sankeyData.nodes);

        nestedGroup.forEach(function (d) {

                let y = (height - d3.sum(d.values, function (n) {
                    return n.dy + sankey.nodePadding();
                })) / 2 + sankey.nodePadding() / 2;

                d.values.sort(function (a, b) {
                    return b.dy - a.dy;
                });

                d.values.forEach(function (node) {
                    node.y0 = y;
                    y += node.dy + sankey.nodePadding();
                })
            });

        // Resorting links

        nestedGroup.forEach(function (d) {

            d.values.forEach(function (node) {

                let ly = node.y0;

                node.sourceLinks
                    .sort(function (a, b) {
                        return a.target.y0 - b.target.y0;
                    })
                    .forEach(function (link) {
                        link.y0 = ly + link.width / 2;
                        ly += link.width;
                    });

                ly = node.y0;

                node.targetLinks
                    .sort(function (a, b) {
                        return a.source.y0 - b.source.y0;
                    })
                    .forEach(function (link) {
                        link.y1 = ly + link.width / 2;
                        ly += link.width;
                    })
            })
        });

        //prepare link
        const link = svg.append("g")
            .attr("class", "links")
            .attr("fill", "none")
            .attr("stroke-opacity", opacity)
            .selectAll("path")
            .data(sankeyData.links)
            .enter().append("path")
            .attr("d", d3_sankey.sankeyLinkHorizontal())
            .style("stroke", function (d) {
                return that.entityAndRelationTypeManager.getColorOfType(d.type);
            })
            .attr("stroke-width", function (d) {
                return d.width;
            });


        //prepare node
        const node = svg.append("g")
            .attr("class", "nodes")
            .attr("font-family", "Arial, Helvetica")
            .attr("font-size", 10)
            .selectAll("g")
            .data(sankeyData.nodes)
            .enter().append("g");

        //add rectangle
        node.append("rect")
            .attr("x", function (d) {
                return d.x0;
            })
            .attr("y", function (d) {
                return d.y0;
            })
            .attr("height", function (d) {
                if(d.dy < 0){
                    d.dy = d.dy * -1;
                }
                return d.dy;
            })
            .attr("width", function (d) {
                return d.dx;
            })
            .attr("fill", function (d) {
                return '#000'
            });


        //add labels
        node.append("text")
            .attr("x", function (d) {
                return d.x0 - 6;
            })
            .attr("y", function (d) {
                return d.y0 + d.dy / 2;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return that.getNameForId(d.nodeid, entities);
            })
            .filter(function (d) {
                return d.x0 < 5;
            })
            .attr("x", function (d) {
                return d.x1 + 6;
            })
            .attr("text-anchor", "start");


        // pan-zoom
        let panZoomInstance = svgPanZoom('#' + childId, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
          });

        return;
    }

    getNameForId(id, baseEntityArray){
        for(let i=0; i < baseEntityArray.length; i++ ) {
            if(id == baseEntityArray[i]['id']){
                return baseEntityArray[i]['name'];
            }
        }
        return id;
    }

    highlightNodeAndLinks(element){
        
    }
}