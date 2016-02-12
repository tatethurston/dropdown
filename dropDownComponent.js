/*

Syntax:
var dropDown = new DropDown(domElement [, autocompleteList, limitTo])

domElement is a live DOM Node (document.selectElementById('someId'))
autocomplete is an array of strings (['usa', 'uk', 'japan'])
limitTo is the maximum number of elements to drop down

*/
DropDown = function (el, autocompleteList, limitTo) {
  var defaultList = ['USA', 'UK', 'Japan', 'China', 'Ukraine', 'Germany'];
  var defaultLimit = 10;

  this.el = document.getElementById('dropDownComponent');
  this.autocomplete = Array.isArray(autocompleteList) ? autocompleteList : defaultList;
  this.limitTo = typeof limitTo === 'number' && !isNaN(limitTo) ? limitTo : defaultLimit;

  this.createElements();
  this.registerEvents();
};


DropDown.prototype.registerEvents = function () {
  //bind this so context is DropDown instance instead of input element
  //use keyup to detect nonprintable keys (backspace specifically)
  this.input.addEventListener('keyup', this.handleKeyPress.bind(this));
  this.input.addEventListener('click', this.handleKeyPress.bind(this));

  // assign one event listener -> optimized and prevent needing to remove
  // listeners on each removal (not removing would lead to memory leak)
  this.dropDown.addEventListener('click', this.handleClick.bind(this));
};

DropDown.prototype.createElements = function () {
  this.input = document.createElement('input');
  this.input.type = 'text';
  this.dropDown = document.createElement('ul');

  this.el.appendChild(this.input);
  this.el.appendChild(this.dropDown);
};

DropDown.prototype.handleClick = function (e) {
  // only respond to clicked li elents
  if (e.target.tagName === 'LI') {
    this.input.value = e.target.innerText;
  }

  this.clearDropDown();
};

DropDown.prototype.clearDropDown = function () {
  //clear previous match results
  this.dropDown.innerHTML = '';
};

DropDown.prototype.handleKeyPress = function (e) {
  var textData = e.target.value;
  this.clearDropDown();

  if (textData.length > 0) {
    var matches = this.filter(this.autocomplete, textData)
      .slice(0, this.limitTo);
    this.insertMatches(matches, this.dropDown);
  }
};

DropDown.prototype.insertMatches = function (matches, el) {
  //use document fragment for efficient insertion
  var items = document.createDocumentFragment();

  matches.forEach(function (match) {
    var item = document.createElement('li');
    item.textContent = match;
    items.appendChild(item);
  });

  el.appendChild(items);
};

DropDown.prototype.filter = function (items, match) {
  //case insensitive match to correct user input
  var regex = new RegExp(match, 'i');

  return items.filter(function (item) {
    return regex.test(item);
  });
};


// Example component usage
var domNode = document.getElementById('dropDownComponent');
var dropDown = new DropDown(domNode);

// var domNode = document.getElementById('dropDownComponent');
// var dropDown = new DropDown(domNode, ['hello', 'my', 'name', 'is', 'Tate']);

// var domNode = document.getElementById('dropDownComponent');
// var dropDown = new DropDown(domNode, '', 3);
