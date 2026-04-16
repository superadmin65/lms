export const allColors = [
  { name: 'blue', value: '#21b0df' },
  /* { name: 'xx', value: '#9843f0' },
  { name: 'xx', value: '#b84be5' },
  { name: 'xx', value: '#ff64db' },*/
  { name: 'orange', value: '#ffa858' },
  { name: 'yellow', value: '#ddc800' },
  { name: 'violet', value: '#9494ff' },
  { name: 'green', value: '#43f0a5' },
  { name: 'red', value: '#ff7f7f' },
  { name: 'lavender', value: '#d165ff' },
  { name: 'magenta', value: '#ff6bdd' },
  { name: 'gray', value: '#a0a0a0' },
  { name: 'lemon', value: '#afea30' },
];

export function getColorArr(count, colors = allColors) {
  let arr = colors.map((item) => item.value || item);
  arr.sort(() => Math.random() - 0.5);
  while (count > arr.length) {
    arr = [...arr, ...arr];
  }
  return arr.slice(0, count);
}

export function inputStrToArr({ text, breakLine }) {
  let arr;
  if (text.indexOf('\n') !== -1) {
    arr = text
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  } else {
    arr = text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }
  if (breakLine) {
    if (arr[0].indexOf('|') !== -1) {
      arr = arr.map((line) =>
        line
          .split('|')
          .map((item) => item.trim())
          .filter((item) => item !== '')
      );
    } else {
      arr = arr.map((line) =>
        line
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== '')
      );
    }
  }
  return arr;
}

export function generateRandomCompare(
  data,
  count = 10,
  isNonNegative,
  isUnique
) {
  let list = [];
  let counter = 0;
  while (list.length < count) {
    let pattern = data.pattern;
    pattern = getRepeated(pattern);
    pattern = pattern.split(' ');
    let item = [...pattern];
    for (let k = 0; k < pattern.length; k += 2) {
      item[k] = getFormatedRandom(item[k]);
    }
    item = item.join(' ');
    if (isNonNegative) {
      if (eval(item) < 0) {
        continue;
      }
    }
    if (isUnique && counter < 100 && list.indexOf(item) !== -1) {
      continue;
    }
    list.push(item);
    counter++;
  }
  return list;
}

function getRepeated(pattern) {
  let arr = ['s', 't', 'u', 'v'];
  for (let i = 0; i < arr.length; i++) {
    if (pattern.indexOf(arr[i]) !== -1) {
      let rand = Math.ceil(Math.random() * 9);
      pattern = pattern.replaceAll(arr[i], () => rand);
    } else {
      return pattern;
    }
  }
  return pattern;
}

//x,a,b
export function getFormatedRandom(str) {
  let arr = str.split(/(\{\d+_\d+\})/).filter((item) => item.trim() !== '');
  arr = arr.map((item) => (item.charAt(0) === '{' ? item : item.split('')));
  arr = arr.flat();
  let range = Math.pow(10, arr.length);
  let offset = Math.pow(10, arr.length - 1);
  let no = Math.floor(Math.random() * (range - offset) + offset);
  let nostr = '' + no;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].charAt(0) === '{') {
      let start = +arr[i].substring(1, arr[i].indexOf('_'));
      let end = +arr[i].substring(arr[i].indexOf('_') + 1, arr[i].length - 1);
      arr[i] = Math.round(Math.random() * (end - start)) + start;
    } else {
      switch (arr[i]) {
        case 'x':
          arr[i] = nostr[i];
          break;
        case 'a':
          arr[i] = Math.ceil(Math.random() * 4);
          break;
        case 'b':
          arr[i] = Math.ceil(Math.random() * 5) + 4;
          break;
        case 'c':
          arr[i] = Math.ceil(Math.random() * 5);
          break;
        default:
          break;
      }
    }
  }
  let ret = arr.map((no) => '' + no).join('');
  if (ret.indexOf('.') !== -1 && ret.charAt(nostr.length - 1) === '0') {
    ret = ret.slice(0, ret.length - 1) + Math.ceil(Math.random() * 9);
  }
  return +ret;
}

export function getLocalItem(label, defaultVal = []) {
  // 1. STOP if running on the server (Build time)
  if (typeof window === 'undefined') {
    return defaultVal;
  }

  // 2. Now it is safe to check for localStorage
  const ls = window.localStorage;

  if (!ls) {
    return defaultVal;
  }

  const data = ls.getItem(label);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultVal;
    }
  } else {
    return defaultVal;
  }
}

export function setLocalItem(label, value) {
  const ls = localStorage || window.localStorage;
  if (ls) {
    ls.setItem(label, JSON.stringify(value));
  }
}

export function removeLocalItem(label) {
  const ls = localStorage || window.localStorage;
  if (ls) {
    ls.removeItem(label);
  }
}

export function getRandIndex(item, allowDirectMatch = true) {
  if (item.length) {
    let a = item.map((ques, i) => {
      let arr = [...Array(ques.options.length)].map((dummy, i) => i);
      if (!ques.noRandom) {
        if (allowDirectMatch) {
          arr.sort(() => Math.random() - 0.5);
        } else {
          arr = shuffleAll(arr);
        }
      }
      return [...arr];
    });
    return a;
  } else {
    let arr = [...Array(item)].map((dummy, i) => i);
    if (allowDirectMatch) {
      arr.sort(() => Math.random() - 0.5);
    } else {
      arr = shuffleAll(arr);
    }
    return [...arr];
  }
}

export function shuffleAll(arr) {
  let copy = [...arr];
  let anyLinearMatch;
  while (true) {
    copy.sort((a, b) => Math.random() - 0.5);
    anyLinearMatch = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === copy[i]) {
        anyLinearMatch = true;
        break;
      }
    }
    if (!anyLinearMatch) {
      return copy;
    }
  }
}

export const getPos = (e) => {
  if (e.clientX) {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  } else if (e.touches && e.touches[0] && e.touches[0].clientX) {
    if (e.touches.length > 1) return null;
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  } else if (
    e.changedTouches &&
    e.changedTouches[0] &&
    e.changedTouches[0].clientX
  ) {
    if (e.changedTouches.length > 1) return null;
    return {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  }
};

export function setStyles(dom, obj) {
  for (let i in obj) {
    dom.style[i] = obj[i];
  }
}

// the below function is used to load video. It is generic. In future this method can be used to load all types of assets.
export function getAsset(path) {
  let prefix = 'https://asset.pschool.in';
  if (path.indexOf('http') === 0) {
    return path;
  }
  // let prefix = '/assets';
  return `${prefix}/${path}`;
}

export function getBasePath() {
  try {
    if (typeof window !== 'undefined') {
      // First, try to get from __NEXT_DATA__
      if (window.__NEXT_DATA__ && window.__NEXT_DATA__.basePath) {
        return window.__NEXT_DATA__.basePath;
      }
      // If not available, infer from current pathname
      // If pathname starts with /lms-system, return /lms-system
      const pathname = window.location.pathname || '';
      if (pathname.startsWith('/lms-system')) {
        return '/lms-system';
      }
    }
  } catch (e) {}
  return '';
}

export function publicPath(p) {
  if (!p) return p;
  // ensure leading slash
  let path = p.startsWith('/') ? p : '/' + p;
  const bp = getBasePath();
  return bp + path;
}

export function getFile(fileName, type) {
  let prefix = 'https://asset.pschool.in';
  //let prefix = '/assets';
  if (!type || type === 'audio') {
    //fileName = fileName.replace(".mp3", ".aac");
    return `${prefix}/sound/${fileName}`;
  }
}

export function loadAsset(fileName) {
  if (fileName.indexOf('http') === 0) {
    return fileName;
  }
  let prefix = 'https://asset.pschool.in';
  //let prefix = '/assets';

  let ret = `${prefix}/${fileName}`;
  return ret;
}

export function getImage(id, collection) {
  console.log('getImage id', id);
  if (id.indexOf('>') !== -1) {
    id = id.replaceAll('>', '/');
  }
  // Prefer serving images from local public folder so Next.js basePath applies.
  // If an absolute URL is provided, return it unchanged.
  if (id.indexOf('.') === -1) {
    id = `${id}.jpg`;
  }
  if (id.indexOf('http') === 0) {
    return id;
  }
  const prefix = 'https://asset.pschool.in';
  // If collection indicates dragDrop or id contains folder path, map to /img/...
  if (collection === 'dragDrop') {
    if (id.indexOf('/') !== -1) {
      return `/img/${id}`;
    }
    return `/img/dragDrop/${id}`;
  } else if (id.indexOf('/') !== -1) {
    return `/img/${id}`;
  }

  if (collection) {
    return `${prefix}/${collection}/${id}`;
  } else {
    return `${prefix}/stockimg/${id}`;
  }

  /*
  if (!collection || collection === 'custom') {
    for (let i = 0; i < allImages.length; i++) {
      const find = allImages[i].list.find((item) => item.id === id);
      if (find) {
        return prefix + find.img;
      }
    }
  } else {
    let group = allImages.find((item) => item.id === collection);
    let img = group.list.find((item) => item.id === id).img;
    return prefix + img;
  }
  */
}

export function generateDataFromPattern(data, count = 4) {
  let list = [];
  for (let i = 0; i < 10; i++) {
    let arr = [];
    let pattern = data.pattern;
    pattern = getRepeated(pattern);
    pattern = pattern.split(' ');
    let values = [];
    while (arr.length < count) {
      let item = [...pattern];
      for (let k = 0; k < pattern.length; k += 2) {
        item[k] = getFormatedRandom(item[k]);
      }
      item = item.join(' ');
      let val = eval(item);
      if (val < 0 || values.indexOf(val) !== -1) {
        continue;
      }
      values.push(val);
      arr.push(item);
    }
    arr.sort((a, b) =>
      data.probType === 'biggest' || data.probType === 'descending'
        ? eval(b) - eval(a)
        : eval(a) - eval(b)
    );
    //Rethna: replaceAll not working on older browser
    arr = arr.map((item) => item.replace('*', '×'));
    arr = arr.map((item) => item.replace('-', '–'));
    //arr = arr.map((item) => item.replaceAll('/', '÷'));

    const randArr = [...Array(arr.length)].map((dummy, i) => i);
    randArr.sort(() => Math.random() - 0.5);
    if (data.probType === 'descending' || data.probType === 'ascending') {
      list.push({
        options: arr,
        randArr,
      });
    } else {
      list.push({
        words: arr,
        randArr,
      });
    }
  }
  return list;
}

export function getTimeStr(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  if (min <= 9) {
    min = '0' + min;
  }
  if (sec <= 9) {
    sec = '0' + sec;
  }
  return `${min}:${sec}`;
}

export function delay(no) {
  return new Promise((resolve) =>
    setTimeout(() => resolve('doneFromDelay'), no)
  );
}

export function setAttrs(dom, obj) {
  if (!dom) {
    return;
  }
  for (let i in obj) {
    dom.setAttribute(i, obj[i]);
  }
}

export function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function toggleDisableBtn(button, bool) {
  if (bool) {
    button.classList.add('callInProg');
    button.setAttribute('disabled', 'true');
  } else {
    button.classList.remove('callInProg');
    button.removeAttribute('disabled');
  }
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getDateStr(date) {
  if (!date) {
    return null;
  } else if (!isNaN(date)) {
    date = +date;
  }

  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function isSmallScreen() {
  if (window.innerWidth < 900) {
    return true;
  } else {
    return false;
  }
}

//https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t

export function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
