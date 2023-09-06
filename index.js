
const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)

const margin =
  {
    top: 90,
    right: 60,
    bottom: 20,
    left: 60
  };

const graphWidth = window.innerWidth - margin.left - margin.right;
const graphHeight = window.innerHeight - margin.top - margin.bottom;

const mainCanvas = svg.append('g')
                .attr('height', graphHeight /2)
                .attr('width', graphWidth / 2)
                .attr('transform',`translate(${margin.left},${margin.top })`);

function getCSVData() {
  d3.csv('/data.csv', function(d){
    return d;
  }).then(drawChart);

}          

function getchart(data) {
  let classOfCat = d3.group(data, d => d.IncomeGroup)
  classOfCat.get(d => d.Entity, d => d.expectancy)
  let newClassify = Object.fromEntries(classOfCat)
  const categoriesArray = Object.values(newClassify)
  let quantiledArray =[]
  let sum = 0
  for(let cat of categoriesArray){
    let arrayOfValues = cat.map(d => parseFloat(d.expectancy))
    let node = {}
    node.q1 = d3.quantile(arrayOfValues, 0.25)
    node.q3 = d3.quantile(arrayOfValues, 0.75)
    node.median = d3.quantile(arrayOfValues, 0.50)
    node.max = d3.max(arrayOfValues)
    node.min = d3.min(arrayOfValues)
    arrayOfValues.forEach((d) => sum += parseFloat(d))
    node.avg = sum / arrayOfValues.length
    node.cat = cat[0].IncomeGroup
    quantiledArray.push(node)
  }
  return quantiledArray
}
getCSVData();


function drawChart(data){
  //data

  let array_num = [...new Set(data.map(d => parseFloat(d.expectancy)))]
  
  let max = d3.max(array_num)
  let min = d3.min(array_num)

  const nodes = getchart(data)
  console.log(nodes)

  //ToolTip
  var tooltip = d3.select("body")
  .append("div")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
  

  //scaleLinner
 const x_scaleLinear = d3.scaleLinear()
       .domain([min, max])
       .range([0, graphWidth]);

  const barsGraph = mainCanvas.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      console.log(barsGraph)

  //base rect
  const rect = barsGraph
    .append('rect')
    .attr('y', (d, i) =>  (graphHeight*(i)/nodes.length))
    .attr('x', 0)  
    .attr('height', (graphHeight/4) / nodes.length )
    .attr('width', x_scaleLinear(max) )
    .attr('rx',20)
    .attr('ry',20)
    .attr('stroke', 'gray')
    .attr('fill' , 'lightgray') 
    

  //lines

  //q1
  var q1line = barsGraph
   .append('line') 
   .attr('x1', (d) => x_scaleLinear(d.q1))
   .attr('x2', (d) => x_scaleLinear(d.q1))
   .attr('y1', (d, i) =>  (graphHeight*(i)/nodes.length))
   .attr('y2', (d, i) =>  (graphHeight*(i)/nodes.length) + (graphHeight/4) / nodes.length )
   .attr('stroke', 'black')
  
  //q3
    
  var q3line = barsGraph
   
   .append('line') 
   .attr('x1', (d) => x_scaleLinear(d.q3))
   .attr('x2', (d) => x_scaleLinear(d.q3))
   .attr('y1', (d, i) =>  (graphHeight*(i)/nodes.length))
   .attr('y2', (d, i) =>  (graphHeight*(i)/nodes.length) + (graphHeight/4) / nodes.length )
   .attr('stroke', 'black')
    
  //median
    
  var medianline = barsGraph
   .append('line') 
   .attr('x1', (d) => x_scaleLinear(d.median))
   .attr('x2', (d) => x_scaleLinear(d.median))
   .attr('y1', (d, i) =>  (graphHeight*(i)/nodes.length))
   .attr('y2', (d, i) =>  (graphHeight*(i)/nodes.length) + (graphHeight/4) / nodes.length )
   .attr('stroke', 'red')
    


  //rect of q1, q3, median

  //q1 and median
    
  var q1rect = barsGraph
    .append('rect')
    .attr('y', (d, i) =>  (graphHeight*(i)/nodes.length))
    .attr('x', (d) => x_scaleLinear(d.median))  
    .attr('height', (graphHeight/4) / nodes.length )
    .attr('width', (d) => x_scaleLinear(d.q3)-x_scaleLinear(d.median))
    .attr('stroke', 'gray')
    .attr('fill' , 'red') 

  

  //median and q3
  
  var q2rect = barsGraph
    .append('rect')
    .attr('y', (d, i) =>  (graphHeight*(i)/nodes.length))
    .attr('x', (d) => x_scaleLinear(d.q1))  
    .attr('height', (graphHeight/4) / nodes.length )
    .attr('width', (d) => x_scaleLinear(d.median)-x_scaleLinear(d.q1))
    .attr('stroke', 'gray')
    .attr('fill' , 'purple') 

  

  //texts
   
  //category type
  var typeOfCat = barsGraph
    .append('text') 
    .html(d => d.cat)
    .attr('text-anchor','middle')
    .attr('fill','gray')
    .attr('font-size','2vw')
    .attr('x',x_scaleLinear(max)/2)
    .attr('y',(d, i) => graphHeight*(i)/nodes.length - ((graphHeight/4) / nodes.length)/2)

    barsGraph
    .on("mouseover", function(event){
      console.log(event)
      d3.select(this)
         .transition()
         .duration(100)
         .style('opacity', '0.7')
      tooltip.html( d => {return '<p>First Quarter: ' + '<span style="color:orange"></span>' + event.target.__data__.q1 + '</p>' + 
      '<p>  Secend Quarter: ' + '<span style="color:orangered"></span>' + event.target.__data__.q3 + '</p>' + 
      '<p> Avrage: '+event.target.__data__.avg+'</p>' +
      '<p> Median: '+event.target.__data__.median+'</p>' +
      '<p> Max: '+event.target.__data__.max+'</p>' +
      '<p> Min: '+event.target.__data__.min+'</p>' 

    })
      tooltip.style("visibility", "visible")
      tooltip.style('opacity', '0.9')
     
      tooltip.style('color', 'darkblue')
      tooltip.attr('class', 'tooltip')

    })
    .on("mouseout", function(event){
      d3.select(this)
      .transition()
      .duration(100)
      .style('opacity', '1')
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", function(event){ tooltip.style("top", (event.pageY + 10)+"px").style("left",(event.pageX+25)+"px");})

}