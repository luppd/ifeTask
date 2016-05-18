/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
// console.log(aqiSourceData);
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}
var iniTime,iniCity;
function getTitle(){
  switch(iniTime.value){
    case "day":
      return "日平均";
    case "week":
      return "周平均";
    case "month":
      return "月平均";
  }
}
/**
 * 渲染图表
 */
function renderChart() {
  //var wrap = document.querySelector(".aqi-chart-wrap");
  var temp = document.getElementById("aqi-chart-wrap");
  var data = chartData[iniTime.value][iniCity];
  var keyArr = Object.getOwnPropertyNames(data);
  var width = temp.clientWidth;
  console.log(width);
  var aqiHTML = "<div class='title'>" +iniCity+ "市01-03月-" + getTitle() + "空气质量报告</div>" ;
  for(var i=0,len = keyArr.length; i<len; i++){
    console.log(i);
    console.log(keyArr[i]);
    console.log(data[keyArr[i]])
    
    aqiHTML += "<div class=aqi-bar style='left:"+Math.floor(width*(i)/(len))+"px; height:"+
    data[keyArr[i]]+"px ;width:"+Math.floor(width/(2*len))+"px ;background-color:blue;'></div>";
  }
  temp.innerHTML = aqiHTML;
  // console.log(document.querySelector("input[checked='checked']"));
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
  // 确定是否选项发生了变化 
  var target = event.target;
  if(target !== iniTime){
    iniTime.removeAttribute("checked");
    target.style.checked = "checked"; 
    iniTime = target;  
    renderChart(); 
  }
  // 设置对应数据

  // 调用图表渲染函数

  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
  // 确定是否选项发生了变化 
  //console.log(event.target.value)
  // 设置对应数据
  if(iniCity !== event.target.value){
    iniCity = event.target.value;
    renderChart();
  }
  // 调用图表渲染函数
  
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  iniTime = document.querySelector("input[checked='checked']");
  
  document.getElementById("form-gra-time").addEventListener("click",graTimeChange,false);
  //document.getElementById("form-gra-time").onclick = graTimeChange();
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cityArr = Object.getOwnPropertyNames(aqiSourceData);
  var cityHTML = "";
  for(var key in cityArr){
    
      cityHTML += "<option>"+cityArr[key]+"</option>";
    
  }
  document.getElementById("city-select").innerHTML = cityHTML;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  cityArr = document.getElementById("city-select").children;
  iniCity = cityArr[0].value;
  for(var i=0,len=cityArr.length;i<len; i++){
    cityArr[i].addEventListener("click",citySelectChange,false);
  }
  
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var weekSum = 0, week = {},singleWeek = {},
      monthSum = 0, month = {}, singleMonth = {};
  for(var key in aqiSourceData){
    var tempCity = aqiSourceData[key];
    var timeArr = Object.getOwnPropertyNames(tempCity);
    var tempMonth = timeArr[0].slice(5,7);
    var weekInit = 4, weekCount = 0;
    for(var i = 0,len=timeArr.length; i<len; i++,weekInit++){
      weekSum += tempCity[timeArr[i]];
      monthSum += tempCity[timeArr[i]];
      weekCount ++;
      if((weekInit+1)%7 == 0 || i == len-1 || timeArr[i+1].slice(5,7) !== tempMonth){
        var tempKey = timeArr[i].slice(0,7) + "月第" + (Math.floor(weekInit/7) + 1) + "周";
        singleWeek[tempKey] = Math.floor(weekSum/weekCount);
        if(i != (len-1) && timeArr[i+1].slice(5,7) !== tempMonth){  //next month
          weekInit = weekCount % 7;
        }

        weekCount = 0 ;
        weekSum = 0;

        if(i==len-1 || timeArr[i+1].slice(5,7) !== tempMonth){
          tempMonth = (i == len-1) ? tempMonth : timeArr[i+1].slice(5,7);
          var tempMKey = timeArr[i].slice(0,7);
          var tempDays = timeArr[i].slice(-2);
          singleMonth[tempMKey] = Math.floor(monthSum / tempDays);
          monthSum = 0;
        }
      }
    }
    week[key] = singleWeek;
    month[key] = singleMonth;
    singleWeek = {};
    singleMonth = {};
  }

  

  // 处理好的数据存到 chartData 中
  chartData.day = aqiSourceData;
  chartData.month = month;
  chartData.week = week;
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();