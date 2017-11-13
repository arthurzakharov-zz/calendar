window.onload = function () {
  new Calendar();
};

function correctField(obj, type) {
  jsValidator.errors[type] = false;
  obj.classList.remove('error-field');
  obj.classList.add('correct-field');
}

function errorField(obj, type, text) {
  jsValidator.errors[type] = true;
  var message = document.createElement('span');
  setAttributes(message, {'class': 'error-message'});
  message.textContent = text;
  setTimeout(function () {
    message.remove();
  }, 3000);
  obj.parentNode.appendChild(message);
  obj.classList.remove('correct-field');
  obj.classList.add('error-field');
}

var jsValidator = {
  'errors': {
    'event': true,
    'eventDate': false,
    'eventNames': true,
    'eventDescription': true
  },
  'event': function () {
    // between 5 and 30 symbols
    if (this.value.length > 5 && this.value.length < 30) {
      correctField(this, 'event');
    } else {
      errorField(this, 'event', 'Between 5 and 30 symbols, please  ');
    }
  }, /* end event name */
  'eventDate': function () {
    // format dd-mm-yyyy only 19-- and 20--
    var dateFormat = /^[0-3][0-9]-[0|1][0-9]-(19|20)[0-9]{2}/;
    if (dateFormat.test(this.value)) {
      correctField(this, 'eventDate');
    } else {
      errorField(this, 'eventDate', 'Only dd-mm-yyyy format, please');
    }
  }, /* end event date */
  'eventNames': function () {
    // only letters not numbers between 2 and 20 symbols each
    var onlyLetters = /^[A-Za-z]+$/;

    function splitAndCheck(string) {
      var result = false;
      var array = string.split(' ');
      array.forEach(function (item) {
        if (item.length > 2 && onlyLetters.test(item) && item.length < 20) {
          result = true;
        }
      });
      return result;
    }

    if (splitAndCheck(this.value)) {
      correctField(this, 'eventNames');
    } else {
      errorField(this, 'eventNames', 'Only letters each name 2 and 20 symbols');
    }
  }, /* end event person */
  'eventDescription': function () {
    // not more then 320 symbols
    if (this.value.length < 320) {
      correctField(this, 'eventDescription');
    } else {
      errorField(this, 'eventDescription', 'Not more the 320 symbols, please');
    }
  } /* end event description */
}
/* end jqValidator */

var eventCounter = 0;

var eventInfo = {};

var WEEK = {
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday'
};

var MONTH = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function Calendar() {

  var root = document.getElementById('root');
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var thisMonth = [today.getFullYear(), MONTH[today.getMonth()]];
  var tDate = new Date();
  var verifyStr = tDate.getFullYear() + '-' + (tDate.getMonth() + 1) + '-' + tDate.getDate();
  var remakeCalendar = undefined;

  function markTodayDate() {
    var today = document.getElementById(verifyStr);
    if (today !== null) {
      today.classList.add('today');
    }
  }

  function getFirstDayOfMonth() {
    var d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d.getDay();
  }

  function getLastDayOfMonth() {
    var d = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return d.getDay();
  }

  function getNumberOfDays() {
    var d = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return d.getDate();
  }

  function getPrevMonth() {
    var d = new Date(today.getFullYear(), today.getMonth(), 0);
    return d.getDate();
  }

  function changeMonth(next) {
    return function () {
      (next) ? ++month : --month;
      return new Date(year, month, 1);
    };
  }

  function createListOfEvents(arrayOfId, arrayOfEvent) {
    var listOfEvents = document.getElementById('list');
    listOfEvents.innerHTML = '';

    function isAlreadyInList(eventId) {
      var result = false;
      var listOfEventsChildren = listOfEvents.children;
      for (var i = 0; i < listOfEventsChildren.length; i++) {
        if (eventId == listOfEventsChildren[i].id) {
          result = true;
        }
      }
      return result;
    }

    for (var index in arrayOfEvent) {
      var eventDisplayed = document.createElement('div');
      setAttributes(eventDisplayed, {'id': arrayOfId[index]});
      var eventDisplayedTitle = document.createElement('div');
      eventDisplayedTitle.classList.add('event-displayed-title');
      eventDisplayedTitle.textContent = arrayOfEvent[index].name;
      var eventDisplayedDate = document.createElement('div');
      eventDisplayedDate.classList.add('event-displayed-date');
      eventDisplayedDate.textContent = arrayOfEvent[index].date;
      eventDisplayed.appendChild(eventDisplayedTitle);
      eventDisplayed.appendChild(eventDisplayedDate);
      if (!isAlreadyInList(arrayOfId[index])) {
        listOfEvents.appendChild(eventDisplayed);
      }
    }
    listOfEvents.classList.remove('hide');
  }

  function createEventItemInList(idName) {
    var eventBody = document.createElement('div');
    setAttributes(eventBody, {'id': idName, 'class': 'event-body'});
    var eventTitle = document.createElement('div');
    setAttributes(eventTitle, {'class': 'event-title'});
    var eventPeople = document.createElement('div');
    setAttributes(eventPeople, {'class': 'event-people'});
    eventTitle.textContent = eventInfo[idName].name;
    eventPeople.textContent = eventInfo[idName].participants;
    eventBody.appendChild(eventTitle);
    eventBody.appendChild(eventPeople);
    return eventBody;
  }

  function createPopup(objOfCreation, dateName, eventCounter) {
    if (objOfCreation != null && dateName != null) {
      var preconfiguredDate = dateName.split('-').reverse().join('-');
      var howCloseRightBorderIs = document.documentElement.clientWidth - objOfCreation.offsetLeft;
      var howCloseTopBorderIs = document.documentElement.clientHeight - objOfCreation.offsetTop;
    }
    var popupEvent = document.createElement('div');
    var popupForm = document.createElement('form');
    var popupInputEvent = document.createElement('input');
    setAttributes(popupInputEvent, {
      'id': 'popupEvent',
      'type': 'text',
      'placeholder': 'Event name',
      'class': 'popup-input'
    });
    popupInputEvent.addEventListener('focusout', jsValidator.event);
    var popupInputDate = document.createElement('input');
    if (objOfCreation == null && dateName == null) {
      setAttributes(popupInputDate, {
        'id': 'popupDate',
        'type': 'text',
        'placeholder': 'dd-mm-yyyy (only)',
        'class': 'popup-input'
      });
    } else {
      setAttributes(popupInputDate, {
        'id': 'popupDate',
        'type': 'text',
        'value': preconfiguredDate,
        'class': 'popup-input',
        'disabled': ''
      });
    }
    popupInputDate.addEventListener('focusout', jsValidator.eventDate);
    var popupInputNames = document.createElement('input');
    setAttributes(popupInputNames, {
      'id': 'popup-names',
      'type': 'text',
      'placeholder': 'Participants names...',
      'class': 'popup-input'
    });
    popupInputNames.addEventListener('focusout', jsValidator.eventNames);
    var popupInputDescription = document.createElement('textarea');
    setAttributes(popupInputDescription, {
      'id': 'popup-description',
      'row': '4',
      'placeholder': 'Describe your event...',
      'class': 'popup-input'
    });
    popupInputDescription.addEventListener('focusout', jsValidator.eventDescription);
    var popupBtnOK = document.createElement('input');
    setAttributes(popupBtnOK, {
      'id': 'popup-btn-ok',
      'type': 'button',
      'value': 'OK',
      'class': 'popup-btn'
    });
    var popupBtnCancel = document.createElement('input');
    setAttributes(popupBtnCancel, {
      'id': 'popupBtnCancel',
      'type': 'button',
      'value': 'Cancel',
      'class': 'popup-btn'
    });
    var table = document.getElementById('root');
    var blur = document.createElement('div');
    blur.classList.add('blur');
    var inputContainerEvent = document.createElement('div');
    setAttributes(inputContainerEvent, {'class': 'input-container'});
    var inputContainerDate = document.createElement('div');
    setAttributes(inputContainerDate, {'class': 'input-container'});
    var inputContainerNames = document.createElement('div');
    setAttributes(inputContainerNames, {'class': 'input-container'});
    var inputContainerDescr = document.createElement('div');
    setAttributes(inputContainerDescr, {'class': 'input-container'});
    var message = document.createElement('div');
    setAttributes(message, {'class': 'error-message'});
    popupEvent.appendChild(popupForm);
    popupForm.appendChild(inputContainerEvent);
    inputContainerEvent.appendChild(popupInputEvent);
    popupForm.appendChild(inputContainerDate);
    inputContainerDate.appendChild(popupInputDate);
    popupForm.appendChild(inputContainerNames);
    inputContainerNames.appendChild(popupInputNames);
    popupForm.appendChild(inputContainerDescr);
    inputContainerDescr.appendChild(popupInputDescription);
    popupForm.appendChild(popupBtnOK);
    popupForm.appendChild(popupBtnCancel);
    table.appendChild(blur);
    if (objOfCreation == null && dateName == null) {
      setAttributes(popupEvent, {'class': 'popup-event-center'});
    } else if (howCloseRightBorderIs > 600 && howCloseTopBorderIs > 400) {
      setAttributes(popupEvent, {'class': 'popup-event--left'});
    } else if (howCloseRightBorderIs > 600 && howCloseTopBorderIs < 400) {
      setAttributes(popupEvent, {'class': 'popup-event--left-top'});
    } else if (howCloseRightBorderIs < 600 && howCloseTopBorderIs > 400) {
      setAttributes(popupEvent, {'class': 'popup-event--right'});
    } else {
      setAttributes(popupEvent, {'class': 'popup-event--right-top'});
    }
    popupBtnOK.addEventListener('click', function () {
      if (!jsValidator.errors.event && !jsValidator.errors.eventDate && !jsValidator.errors.eventNames && !jsValidator.errors.eventDescription) {
        var eventName = '_id:event_' + eventCounter;
        if (objOfCreation == null && dateName == null) {
          var enteredDate = popupInputDate.value.split('-').reverse().join('-');
          eventName = enteredDate + eventName;
        } else {
          eventName = dateName + eventName;
        }
        eventInfo[eventName] = new Object();
        eventInfo[eventName].name = popupInputEvent.value;
        eventInfo[eventName].date = popupInputDate.value;
        eventInfo[eventName].participants = popupInputNames.value;
        eventInfo[eventName].description = popupInputDescription.value;
        blur.remove();
        popupEvent.remove();
        if (objOfCreation == null && dateName == null) {
          remakeCalendar();
        } else {
          objOfCreation.classList.remove('day-selected');
          remakeCalendar();
        }
      }
    });
    popupBtnCancel.addEventListener('click', function () {
      blur.remove();
      popupEvent.remove();
      if (objOfCreation != null && dateName != null) {
        objOfCreation.classList.remove('day-selected');
      }
    });
    return popupEvent;
  } // end createPopup

  function clickOnAddHandler() {
    var id = ++eventCounter;
    var table = document.getElementById('root');
    var popup = createPopup(null, null, id);
    table.appendChild(popup);
  }

  function clickOnDateHandler(eventPassed, itemOfEvent) {
    var list = document.getElementById('list');
    list.classList.add('hide');
    list.innerHTML = '';
    if (eventPassed.target != itemOfEvent) {
      return true;
    } else {
      var id = ++eventCounter;
      var arrOfClasses = itemOfEvent.id;
      var clickedDay = arrOfClasses;
      itemOfEvent.classList.add('day-selected');
      var popup = createPopup(itemOfEvent, clickedDay, id);
      itemOfEvent.appendChild(popup);
    }
  } // end clickOnDateHandler

  function createSheet(bodyElem) {
    var daysInMonth = getNumberOfDays();
    var firstDayOfMonth = getFirstDayOfMonth();
    var lastDayOfMonth = getLastDayOfMonth();
    var numberOfCells = daysInMonth + firstDayOfMonth + (6 - lastDayOfMonth);
    var numberOfRows = numberOfCells / 7;
    var cellCounter = 1;
    var dayCounter = 1;
    var prevMonthDates = getPrevMonth() - firstDayOfMonth;
    var nextMonthDates = 1;
    for (var i = 0; i < numberOfRows; i++) {
      var calBodyWeek = document.createElement('tr');
      calBodyWeek.classList.add('cal-body-week', 'cal-body-week-' + i);
      bodyElem.appendChild(calBodyWeek);
      for (var j = 0; j < 7; j++) {
        var calBodyDay = document.createElement('td');
        var numBox = document.createElement('span');
        calBodyDay.appendChild(numBox);
        if (cellCounter < (firstDayOfMonth + 1)) {
          calBodyDay.classList.add('cal-body-day',
              'day-from-other-month');
          numBox.textContent = ++prevMonthDates;
        } else if (cellCounter > (firstDayOfMonth + daysInMonth)) {
          calBodyDay.classList.add('cal-body-day',
              'day-from-other-month');
          numBox.textContent = nextMonthDates++;
        } else {
          var id = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + dayCounter;
          setAttributes(calBodyDay, {
            'id': id,
            'class': 'cal-body-day day-from-this-month'
          });
          numBox.textContent = dayCounter;
          calBodyDay.addEventListener('click', function (event) {
            clickOnDateHandler(event, this)
          });
          ++dayCounter;
        }
        // add days name to first week's days
        if (cellCounter <= 7) {
          var weekDayBox = document.createElement('span');
          weekDayBox.classList.add('week-day');
          weekDayBox.textContent = ', ' + WEEK[cellCounter];
          calBodyDay.appendChild(weekDayBox);
        }
        calBodyWeek.appendChild(calBodyDay);
        // TO BE UPDATED WITH FOR OR SMTH ELSE
        for (var z = 1; z <= eventCounter; z++) {
          var key = calBodyDay.id + '_id:event_' + z;
          if (eventInfo[key]) {
            calBodyDay.appendChild(createEventItemInList(key));
          }
        }
        ++cellCounter;
      } // end second for (days)
    } // end first for (weeks)
    markTodayDate();
  } // end createSheet

  function getCalendarHtml() {
    remakeCalendar = function () {
      thisMonth = [today.getFullYear(), MONTH[today.getMonth()]];
      calMonth.textContent = thisMonth.join(', ');
      calBody.innerHTML = '';
      createSheet(calBody);
    } // end remakeCalendar

    // creating elements
    var cal = document.createElement('table');
    cal.setAttribute('id', 'cal');

    var calBody = document.createElement('tbody');
    calBody.setAttribute('id', 'cal-body');

    var calNav = document.createElement('div');
    calNav.setAttribute('id', 'cal-nav');

    var calPrev = document.createElement('input');
    setAttributes(calPrev, {
      'id': 'cal-nav-prev',
      'type': 'button',
      'value': '<<',
      'class': 'cal-nav-btn'
    });

    var calMonth = document.createElement('span');
    setAttributes(calMonth, {'id': 'cal-nav-month'});
    calMonth.textContent = thisMonth.join(', ');

    var calNext = document.createElement('input');
    setAttributes(calNext, {
      'id': 'cal-nav-next',
      'type': 'button',
      'value': '>>',
      'class': 'cal-nav-btn'
    });

    var calToday = document.createElement('input');
    setAttributes(calToday, {
      'id': 'cal-nav-today',
      'type': 'button',
      'value': 'Today',
      'class': 'cal-nav-btn'
    });

    var header = document.createElement('header');
    header.classList.add('calendar-header');

    var headerContainer = document.createElement('div');
    headerContainer.classList.add('header-container', 'clearfix');

    var btnAdd = document.createElement('input');
    setAttributes(btnAdd, {
      'id': 'btn-add',
      'type': 'button',
      'value': 'Add',
      'title': 'Press Refresh To Update Calendar and see recently added event',
      'class': 'header-btn'
    });

    var btnRefresh = document.createElement('input');
    setAttributes(btnRefresh, {
      'id': 'btn-refresh',
      'type': 'button',
      'value': 'Refresh',
      'class': 'header-btn'
    });

    var searchIcon = document.createElement('span');
    setAttributes(searchIcon, {'id': 'search-icon'});

    var searchField = document.createElement('input');
    setAttributes(searchField, {
      'id': 'search-field',
      'type': 'text',
      'placeholder': 'Event, date or person'
    });
    var list = document.createElement('div');
    setAttributes(list, {'id': 'list', 'class': 'hide'});
    var container = document.createElement('div');
    setAttributes(container, {'class': 'search-container'});
    // building DOM
    root.appendChild(header);
    header.appendChild(headerContainer);
    headerContainer.appendChild(btnAdd);
    headerContainer.appendChild(btnRefresh);
    headerContainer.appendChild(container);
    container.appendChild(searchField);
    container.appendChild(searchIcon);
    container.appendChild(list);
    root.appendChild(calNav);
    calNav.appendChild(calPrev);
    calNav.appendChild(calMonth);
    calNav.appendChild(calNext);
    calNav.appendChild(calToday);
    root.appendChild(cal);
    cal.appendChild(calBody);

    // create sheet of calendar with dates
    createSheet(calBody);

    // adding events
    calPrev.addEventListener('click', function () {
      today = changeMonth(false)();
      remakeCalendar();
    });
    calNext.addEventListener('click', function () {
      today = changeMonth(true)();
      remakeCalendar();
    });
    calToday.addEventListener('click', function () {
      today = new Date();
      remakeCalendar();
    });
    headerContainer.addEventListener('click', function () {
      var list = document.getElementById('list');
      list.classList.add('hide');
      list.innerHTML = '';
    });
    searchField.addEventListener('keyup', function () {
      var input = this.value;
      if (input != '') {
        var arrayOfEvents = [];
        var arrayOfEventId = [];
        for (var firstLevelKey in eventInfo) {
          var subKey = eventInfo[firstLevelKey];
          for (var secondLevelKey in subKey) {
            if (!(subKey[secondLevelKey].indexOf(input) == -1)) {
              arrayOfEvents.push(eventInfo[firstLevelKey]);
              arrayOfEventId.push(firstLevelKey);
              createListOfEvents(arrayOfEventId, arrayOfEvents);
            }
          }
        }
      } else {
        var list = document.getElementById('list');
        list.classList.add('hide');
        list.innerHTML = '';
      }
    });
    btnRefresh.addEventListener('click', remakeCalendar);
    btnAdd.addEventListener('click', clickOnAddHandler);
    return cal;
  } // end getCalendarHtml

  return getCalendarHtml();

} // end Calendar