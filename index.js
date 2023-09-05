
const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)

const margin =
  {
    top: 20,
    right: 20,
    bottom: 60,
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
  return newClassify
}
getCSVData();


function drawChart(data){
  //data
  let avrage = 0
  let sum = 0
  let array_num = [...new Set(data.map(d => d.expectancy))]
  let arryaOfMax_x = []
  let max_x = 0


  // order data base of category
  /*
  let classOfCat = d3.group(data, d => d.IncomeGroup)
  classOfCat.get(d => d.Entity, d => d.expectancy)
  let newClassify = Object.fromEntries(classOfCat)
  */
  //console.log(newClassify)

  for(let key of array_num){
    sum += new Number(key)
  }
  avrage = sum / array_num.length
  
  let q1 = d3.quantile(array_num.sort(d3.ascending),0.25)
  let median = d3.quantile(array_num.sort(d3.ascending),0.5)
  let q3 = d3.quantile(array_num.sort(d3.ascending),0.75)

  let max = d3.max(array_num)
  let min = d3.min(array_num)
 // console.log('max: ',max,'  min: ',min)
  
  //lines obj
  const lines = {
    q1 , median, q3, distance1: median - q1, distance2: q3 - median
  }




  const node = getchart(data)

  
 // console.log('median: ',median,'  q1: ', q1,'  q3: ',q3,'  avg:  ',avrage)
  //color set
  //complite rect 
  let nodes = {max , min, median, q1, q3, avrage}   
 // console.log(nodes)

  //scaleLinner
 const x_scaleLinear = d3.scaleLinear()
       .domain([min, max])
       .range([0, graphWidth]);
  //base rect
  const rect = mainCanvas.selectAll('rect')


   rect
    .data(data)
    .enter()
    .append('rect')
    .attr('y', graphHeight / 2 )
    .attr('x', 0)  
    .attr('height', graphHeight / 22 )
    .attr('width', x_scaleLinear(max) )
    .attr('rx',20)
    .attr('ry',20)
    .attr('stroke', 'gray')
    .attr('fill' , 'lightgray')  
  //line of 
  mainCanvas
      .append('line')
      .attr('x1',x_scaleLinear(lines.median))
      .attr('x2', x_scaleLinear(lines.median))
      .attr('y1', graphHeight / 2)
      .attr('y2', graphHeight / 2 + graphHeight/22 )
      .attr('stroke', 'purple')

  mainCanvas
      .append('line')
      .attr('x1',x_scaleLinear(lines.q1))
      .attr('x2', x_scaleLinear(lines.q1))
      .attr('y1', graphHeight / 2)
      .attr('y2', graphHeight / 2 + graphHeight/22 )
      .attr('stroke', 'black')

  mainCanvas
      .append('line')
      .attr('x1',x_scaleLinear(lines.q3))
      .attr('x2', x_scaleLinear(lines.q3))
      .attr('y1', graphHeight / 2)
      .attr('y2', graphHeight / 2 + graphHeight/22 )
      .attr('stroke', 'black')
  
  
  //rect of median and q3
  mainCanvas
  .append('rect')
  .attr('y', graphHeight / 2 )
  .attr('x', x_scaleLinear(lines.median))  
  .attr('height', graphHeight / 22 )
  .attr('width', (lines.q3))
  .attr('rx',5)
  .attr('ry',5)
  .attr('stroke', 'gray')
  .attr('fill' , 'lightgreen')  
  
  
  //rect of q1 and median
  mainCanvas
  .append('rect')
  .attr('y', graphHeight / 2 )
  .attr('x', x_scaleLinear(lines.q1))  
  .attr('height', graphHeight / 22 )
  .attr('width', )
  .attr('rx',5)
  .attr('ry',5)
  .attr('stroke', 'gray')
  .attr('fill' , 'lightgreen') 
/*
  //q3
  mainCanvas
  .append('rect')
  .attr('y', graphHeight / 2 )
  .attr('x', (graphWidth / 4 ) / (q1 / max)+(graphWidth / 2) * (q1 / max) -  (graphWidth / 4 ) * (q3 / max) + q3)  
  .attr('height', graphHeight / 22 )
  .attr('width', (graphWidth / 2) * (q1 / max) -  (graphWidth / 4 ) * (q3 / max))
  .attr('rx',5)
  .attr('ry',5)
  .attr('stroke', 'gray')
  .attr('fill' , 'green')  
*/

  //rect for avg
  /*
  mainCanvas
  .append('rect')
  .attr('y', graphHeight / 2 )
  .attr('x', graphWidth/ 2 - graphWidth / 8)
  .attr('height', graphHeight / 22 )
  .attr('width', (graphWidth / 2) * (q1 / max) - (graphWidth / 4 ) * (q3 / max) + ((graphWidth / 2) * (q1 / max) -  (graphWidth / 4 ) * (q3 / max))/2)
  .attr('rx',20)
  .attr('ry',20)
  .attr('stroke', 'gray')
  .attr('fill' , 'yellow')  
*/
  //legend for avg



  //lines
  

  //text
/*
  mainCanvas
    .append('text')
    .text('min ')
    .attr('x',  graphWidth / 5)
    .attr('y', graphHeight / 2 + graphHeight / 44 )

  mainCanvas.append('text')
           .text('max')
           .attr('x',  graphWidth / 4 + graphWidth / 2 + graphHeight / 44 )
           .attr('y', graphHeight / 2 + graphHeight / 44)

  mainCanvas.append('text')
           .text('First Quarter')
           .attr('x',  (graphWidth / 4 ) / (q1 / max) )
           .attr('y', graphHeight / 2 + graphHeight / 11 )  
           
  mainCanvas.append('text')
           .text('avg')
           .attr('x',  graphWidth/ 2 - graphWidth / 8 + ( graphWidth/ 2 - graphWidth / 16)/4)
           .attr('y', graphHeight / 2 + graphHeight / 44 )
  
  mainCanvas.append('text')
           .text('Secend Quarter')
           .attr('x',  graphWidth/ 2 - graphWidth / 8 + ( graphWidth/ 2 - graphWidth / 8) - ((graphWidth / 2) * (q1 / max) -  (graphWidth / 4 ) * (q3 / max))+ q3)
           .attr('y', graphHeight / 2 + graphHeight / 11 )
    */
}