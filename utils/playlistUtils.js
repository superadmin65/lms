export function getDataFromGroupAct(item, i) {
  let data = item.commonData || {};
  let subData = item.data[i];
  if (subData.refs) {
    let refId = subData.refs;
    let refData;
    if (refId.indexOf("~") !== -1) {
      const refIndex = +refId.substr(refId.indexOf("~") + 1);
      refId = refId.substr(0, refId.indexOf("~"));
      subData = props.toc.defs[refId][refIndex];
    } else {
      subData = props.toc.defs[refId];
    }
  }

  if (typeof subData === "string") {
    data = { ...data, text: subData };
  } else if (Array.isArray(subData)) {
    data = { ...data, arr: subData };
  } else {
    data = { ...data, ...subData };
  }
  return { ...item, data };
}

export async function loadActivity(id) {
  const [playlistId, activityId] = id.split("/");
  /*
  return {
    title: "Match words with opposite meaning.",
    text: `yes, no
    you, I
    yesterday, tomorrow
    young, old
    early, late 
    cry, laugh `,
  };
  */
  let data;
  if (isNaN(playlistId)) {
    // Respect Next.js basePath (if any) when fetching static playlist JSON
    const getBasePath = () => {
      if (typeof window === 'undefined') return '';
      if (window.__NEXT_DATA__ && window.__NEXT_DATA__.basePath) return window.__NEXT_DATA__.basePath;
      if (window.location && window.location.pathname) {
        const parts = window.location.pathname.split('/');
        if (parts.length > 1 && parts[1] === 'lms-system') return '/lms-system';
      }
      return '';
    };
    const basePath = getBasePath();
    data = await fetch(`${basePath}/json/${playlistId}.pschool`);
    data = await data.json();
  } else {
    // data = await getWithoutAuth(`playlist/${playlistId}`);
  }

  if (!data || !data.list) {
    throw new Error("invalid playlist");
  }
  if (!activityId) {
    return data;
  }
  let activity;
  if (activityId.indexOf("_") === -1) {
    activity = data.list.find((item) => item.id === activityId);
  } else {
    let rootId = activityId.substr(0, activityId.indexOf("_"));
    let num = +activityId.substr(activityId.indexOf("_") + 1);
    let fullActivity = data.list.find((item) => item.id === rootId);
    activity = {
      ...fullActivity,
      data: {
        ...fullActivity.commonData,
      },
    };
    if (typeof fullActivity.data[num - 1] === "string") {
      activity.data.text = fullActivity.data[num - 1];
    } else if (Array.isArray(typeof fullActivity.data[num - 1])) {
      activity.data.arr = fullActivity.data[num - 1];
    } else {
      activity.data = { ...activity.data, ...fullActivity.data[num - 1] };
    }
  }
  if (activity) {
    activity = { ...activity };
    delete activity.commonData;
    if (activity.data.refs) {
      activity.data = extractRefs(activity.data, data);
    }
    return activity;
  } else {
    throw new Error("invalid activity");
  }
}

function extractRefs(data, playlist) {
  let refId = data.refs;
  let refData;
  if (refId.indexOf("~") !== -1) {
    const refIndex = +refId.substr(refId.indexOf("~") + 1);
    refId = refId.substr(0, refId.indexOf("~"));
    refData = playlist.defs[refId][refIndex];
  } else {
    refData = playlist.defs[refId];
  }
  if (typeof refData === "string") {
    refData = { text: refData };
  } else if (Array.isArray(refData)) {
    refData = { arr: refData };
  }
  return { ...data, ...refData };
}

export function objToCodeStr(obj) {
  let codeStr = JSON.stringify(obj, null, 2);
  codeStr = codeStr.replaceAll(/"([^"]*?\\n.*)"/gm, (a) => {
    return a.replaceAll('"', "`").replaceAll("\\n", "\n");
    //'`$1`'
  });
  return codeStr;
}

export function codeStrToObj(codeStr) {
  let str = codeStr.replaceAll(/\`((.*?)\n)+?(.*?)\`/g, (str) => {
    str = str.substring(1, str.length - 1);
    str = str.replaceAll("\n", "\\n");
    return `"${str}"`;
  });
  let actData = JSON.parse(str);
  return actData;
}
