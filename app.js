document.addEventListener('DOMContentLoaded', function () {
  d3.csv("caffeine_data_with_pic_links.csv", d3.autoType).then(function (vendingdata) {
      const brandSelect = document.getElementById('brand-select');
      const typeSelect = document.getElementById('type-select');
      const drinkList = document.getElementById('drink-list');
      const selectedDrinksList = document.getElementById('selected-drinks');
      const totalCaffeine = document.getElementById('total-caffeine');
      const calculateButton = document.getElementById('calculate-caffeine');
      const clearButton = document.getElementById('clear-selection');
      const warningMessage = document.createElement('p');

      warningMessage.style.color = 'red';
      warningMessage.textContent = 'You exceeded the FDA daily recommendation';
      warningMessage.style.display = 'none';
      totalCaffeine.parentElement.appendChild(warningMessage);

      function updateOptions() {
          const selectedBrand = brandSelect.value;
          const selectedType = typeSelect.value;

          const availableTypes = new Set(vendingdata.filter(d => d.Brand === selectedBrand || !selectedBrand).map(d => d.Type));
          const availableBrands = new Set(vendingdata.filter(d => d.Type === selectedType || !selectedType).map(d => d.Brand));

          Array.from(typeSelect.options).forEach(option => {
              option.style.display = availableTypes.has(option.value) || option.value === '' ? 'block' : 'none';
          });

          Array.from(brandSelect.options).forEach(option => {
              option.style.display = availableBrands.has(option.value) || option.value === '' ? 'block' : 'none';
          });
      }

      function populateSelectOptions(selectElement, options, defaultOptionText) {
          selectElement.innerHTML = '';
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.text = defaultOptionText;
          selectElement.add(defaultOption);

          options.forEach(option => {
              const opt = document.createElement('option');
              opt.value = option;
              opt.text = option;
              selectElement.add(opt);
          });
      }

      const brands = [...new Set(vendingdata.map(d => d.Brand))];
      const types = [...new Set(vendingdata.map(d => d.Type))];

      populateSelectOptions(brandSelect, brands, 'All Brands');
      populateSelectOptions(typeSelect, types, 'All Types');

      let selectedDrinks = [];

      function updateDrinkList() {
          drinkList.innerHTML = '';
          const filteredData = vendingdata.filter(d => {
              return (brandSelect.value === '' || d.Brand === brandSelect.value) &&
                  (typeSelect.value === '' || d.Type === typeSelect.value);
          });

          filteredData.forEach(drink => {
              const li = document.createElement('li');
              const img = document.createElement('img');
              img.src = drink.pic_link;
              img.dataset.caffeine = drink.Caffeine;
              img.dataset.pic = drink.pic_link;
              img.dataset.brand = drink.Brand;
              img.dataset.name = drink.Name;
              img.title = drink.Name; // Tooltip with the drink name
              img.addEventListener('click', function () {
                  if (selectedDrinks.length < 5) {
                      selectedDrinks.push({
                          brand: this.dataset.brand,
                          name: this.dataset.name,
                          caffeine: Number(this.dataset.caffeine),
                          pic: this.dataset.pic
                      });
                      updateSelectedDrinks();
                  } else {
                      alert("You can only select up to 5 drinks.");
                  }
              });
              li.appendChild(img);
              drinkList.appendChild(li);
          });
      }

      function updateSelectedDrinks() {
          selectedDrinksList.innerHTML = '';
          selectedDrinks.forEach(drink => {
              const li = document.createElement('li');
              const img = document.createElement('img');
              img.src = drink.pic;
              li.appendChild(img);
              li.appendChild(document.createTextNode(`${drink.name}`));
              selectedDrinksList.appendChild(li);
          });
      }

      function clearSelection() {
          selectedDrinks = [];
          updateSelectedDrinks();
          totalCaffeine.textContent = 0;
          warningMessage.style.display = 'none';
      }

      brandSelect.addEventListener('change', () => {
          updateDrinkList();
          updateOptions();
      });

      typeSelect.addEventListener('change', () => {
          updateDrinkList();
          updateOptions();
      });

      calculateButton.addEventListener('click', function () {
          const total = selectedDrinks.reduce((sum, val) => sum + val.caffeine, 0);
          totalCaffeine.textContent = total;
          if (total > 400) {
              warningMessage.style.display = 'block';
          } else {
              warningMessage.style.display = 'none';
          }
      });

      clearButton.addEventListener('click', clearSelection);

      updateDrinkList();
      updateOptions();
  });
});
  



// // Load CSV and initialize the vending machine visualization
// d3.csv("caffeine_data_with_pic_links.csv").then(function(vendingData) {
//     populateVendingFilters(vendingData);
//     displayVendingDrinks(vendingData);
// });

// function displayVendingDrinks(vendingData) {
//     console.log("First few items:", vendingData.slice(0, 5));
//     const vendingDrinksContainer = d3.select('#vending-drinks-area');
    
//     // Clear any existing drinks
//     vendingDrinksContainer.selectAll('img').remove();
    
//     // Add drinks with animation
//     vendingDrinksContainer.selectAll('img')
//         .data(vendingData)
//         .enter()
//         .append('img')
//         .attr('src', d => d.pic_link)
//         .attr('width', 40)
//         .attr('height', 80)
//         .attr('x', (d, i) => (i % 5) * 50 + 10) // 5 columns
//         .attr('y', (d, i) => Math.floor(i / 5) * 90 + 10) // Rows
//         .style('opacity', 1)
//         .on('click', function(event, d) { selectVendingDrink(event, d); });

//     // Log the first few image URLs for debugging
//     console.log("First few image URLs:", vendingData.slice(0, 5).map(d => d.pic_link));
//     vendingDrinksContainer.append('image')
//     .attr('xlink:href', 'https://www.caffeineinformer.com/wp-content/caffeine/28-energy-drink-black-white.jpg')
//     .attr('width', 40)
//     .attr('height', 80)
//     .attr('x', 200)
//     .attr('y', 200);
// }

// // function displayVendingDrinks(vendingData) {
// //     console.log("Vending data:", vendingData);
// //     const vendingDrinksContainer = d3.select('#vending-drinks-area');
// //     // Clear any existing drinks
// //     vendingDrinksContainer.selectAll('image').remove();
// //     // Add drinks with animation
// //     vendingDrinksContainer.selectAll('image')
// //         .data(vendingData)
// //         .enter()
// //         .append('image')
// //         .attr('src', d => d.pic_link)
// //         .attr('width', 40)
// //         .attr('height', 80)
// //         .attr('x', (d, i) => (i % 5) * 50 + 10) // 5 columns
// //         .attr('y', (d, i) => Math.floor(i / 5) * 90 + 10) // Rows
// //         .style('opacity', 1)
// //         .transition()
// //         .duration(1000)
// //         .style('opacity', 1)
// //         .on('end', function(d) {
// //             d3.select(this)
// //               .transition()
// //               .delay(2000)
// //               .duration(5000)
// //               .style('transform', 'translateY(20px)')
// //               .on('end', function() {
// //                   d3.select(this).style('transform', 'translateY(0px)');
// //               });
// //         })
// //         .selection()
// //         .on('click', function(event, d) { selectVendingDrink(event, d); });
// // }

// function populateVendingFilters(vendingData) {
//     const vendingTypes = [...new Set(vendingData.map(d => d.type))];
//     const vendingBrands = [...new Set(vendingData.map(d => d.brand))];

//     const vendingTypeSelect = d3.select('#vending-filter-type');
//     vendingTypeSelect.selectAll('option')
//         .data(vendingTypes)
//         .enter()
//         .append('option')
//         .attr('value', d => d)
//         .text(d => d);

//     const vendingBrandSelect = d3.select('#vending-filter-brand');
//     vendingBrandSelect.selectAll('option')
//         .data(vendingBrands)
//         .enter()
//         .append('option')
//         .attr('value', d => d)
//         .text(d => d);

//     vendingTypeSelect.on('change', () => filterVendingDrinks(vendingData));
//     vendingBrandSelect.on('change', () => filterVendingDrinks(vendingData));
// }

// function filterVendingDrinks(vendingData) {
//     const selectedVendingType = d3.select('#vending-filter-type').property('value');
//     const selectedVendingBrand = d3.select('#vending-filter-brand').property('value');

//     let filteredVendingData = vendingData;
//     if (selectedVendingType) {
//         filteredVendingData = filteredVendingData.filter(d => d.type === selectedVendingType);
//     }
//     if (selectedVendingBrand) {
//         filteredVendingData = filteredVendingData.filter(d => d.brand === selectedVendingBrand);
//     }

//     // Limit to 30 drinks for the filtered result
//     displayVendingDrinks(filteredVendingData.slice(0, 30));
// }

// let selectedVendingDrinks = [];

// function selectVendingDrink(event, d) {
//     if (selectedVendingDrinks.length < 4) {
//         selectedVendingDrinks.push(d);
//         updateSelectedVendingDrinks();
//     }
// }

// function updateSelectedVendingDrinks() {
//     const selectedVendingContainer = d3.select('.vending-selected-drinks');
//     selectedVendingContainer.selectAll('img').remove();
//     selectedVendingContainer.selectAll('img')
//         .data(selectedVendingDrinks)
//         .enter()
//         .append('img')
//         .attr('src', d => d.pic_link)
//         .attr('alt', d => d.drink_name + ' ' + d.type)
//         .attr('class', 'selected-drink');
// }

// document.getElementById('vending-checkout').addEventListener('click', calculateVendingCaffeine);
// document.getElementById('vending-clear-selection').addEventListener('click', clearVendingSelection);

// function calculateVendingCaffeine() {
//     let totalVendingCaffeine = selectedVendingDrinks.reduce((sum, drink) => sum + +drink.caffeine_mg, 0);
//     document.getElementById('vending-total-caffeine').textContent = totalVendingCaffeine;
// }

// function clearVendingSelection() {
//     selectedVendingDrinks = [];
//     updateSelectedVendingDrinks();
//     document.getElementById('vending-total-caffeine').textContent = 0;
// }


