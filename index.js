
const canvas = d3.select('.canva')
const svg = canvas.append('svg')
                  .attr('width', window.innerWidth)
                  .attr('height', window.innerHeight)

const margin =
  {
    top: 20,
    right: 20,
    bottom: 70,
    left: 70
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

getCSVData();


function drawChart(data){
  //data
  let avrage = 0
  let sum = 0
  let array_num = [...new Set(data.map(d => d.expectancy))]

  for(let key of array_num){
    sum += new Number(key)
  }
  avrage = sum / array_num.length
  
  let q1 = d3.quantile(array_num.sort(d3.ascending),0.25)
  let median = d3.quantile(array_num.sort(d3.ascending),0.5)
  let q3 = d3.quantile(array_num.sort(d3.ascending),0.75)

  console.log(median, q1, q3, avrage)
  //color set
  //complite rect 
  //median
  //q1
  //q3
  //legend for avg
  //lines
}