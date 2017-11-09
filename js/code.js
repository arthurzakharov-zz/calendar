window.onload = function () {

  new Calendar();
};

var MONTH = {
  0 : 'January',
  1 : 'February',
  2 : 'March',
  3 : 'April',
  4 : 'May',
  5 : 'June',
  6 : 'July',
  7 : 'August',
  8 : 'September',
  9 : 'October',
  10 : 'November',
  11 : 'December'
};

function Calendar() {
  var root = document.getElementById('root');
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  var thisMonth = [today.getFullYear(), MONTH[today.getMonth()]];
  var tDate = new Date();
  var verifyStr = 'day-' + tDate.getFullYear() + '-' + tDate.getMonth() + '-' + tDate.getDate();


  function markTodayDate() {
    var today = document.getElementsByClassName(verifyStr);
    for(var i = 0; i < today.length; ++i){
      setAttributes(today[i], {'class' : 'today'});
    }
  }

  function getFirstDayOfMonth() {
    var d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d.getDay();
  }

  function getLastDayOfMonth() {
    var d = new Date(today.getFullYear(), today.getMonth()+1, 0);
    return d.getDay();
  }

  function getNumberOfDays() {
    var d = new Date(today.getFullYear(), today.getMonth()+1, 0);
    return d.getDate();
  }

  function getPrevMonth() {
    var d = new Date(today.getFullYear(), today.getMonth(), 0);
    return d.getDate();
  }

  function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
  
  function changeMonth(next) {
    return function () {
      (next) ? ++month : --month;
      return new Date(year, month, 1);
    };
  }

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
    for(var i = 0; i < numberOfRows; i++){
      var calBodyWeek = document.createElement('tr');
      calBodyWeek.classList.add('cal-body-week', 'cal-body-week-' + i);
      bodyElem.appendChild(calBodyWeek);
      for(var j = 0; j < 7; j++){
        var calBodyDay = document.createElement('td');
        if(cellCounter < (firstDayOfMonth+1)) {
          calBodyDay.classList.add('cal-body-day',
                                   'day-from-other-month',
                                   'day-'+cellCounter);
          calBodyDay.textContent = ++prevMonthDates;
        }else if (cellCounter > (firstDayOfMonth+daysInMonth)){
          calBodyDay.classList.add('cal-body-day',
                                   'day-from-other-month',
                                   'day-'+cellCounter);
          calBodyDay.textContent = nextMonthDates++;
        }else {
          calBodyDay.classList.add('cal-body-day',
                                   'day-from-this-month',
                                   'day-'+today.getFullYear()+'-'+today.getMonth()+'-'+dayCounter);
          calBodyDay.textContent = dayCounter;
          ++dayCounter;
        }
        calBodyWeek.appendChild(calBodyDay);
        ++cellCounter;
      }
    }
    markTodayDate();
  }

  function getCalendarHtml() {

    function remakeCalendar() {
      thisMonth = [today.getFullYear(), MONTH[today.getMonth()]];
      calMonth.textContent = thisMonth.join(', ');
      calBody.innerHTML = '';
      createSheet(calBody);
    }

    // creating elements
    var cal = document.createElement('table');
    cal.setAttribute('id', 'cal');
    var calBody = document.createElement('tbody');
    calBody.setAttribute('id', 'cal-body');
    var calNav = document.createElement('div');
    calNav.setAttribute('id', 'cal-nav');
    var calPrev = document.createElement('input');
    setAttributes(calPrev, {'id' : 'cal-nav-prev',
                            'type' : 'button',
                            'value' : '<<'});
    calPrev.classList.add('cal-nav-btn');
    var calMonth = document.createElement('span');
    setAttributes(calMonth, {'id' : 'cal-nav-month'});
    calMonth.textContent = thisMonth.join(', ');
    var calNext = document.createElement('input');
    setAttributes(calNext, {'id' : 'cal-nav-next',
                            'type' : 'button',
                            'value' : '>>'});
    calNext.classList.add('cal-nav-btn');
    var calToday = document.createElement('input');
    setAttributes(calToday, {'id' : 'cal-nav-today',
                             'type' : 'button',
                             'value' : 'Today'});
    calToday.classList.add('cal-nav-btn');
    var header = document.createElement('header');
    header.classList.add('calendar-header');
    // building DOM
    root.appendChild(header);
    root.appendChild(calNav);
    calNav.appendChild(calPrev);
    calNav.appendChild(calMonth);
    calNav.appendChild(calNext);
    calNav.appendChild(calToday);
    root.appendChild(cal);
    cal.appendChild(calBody);
    // create sheet of calendar with dates
    createSheet(calBody);
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
    return cal;
  }

  return getCalendarHtml();
}