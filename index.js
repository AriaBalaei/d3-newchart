
const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)

const margin =
  {
    top: 50,
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

  //scaleLinner
 const x_scaleLinear = d3.scaleLinear()
       .domain([min, max])
       .range([0, graphWidth]);
  //base rect
  const rect = mainCanvas.selectAll('rect')


   rect
    .data(nodes)
    .enter()
    .append('rect')
    .attr('y', (d, i) =>  (graphHeight*(i)/nodes.length))
    .attr('x', 0)  
    .attr('height', (graphHeight/4) / nodes.length )
    .attr('width', x_scaleLinear(max) )
    .attr('rx',20)
    .attr('ry',20)
    .attr('stroke', 'gray')
    .attr('fill' , 'lightgray')  
  
}