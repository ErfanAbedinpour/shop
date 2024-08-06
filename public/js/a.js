const el = document.getElementById("category");
el.addEventListener("change", function () {
  var selectedValue = this.value;
  alert("You selected: " + selectedValue);
});
