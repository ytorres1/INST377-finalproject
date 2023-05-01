//This will create an asynchronous request to the API

const apiUrl = "https://data.montgomerycountymd.gov/resource/e54u-qx42.json"

async function asyncRequest(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function main() {
  const url = apiUrl
  try {
    const response = await asyncRequest(url);
    console.log(response);
  } catch (error) {
    console.log("error has occured")
  }
}


//THIS IS JS FOR MAKING BARCHART
async function makeBarChart() {
  const apiData = await asyncRequest(apiUrl)

  const labels = apiData.map(obj => obj.animaltype);
  const data = apiData.map(obj => obj.frequency);

  const extraValues = document.getElementById('barChart').getContext('2d');

  new Chart(extraValues, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Bar Chart',
        data: data,
        backgroundColor: 'rgba(0, 123, 255, 0.5)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


//THIS IS JS FOR FILTERING DATA

function makeDropdown(data) {
  const dropdown = document.getElementById('filterDropdown');
  const uniqueOptions = [...new Set(data.map(item => item.animaltype))];

  uniqueOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    dropdown.appendChild(optionElement);
  });
}

function makeDataList(data) {
  const dataList = document.getElementById('dataList');
  dataList.innerHTML = '';

  data.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.petname;
    dataList.appendChild(listItem);
  });
}

async function filterData() {
  const selectedOption = document.getElementById('filterDropdown').value;
  const data = await fetchData();

  if (selectedOption === 'Dog') {
    makeDataList(data);
  } else {
    const filteredData = data.filter(item => item.animalType === selectedOption);
    makeDataList(filteredData);
  }
}

document.getElementById('filterDropdown').addEventListener('change', filterData);

asyncRequest(apiUrl)
  .then(data => {
    makeDropdown(data);
    makeDataList(data);
  });

//THIS IS JS FOR PICTURES
let slidePosition = 0;
const slides = document.querySelectorAll('.carousel_item');
const slidesArray = Array.from(slides);
const totalSlides = slidesArray.length;

function updateSlidePosition() {
  slidesArray.forEach((slide) => {
    slide.classList.remove('visible');
    slide.classList.add('hidden');
  });
  slides[slidePosition].classList.add("visible");
};

function moveToNextSlide() {
 if(slidePosition === totalSlides - 1){
    slidePosition = 0;
 } else {
    slidePosition += 1;
 }
  updateSlidePosition(); // this is how you call a function within a function
}

function moveToPrevSlide() {
 if(slidePosition === 0){
  slidePosition = totalSlides - 1;
 } else {
  slidePosition -= 1;
 }
  updateSlidePosition();
}

document.querySelector('.next') 
  .addEventListener('click', () => { 
    console.log('clicked next'); 
    moveToNextSlide(); 
  });

  document.querySelector('.prev') 
  .addEventListener('click', () => { 
    console.log('clicked prev'); 
    moveToPrevSlide(); 
  });

main()
makeBarChart();