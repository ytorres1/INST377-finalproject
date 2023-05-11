function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.petname}</li>`;
    target.innerHTML += str;
  });
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.petname.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

function initChart(chart, object) {
  const labels = Object.keys(object);
  const info = Object.keys(object).map((item) => object[item].length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Pets By Category",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: info,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  return new Chart(chart, config);
}

function changeChart(chart, dataObject) {
  const labels = Object.keys(dataObject);
  const info = Object.keys(dataObject).map((item) => dataObject[item].length);

  chart.data.labels = labels;
  chart.data.datasets.forEach((set) => {
    set.data = info;
    return set;
  });
  chart.update();
}

function shapeDataForLineChart(array) {
  return array.reduce((collection, item) => {
    if (!collection[item.animaltype]) {
      collection[item.animaltype] = [item];
    } else {
      collection[item.animaltype].push(item);
    }
    return collection;
  }, {});
}

async function getData() {
  const url = "https://data.montgomerycountymd.gov/resource/e54u-qx42.json";
  const data = await fetch(url);
  const json = await data.json();
  const reply = json
    .filter((item) => Boolean(item.animalid))
    .filter((item) => Boolean(item.petname));
  return reply;
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");
  //const clearDataButton = document.querySelector("#data_clear");
  const chartTarget = document.querySelector("#myChart");
  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  //const carto = initMap();

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);

  const chartData = await getData();
  const shapedData = shapeDataForLineChart(chartData);
  console.log(shapedData);
  const myChart = initChart(chartTarget, shapedData);

  if (parsedData?.length > 0) {
    generateListButton.classList.remove("hidden");
  }

  let currentList = [];

  loadDataButton.addEventListener("click", async (submitEvent) => {
    console.log("Loading Data");
    loadAnimation.style.display = "inline-block";

    const results = await fetch(
      "https://data.montgomerycountymd.gov/resource/e54u-qx42.json"
    );

    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (parsedData?.length > 0) {
      generateListButton.classList.remove("hidden");
    }
    loadAnimation.style.display = "none";
    console.table(storedList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
    const localData = shapeDataForLineChart(currentList);
    changeChart(myChart, localData);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    const localData = shapeDataForLineChart(newList);
    changeChart(myChart, localData);
  });

  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
