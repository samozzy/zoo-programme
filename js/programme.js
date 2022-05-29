var filterBoxElement = document.getElementById('filter-box')
var filterBoxButton = document.getElementById('filter-box-button')
var searchBoxElement = document.getElementById('search-box')
var searchBoxButton = document.getElementById('search-box-button')
filterBoxElement.addEventListener('show.bs.collapse', function (e) {
	// toggle class 'active' of #filter-box-button 
	if (e.target.id == 'filter-box'){
		filterBoxButton.classList.add('active');
	}
})
filterBoxElement.addEventListener('hide.bs.collapse', function (e) {
	if (e.target.id == 'filter-box') {
		filterBoxButton.classList.remove('active');
		filterBoxButton.blur();
	}
})

searchBoxElement.addEventListener('show.bs.collapse', function (e) {
	// toggle class 'active' of #search-box-button 
	if (e.target.id == 'search-box'){
		searchBoxButton.classList.add('active');
	}
})
searchBoxElement.addEventListener('hide.bs.collapse', function (e) {
	if (e.target.id == 'search-box') {
		searchBoxButton.classList.remove('active');
		searchBoxButton.blur();
	}
})

// Set up for filter pickers 
the_shows = document.getElementsByClassName('programme-show-container');
var no_results_text = document.getElementById('no-result-text');

// Search
search_box = document.getElementById('search-input')
search_box.addEventListener('input', (event) => {
	// Sanitise text input 
	search_term = search_box.value.toLowerCase().replace(' ', '');
	search_hint = document.getElementById('search-hint');
	// Do the search! 
	if (search_term.length > 3){
		search_hint.classList.add('d-none');
		for (i=0; i<the_shows.length; i++){
			if (!the_shows[i].dataset.search.includes(search_term)) {
				the_shows[i].classList.add('filtered-out-by-search');
			}
			else {
				the_shows[i].classList.remove('filtered-out-by-search');
			}
		}
		if (document.querySelectorAll('.filtered-out-by-search').length == the_shows.length){
			no_results_text.classList.remove('d-none');
		}
		else {
			no_results_text.classList.add('d-none');
		}

	}
	else {
		no_results_text.classList.add('d-none');
		for (i=0; i<the_shows.length; i++){
			the_shows[i].classList.remove('filtered-out-by-search');
		}
		function showHint() {
			if (search_term.length > 1 && search_term.length <= 3){ 
				search_hint.classList.remove('d-none');
			}
		}
		if (search_term.length > 1 && search_term.length <= 3){
			// Wait a moment, then run the show script 
			// The show script also runs an if to see if the value still matches
			let hintTimeout = setTimeout(showHint, 2000)
		}
		else {
			search_hint.classList.add('d-none');
		}
	}

});

//
// Date Picker //
//
var date_picker = document.getElementById('datepicker');
var filter_date_counter = document.getElementById('filter-date-counter');
function clearDatePick() {
	// Reset the datepicker
	picker.clear(); 
	// Show all the shows filtered by price (only)
	for (i=0; i< the_shows.length; i++ ){
		the_shows[i].classList.remove('filtered-out-by-date');
	}
	// Hide the 'no results' text
	no_results_text.classList.add('d-none');
	// Hide the number of results text 
	filter_date_counter.innerHTML = '';
}

picker.on('select',e => {
	console.log(date_picker.value);
	picked_value = date_picker.value 
	// Bonus: Recolour the picker to be in zoo-orange 

  if (picked_value == 0) {
		for (i=0; i< the_shows.length; i++ ) {
			if (the_shows[i].classList.contains('filtered-out-by-date')) {
				the_shows[i].classList.remove('filtered-out-by-date');
			}
		}
		filter_date_counter.innerHTML = '';
		no_results_text.classList.add('d-none')
  }
  else {
  	// Assuming something is ticked, filter the shows appropriately. 
  	// Have to account for the picker. dates being at midnight with a timezone offset 
  	const tz_offset = picker.getStartDate().getTimezoneOffset() * 60 * 1000 
		picked_start_date = new Date(picker.getStartDate() - tz_offset).toISOString().split('T')[0]
		picked_end_date = new Date(picker.getEndDate() - tz_offset).toISOString().split('T')[0]

		// Get full list of dates in YYYY-MM-DD format 
		// Reuse the picker.getStartDate here to get a date object rather than a string
		days_to_count = (picker.getEndDate() - picker.getStartDate())/(86400000)+1;
		all_days = [] 
		for (let i=0; i < days_to_count; i++) {
			next_day = picker.getStartDate()
			next_day.setDate(next_day.getDate() + i)
			next_day = new Date(next_day - tz_offset).toISOString().split('T')[0]
			all_days.push(next_day)
		}

  	// Hide all of them 
  	for (const show of the_shows) {
  		show.classList.add('filtered-out-by-date');

  		if (show.dataset.date_end >= picked_start_date && show.dataset.date_start <= picked_end_date){
  			// If the show has performances within the date range, 
  			// Verify if there is an actual performance within the date range
  			for (const day of all_days){
  				if (show.dataset.performances.includes(day)){
		  			show.classList.remove('filtered-out-by-date');
  				}
  			}
  		}
  	}
  	number_remaining = the_shows.length - document.getElementsByClassName('filtered-out-by-date').length
  	filter_date_counter.innerHTML = '(' + number_remaining + ')';
  }

})

//
// Time Filter //
//
var time_checkboxes = document.querySelectorAll('input[name="filter-time-item"]');
let picked_times = [] 
var filter_time_counter = document.getElementById('filter-time-counter');
var time_buttons = document.getElementsByClassName('btn-time');

function clearTimeCheckboxes() {
	// Reset the checkboxes
	for (const cbox in time_checkboxes) {
		time_checkboxes[cbox].checked = false; 
	}
	// Show all the shows filtered by time (only)
	for (i=0; i< the_shows.length; i++ ){
		the_shows[i].classList.remove('filtered-out-by-time');
	}
	// Deactivate the buttons 
	for (b=0; b< time_buttons.length; b++){
		time_buttons[b].classList.remove('active');
	}
	// Hide the 'no results' text
	no_results_text.classList.add('d-none');
	// Hide the number of results text 
	filter_time_counter.innerHTML = '';
}

time_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_times = 
      Array.from(time_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_times.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-time')) {
					the_shows[i].classList.remove('filtered-out-by-time');
				}
			}
			filter_time_counter.innerHTML = '';
			no_results_text.classList.add('d-none')
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-time');
    	}
    	// Iterate over the picked times and display shows that match
    	for (p=0; p < picked_times.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_times);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.time.includes(picked_times[p])) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-time')) the_shows[s].classList.remove('filtered-out-by-time');
					}
				}
    	}
	  	number_remaining = the_shows.length - document.getElementsByClassName('filtered-out-by-time').length
	  	filter_time_counter.innerHTML = '(' + number_remaining + ')';
    }

	  // No results label
    if (document.getElementsByClassName('filtered-out-by-time').length == the_shows.length) {
    	// Everything filtered out 
	    no_results_text.classList.remove('d-none');
    }
    else {
    	no_results_text.classList.add('d-none');
    }

    // Make the button .active status follow the checkbox checked status explicitly 
    var this_button = document.getElementById(this.id)
    if (this_button.checked) {
    	this.labels[0].classList.add('active');
    }
    else {
    	this.labels[0].classList.remove('active');
    }
  })
});

//
// Price Filter //
//
var price_checkboxes = document.querySelectorAll('input[name="filter-price-item"]');
let picked_prices = [] 
var filter_price_counter = document.getElementById('filter-price-counter');
var price_buttons = document.getElementsByClassName('btn-price');

function clearPriceCheckboxes() {
	// Reset the checkboxes
	for (const cbox in price_checkboxes) {
		price_checkboxes[cbox].checked = false; 
	}
	// Show all the shows filtered by price (only)
	for (i=0; i< the_shows.length; i++ ){
		the_shows[i].classList.remove('filtered-out-by-price');
	}
	// Deactivate the buttons 
	for (b=0; b< price_buttons.length; b++){
		price_buttons[b].classList.remove('active');
	}
	// Hide the 'no results' text
	no_results_text.classList.add('d-none');
	// Hide the number of results text 
	filter_price_counter.innerHTML = '';
}

price_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_prices = 
      Array.from(price_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_prices.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-price')) {
					the_shows[i].classList.remove('filtered-out-by-price');
				}
			}
			filter_price_counter.innerHTML = '';
			no_results_text.classList.add('d-none')
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-price');
    	}
    	// Iterate over the picked prices and display shows that match
    	for (p=0; p < picked_prices.length; p++) {
    		var p_range = picked_prices[p].split(',');
    		// STEP 1: Apply the filter to the show classes
    		for (s=0; s < the_shows.length; s++) {
    			if (p_range[0] <= parseFloat(the_shows[s].dataset.price) && parseFloat(the_shows[s].dataset.price) <= p_range[1]) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-price')) the_shows[s].classList.remove('filtered-out-by-price');
					}
				}
    	}
	  	number_remaining = the_shows.length - document.getElementsByClassName('filtered-out-by-price').length
	  	filter_price_counter.innerHTML = '(' + number_remaining + ')';
    }

	  // No results label
    if (document.getElementsByClassName('filtered-out-by-price').length == the_shows.length) {
    	// Everything filtered out 
	    no_results_text.classList.remove('d-none');
    }
    else {
    	no_results_text.classList.add('d-none');
    }

    // Make the button .active status follow the checkbox checked status explicitly 
    var this_button = document.getElementById(this.id)
    if (this_button.checked) {
    	this.labels[0].classList.add('active');
    }
    else {
    	this.labels[0].classList.remove('active');
    }
  })
});

// Genre Filter 
var genre_checkboxes = document.querySelectorAll('input[name="filter-genre-item"]');
let picked_genres = [] 
var filter_genre_counter = document.getElementById('filter-genre-counter');
var genre_buttons = document.getElementsByClassName('btn-genre');

function clearGenreCheckboxes() {
	// Reset the checkboxes
	for (const cbox in genre_checkboxes) {
		genre_checkboxes[cbox].checked = false; 
	}
	// Show all the shows filtered by genre (only)
	for (i=0; i< the_shows.length; i++ ){
		the_shows[i].classList.remove('filtered-out-by-genre');
	}
	// Deactivate the buttons 
	for (b=0; b< genre_buttons.length; b++){
		genre_buttons[b].classList.remove('active');
	}
	// Hide the 'no results' text
	no_results_text.classList.add('d-none');
	// Hide the number of results text 
	filter_genre_counter.innerHTML = '';
}

genre_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_genres = 
      Array.from(genre_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_genres.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-genre')) {
					the_shows[i].classList.remove('filtered-out-by-genre');
				}
			}
			filter_genre_counter.innerHTML = '';
			no_results_text.classList.add('d-none')
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-genre');
    	}
    	// Iterate over the picked genres and display shows that match
    	for (p=0; p < picked_genres.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_genres);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.genre.includes(picked_genres[p])) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-genre')) the_shows[s].classList.remove('filtered-out-by-genre');
					}
				}
    	}
	  	number_remaining = the_shows.length - document.getElementsByClassName('filtered-out-by-genre').length
	  	filter_genre_counter.innerHTML = '(' + number_remaining + ')';
    }

	  // No results label
    if (document.getElementsByClassName('filtered-out-by-genre').length == the_shows.length) {
    	// Everything filtered out 
	    no_results_text.classList.remove('d-none');
    }
    else {
    	no_results_text.classList.add('d-none');
    }

    // Make the button .active status follow the checkbox checked status explicitly 
    var this_button = document.getElementById(this.id)
    if (this_button.checked) {
    	this.labels[0].classList.add('active');
    }
    else {
    	this.labels[0].classList.remove('active');
    }
  })
});

