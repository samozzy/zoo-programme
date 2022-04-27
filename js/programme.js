var filterBoxElement = document.getElementById('filter-box')
filterBoxElement.addEventListener('show.bs.collapse', function () {
  // toggle class 'active' of #filter-box-button 
  document.getElementById('filter-box-button').classList.add('active');
  console.log('added');
})
filterBoxElement.addEventListener('hide.bs.collapse', function () {
  document.getElementById('filter-box-button').classList.remove('active');
  console.log('removed');
})
// TODO: This needs a narrower scope as it currently activates on *any* show.bs or hide.bs, as though
// it's not quite listening to only events on filterBoxElement.
