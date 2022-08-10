//
// Navigation Dropdowns
//

var filterBoxElement = document.getElementById('filter-box')
var filterBoxButton = document.getElementById('filter-box-button')
var searchBoxElement = document.getElementById('search-box')
var searchBoxButton = document.getElementById('search-box-button')

// toggle class 'active' of #filter-box-button 
filterBoxElement.addEventListener('show.bs.collapse', function (e) {
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

// toggle class 'active' of #search-box-button 
searchBoxElement.addEventListener('show.bs.collapse', function (e) {
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

// Define the shows for filter pickers 
the_shows = document.getElementsByClassName('programme-show-container');
var no_results_text = document.getElementById('no-result-text');

//
// Utility Functions // 
//
function countResults() {
	filtered_out_shows = document.querySelectorAll('#show-list div[class*="filtered-out-by"]').length
	number_remaining = the_shows.length - filtered_out_shows
	has_results_text = document.getElementById('filter-results-text')
	no_results_text = document.getElementById('no-result-text')
	if (number_remaining == 0) {
		has_results_text.classList.add('d-none')
		no_results_text.classList.remove('d-none')
	}
	else {
		if (filtered_out_shows == 0 && document.getElementById('filter-badge-container').classList.value.includes('d-none')){
			// If the filter badge container isn't visible, assume nothing is being filtered 
			no_results_text.classList.add('d-none')
			has_results_text.classList.add('d-none')
		}
		else {
			// Somewhere between 1 and everything has been filtered in, let's go
			has_results_text.classList.remove('d-none')
			no_results_text.classList.add('d-none')
			document.getElementById('filter-results-counter').innerHTML = number_remaining;
			if (number_remaining > 1){
				document.getElementById('filter-results-counter-plural').classList.remove('d-none')
			}
			else {
				document.getElementById('filter-results-counter-plural').classList.add('d-none')
			}
		}
	}
}

function clearFilteredOutClass(
	className, 
	checkboxes=null, checkbox_default_state=false, 
	filter_buttons=null, filter_button_default_class=null){
	// Remove the `filtered-out-by-xxx` class from the shows
	for (const show of the_shows){
		show.classList.remove(className);
	}
	// Reinstate the checkboxes to their default state (default: unchecked)
	if (checkboxes!=null){
		for (const cbox of checkboxes){
			cbox.checked = checkbox_default_state;
		}
	}
	// Reset the filter buttons to their default state (default: not `.active`)
	if (filter_buttons!=null){
		for (const btn of filter_buttons){
			if (filter_button_default_class!=null) {
				filter_buttons[btn].classList.add(filter_button_default_class)
			}
			else {
				btn.classList.remove('active');
			}
		}
	}
	hideActiveFilter(className.replace('filtered-out-by-',''))
	countResults();
}

//
// Active Filter Buttons
//
function showActiveFilter(btn_id, looking_for_checked=true){
	// Show the filter buttons! 
	// Because it iterates each time, this is a toggler as much as it is a show-er 
	document.getElementById('filter-badge-container').classList.remove('d-none');
	document.getElementById('active-filter-' + btn_id).classList.remove('d-none');
	if (btn_id == 'access' || btn_id == 'content-warning') {
		document.getElementById('edit-circle-'+ btn_id).classList.add('d-inline');
	}
	else if (btn_id != 'search'){
		document.getElementById('edit-circle-'+ btn_id).classList.remove('d-none');
	}

	filter_query = 'filter-' + btn_id + '-item'
	inner_text = [];
	if (btn_id == 'date'){
		date_options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
		picked_start_date = picker.getStartDate().toLocaleString(undefined,date_options)
		picked_end_date = picker.getEndDate().toLocaleString(undefined,date_options)
		if (picked_start_date != picked_end_date){
			inner_text.push('Between ' + picked_start_date + ' and ' + picked_end_date)
		}
		else {
			inner_text.push('On ' + picked_start_date)
		}
	}
	else if (btn_id == 'search'){
		if (typeof(looking_for_checked)=='string'){
			inner_text.push(looking_for_checked);
		}
	}
	else { 
		if (looking_for_checked == true){
			document.querySelectorAll('[name="'+filter_query+'"]:checked').forEach(filter_btn => {
				el_inner_text = filter_btn.labels[0].innerText
				if (el_inner_text == '' && filter_btn.labels[0].dataset.zoo_tooltip != ''){
					// The access inner text is actually a picture so let's use this data attribute
					el_inner_text = filter_btn.labels[0].dataset.zoo_tooltip
				}
				inner_text.push(el_inner_text);
			});
		}
		else {
			// Special case for content warnings where we click to hide rather than additive 
			document.querySelectorAll('[name="'+filter_query+'"]:not(:checked)').forEach(filter_btn => {
				el_inner_text = filter_btn.labels[0].innerText
				if (el_inner_text == '' && filter_btn.labels[0].dataset.zoo_tooltip != ''){
					el_inner_text = filter_btn.labels[0].dataset.zoo_tooltip
				}
				inner_text.push(el_inner_text);
			});
		}
	}
	filter_button_inner_text = document.getElementById('active-filter-' + btn_id + '-list')
	if (inner_text.length == 0){
		// If we've removed all the things, hide the filter badge
		hideActiveFilter(btn_id);
	}
	else {
		filter_button_inner_text.innerText = ': ' + inner_text.join('; ');
	}
	countResults();
}

function hideActiveFilter(btn_id){
	filter_container = document.getElementById('filter-badge-container')
	document.getElementById('active-filter-' + btn_id).classList.add('d-none');
	document.getElementById('active-filter-' + btn_id + '-list').innerText = '';
	if (btn_id == 'access' || btn_id == 'content-warning') {
		document.getElementById('edit-circle-'+ btn_id).classList.remove('d-inline');
	}
	else if (btn_id != 'search'){
		document.getElementById('edit-circle-'+ btn_id).classList.add('d-none');
	}
	else {
		document.getElementById('hint-to-scroll').classList.add('d-none');
	}

	countResults();

	// If all of the filters have been hidden, hide the container 
	if (filter_container.querySelectorAll('button').length == filter_container.querySelectorAll('button.d-none').length){
		filter_container.classList.add('d-none');
	}
}

//
// Search // 
//
search_box = document.getElementById('search-input')
function clearSearch(){
	// Reset the search box value, show the shows, and hide the filter
	search_box.value = '';
	clearFilteredOutClass('filtered-out-by-search')
	hideActiveFilter('search')
}
function doSearch(term){
	// Strip any whitespace (not that there should be any)
	search_term = term.replaceAll(' ', '');
	// Iterate over the shows for any searchable term
	if (term.length >= 3){
		for (const show of the_shows){
			// Only remove the class here so that searches for 'foo' and 'bar' include
			// BOTH, not just the latest word in the array
			if (show.dataset.search.includes(search_term)) {
				show.classList.remove('filtered-out-by-search');
			}
			// Use the raw value so it's more human-readable than the query term
			showActiveFilter('search',search_box.value)
		}
	}
}
function doHint(){
	// Show a prompt to give a larger search query when there aren't enough characters
	// Partial reset of the search to show everything for the meantime 
	clearFilteredOutClass('filtered-out-by-search');
	hideActiveFilter('search')
	var min_chars = 3; // Minimum characters to do a search

	function getSearchTerm(){
		// Strip any whitespace from the search term
		// If there are multiple words, and the second "word" is just a space, treat it as one word
		if (search_box.value.includes(' ') && (search_box.value.split(/\s+/)[1] != '')){
			// If we've a multi-word search, test against the longest one
			hint_search_term = search_box.value.toLowerCase().split(/\s+/)
			l = 0; // Longest word character count
			t = ''; // The longest word 
			for (const s of hint_search_term){
				if (s.length > l){
					l = s.length
					t = s;
				}
			}
			hint_search_term = t;
			min_chars = 2; // Accept 3-character search for multi-word searches 
		}
		else {
			hint_search_term = search_box.value.toLowerCase().replaceAll(' ', '');
		}
		return hint_search_term;
	}

	function showHint() {
		// The longest word may change, so we need to keep checking on it 
		hint_search_term = getSearchTerm()
		// The Help Text Script
		if (hint_search_term.length > 0 && hint_search_term.length <= min_chars){ 
			search_hint.classList.remove('d-none');
		}
	}
	hint_search_term = getSearchTerm()
	if (hint_search_term.length > 0 && hint_search_term.length <= min_chars){
		// Wait a moment, then run the help text script script 
		// The help text script also runs an if to see if the value still matches
		let hintTimeout = setTimeout(showHint, 2000)
	}
	else {
		search_hint.classList.add('d-none');
	}
}
search_box.addEventListener('keyup', ({ key }) => {
	search_value = search_box.value.toLowerCase().replaceAll(' ', '');
	scroll_please = document.getElementById('hint-to-scroll')
	if (key == "Enter"){
		if (search_value.length > 3 && document.querySelectorAll('.filtered-out-by-search').length != the_shows.length) {
			scroll_please.classList.remove('d-none');
		}
		else {
			scroll_please.classList.add('d-none');
		}
	}
})
search_box.addEventListener('input', (event) => {
	// Sanitise text input 
	search_value = search_box.value.toLowerCase().replaceAll(' ', '');
	search_hint = document.getElementById('search-hint');
	// Do the search! 
	if (search_value.length > 3){
		search_hint.classList.add('d-none');
		for (const show of the_shows){
			// Hide everything 
			show.classList.add('filtered-out-by-search');
		}
		doSearch(search_value);
		if (document.querySelectorAll('.filtered-out-by-search').length == the_shows.length){
			// If searching for the entire term gets nothing, split on whitespace and 
			// search for each word 
			for (const show of the_shows){
				// Hide everything 
				show.classList.add('filtered-out-by-search');
			}
			search_array = search_box.value.toLowerCase().split(/\s+/);
			if (search_array.length > 1 && search_array[1].match(/^[0-9a-z]+$/i)){
				// Provided there are two alphanumeric words, we can do a multi-word search
				// Quick check that they're all 3+ characters 
				if (Math.max(...(search_array.map(el => el.length))) > 2){
					for (const s of search_array){
						doSearch(s)
					}
				}
				else {
					doHint();
				}
			}
		}
		else {
			// Nothing? 
		}
	}
	else {
		// If the search string isn't long enough, give up
		doHint();
		document.getElementById('hint-to-scroll').classList.add('d-none');
	}
});

//
// Date Picker //
//
var date_picker = document.getElementById('datepicker');
function clearDatePick() {
	// Reset the datepicker
	picker.clear(); 
	hideActiveFilter('date');
	clearFilteredOutClass('filtered-out-by-date');
}

picker.on('select',e => {
	picked_value = date_picker.value 

  if (picked_value == 0) {
		for (i=0; i< the_shows.length; i++ ) {
			if (the_shows[i].classList.contains('filtered-out-by-date')) {
				the_shows[i].classList.remove('filtered-out-by-date');
			}
		}
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
  	showActiveFilter('date')
  }

})

//
// Time Filter //
//
var time_checkboxes = document.querySelectorAll('input[name="filter-time-item"]');
let picked_times = [] 
var time_buttons = document.getElementsByClassName('btn-time');

function clearTimeCheckboxes() {
	// Reset the checkboxes and remove the filter from the shows 
	clearFilteredOutClass('filtered-out-by-time',time_checkboxes,false,time_buttons)
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
    }
   	showActiveFilter('time');
  })
});

//
// Price Filter //
//
/*
var price_checkboxes = document.querySelectorAll('input[name="filter-price-item"]');
let picked_prices = [] 
var price_buttons = document.getElementsByClassName('btn-price');

function clearPriceCheckboxes() {
	clearFilteredOutClass('filtered-out-by-price', price_checkboxes, false, price_buttons)
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
    }
    showActiveFilter('price');
  })
});
*/

// 
// Venue Filter //
//
var venue_checkboxes = document.querySelectorAll('input[name="filter-venue-item"]');
let picked_venues = [] 
var venue_buttons = document.getElementsByClassName('btn-venue');

function clearVenueCheckboxes() {
	clearFilteredOutClass('filtered-out-by-venue', venue_checkboxes, false, venue_buttons)
}

venue_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_venues = 
      Array.from(venue_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_venues.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-venue')) {
					the_shows[i].classList.remove('filtered-out-by-venue');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-venue');
    	}
    	// Iterate over the picked venues and display shows that match
    	for (p=0; p < picked_venues.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_venues);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.venue.includes(picked_venues[p])) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-venue')) the_shows[s].classList.remove('filtered-out-by-venue');
					}
				}
    	}
    }
    showActiveFilter('venue');
  })
});

//
// Age Guidance Filter //
//
var age_checkboxes = document.querySelectorAll('input[name="filter-age-item"]');
let picked_ages = [] 
var age_buttons = document.getElementsByClassName('btn-age');

function clearAgeCheckboxes() {
	clearFilteredOutClass('filtered-out-by-age', age_checkboxes, false, age_buttons);
}

age_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_ages = 
      Array.from(age_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_ages.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-age')) {
					the_shows[i].classList.remove('filtered-out-by-age');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 
    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-age');
    	}
    	// Iterate over the picked ages and display shows that match
    	for (p=0; p < picked_ages.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_ages);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.age_guidance.includes(picked_ages[p])) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-age')) the_shows[s].classList.remove('filtered-out-by-age');
					}
				}
    	}
    }
    showActiveFilter('age')
  })
});

//
// Genre Filter //
//
var genre_checkboxes = document.querySelectorAll('input[name="filter-genre-item"]');
let picked_genres = [] 
var genre_buttons = document.getElementsByClassName('btn-genre');

function clearGenreCheckboxes() {
	clearFilteredOutClass('filtered-out-by-genre', genre_checkboxes, false, genre_buttons);
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
    }
    showActiveFilter('genre')
  })
});

//
// Content Warning Filter //
//
var content_warning_checkboxes = document.querySelectorAll('input[name="filter-content-warning-item"]');
let picked_content_warnings = content_warning_checkboxes 
var content_warning_buttons = document.getElementsByClassName('btn-content_warning');

function clearContentWarningCheckboxes() {
	// Reset the checkboxes (ALL ticked!)
	clearFilteredOutClass('filtered-out-by-content-warning', content_warning_checkboxes, true, content_warning_buttons, 'active');
}

content_warning_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_content_warnings = 
      Array.from(content_warning_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked == false) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_content_warnings.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-content-warning')) {
					the_shows[i].classList.remove('filtered-out-by-content-warning');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 
    	console.log(picked_content_warnings);
    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-content-warning');
    		let has_warning = 0;
    		for (const cw of picked_content_warnings) {
    			if (show.dataset.content_warnings.includes(cw)){
    				has_warning++;
    			}
    		}
    		if (has_warning == 0){
    			show.classList.remove('filtered-out-by-content-warning');
    		}
    	}
    }
    showActiveFilter('content-warning', false)
  })
});

//
// Access Filter //
//
var access_checkboxes = document.querySelectorAll('input[name="filter-access-item"]');
let picked_accesss = [] 
var access_buttons = document.getElementsByClassName('btn-access');

function clearAccessCheckboxes() {
	clearFilteredOutClass('filtered-out-by-access',access_checkboxes,false,access_buttons);
}

access_checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    picked_access = 
      Array.from(access_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_access.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-access')) {
					the_shows[i].classList.remove('filtered-out-by-access');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-access');
    	}
    	// Iterate over the picked accesss and display shows that match
    	for (p=0; p < picked_access.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_access);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.access.includes(picked_access[p])) {
						// If the ticket price is in range, display the show 
						if (the_shows[s].classList.contains('filtered-out-by-access')) the_shows[s].classList.remove('filtered-out-by-access');
					}
				}
    	}
    }
    showActiveFilter('access');
  })
});

function clearAccessContentCheckboxes(){
	clearContentWarningCheckboxes();
	clearAccessCheckboxes();
}

function sortByTime(){
	document.getElementById('btn-sort-by-time').classList.add('active')
	document.getElementById('btn-sort-by-title').classList.remove('active')
	document.getElementById('sort-by-status').innerHTML = 'start time'
	var by_title = document.querySelectorAll('.by-title-visible').forEach((el) => {
    el.classList.add('by-title-hidden')
    el.classList.remove('by-title-visible')
	});

	var by_time = document.querySelectorAll('.by-time-hidden').forEach((el) => {
    el.classList.add('by-time-visible')
    el.classList.remove('by-time-hidden')
	});
	// swap all .by-title-visible to .by-title-hidden 
	// swap all .by-time-hidden to .by-time-visible 
}

function sortByTitle(){
	document.getElementById('btn-sort-by-title').classList.add('active')
	document.getElementById('btn-sort-by-time').classList.remove('active')
	document.getElementById('sort-by-status').innerHTML = 'title'
	var by_title = document.querySelectorAll('.by-title-hidden').forEach((el) => {
    el.classList.add('by-title-visible')
    el.classList.remove('by-title-hidden')
	});

	var by_time = document.querySelectorAll('.by-time-visible').forEach((el) => {
    el.classList.add('by-time-hidden');
    el.classList.remove('by-time-visible')
	});
}