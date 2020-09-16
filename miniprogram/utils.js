function createSerialNo() {
  let num = Math.floor((Math.random() + 1) * 1000000)
    .toString(16)
    .toUpperCase();
  let time = new Date().getMilliseconds();
  return num + '' + time.toString();
}
function initDate(num = 30) {
  const time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth();
  let date = time.getDate();
  let day = time.getDay();
  let dates = [];
  for (let i = 0; i < num; i++) {
    let d = new Date(year, month, date + i).getDate();
    let w = new Date(year, month, date + i).getDay();
    //第一个非周日
    if (i == 0 && w != 0) {
      for (let j = w; j > 0; j--) {
        //是否是本月的过期时间
        let kd = '';
        let km = '';
        if (d > new Date(year, month, date - (w - j + 1)).getDate()) {
          km = month + 1;
          kd = new Date(year, month, date - (w - j + 1)).getDate();
        }
        dates.unshift({
          year: year,
          month: km,
          date: kd,
          week: j - 1,
          status: 0,
        });
      }
    }
    //在本月
    if (d >= date) {
      dates.push({
        year: year,
        month: month + 1,
        date: d,
        week: w,
        status: 1,
        id: i + 1,
      });
    }
    //代表已跨越
    if (d < date) {
      dates.push({
        year: month + 2 > 11 ? year + 1 : year,
        month: month + 2,
        date: d,
        week: w,
        status: 1,
        id: i + 1,
      });
    }
  }
  let months = Array.from(new Set(dates.map((v) => v.month)));
  let days = [];
  months.forEach((item) => {
    days.push({
      year: dates.filter((v) => v.month == item)[0].year,
      month: item,
      dates: dates.filter((v) => v.month == item),
    });
  });
  days.map((v) => {
    const dates = v.dates;
    let week = [];
    //判断第一个是否是0
    if (dates[0].week == 0) {
      week = cancel(dates);
    } else {
      let first = dates[0];
      let firstLen = 7 - first.week;
      let firstWeek = dates.slice(0, firstLen);
      for (let f = first.week - 1; f >= 0; f--) {
        firstWeek.unshift({
          year: firstWeek[0].year,
          month: firstWeek[0].month - 1,
          date: '',
          week: f,
          status: 2,
        });
      }
      week.push(firstWeek);
      week.push(...cancel(dates.slice(firstLen)));
    }
    v.week = week;
    return v;
  });
  return { days, dates };
}
function cancel(dates) {
  let kk = [];
  let count = Math.ceil(dates.length / 7);
  let remain = dates.length % 7;
  for (let c = 0; c < count; c++) {
    if (remain == 0) {
      kk.push(dates.slice(c * 7, (c + 1) * 7));
    } else {
      if (c < count - 1) {
        kk.push(dates.slice(c * 7, (c + 1) * 7));
      } else {
        let tmp = dates.slice(c * 7, (c + 1) * 7);
        let last = tmp[tmp.length - 1];
        for (let r = 1; r <= 7 - remain; r++) {
          tmp.push({
            year: last.year,
            month: last.month,
            date: '',
            week: last.week + r,
            status: 2,
          });
        }
        kk.push(tmp);
      }
    }
  }
  return kk;
}
function formatTime(date) {
  let d = new Date(date);
  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    d.getDate().toString().padStart(2, '0') +
    ' ' +
    d.getHours().toString().padStart(2, '0') +
    ':' +
    d.getMinutes().toString().padStart(2, '0') +
    ':' +
    d.getSeconds().toString().padStart(2, '0')
  );
}
module.exports = {
  createSerialNo,
  initDate,
  formatTime,
};
