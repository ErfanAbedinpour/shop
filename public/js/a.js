const el = document.getElementById('category');
console.log(el)
el.addEventListener('change', function() {

  var selectedValue = this.value;
  alert('You selected: ' + selectedValue);
});
