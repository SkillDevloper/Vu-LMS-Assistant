import Dixie from "./dexie.js";
const id = chrome.runtime.id,
  ver = chrome.runtime.getManifest().version,
  STATUS = Object.freeze({ PENDING: "pending", COMPLETED: "completed" }),
  db = new Dixie("OurDB");
function getCreatedAt() {
  const e = new Date();
  return `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
}
async function storeQuiz(e) {
  const t = e.image ? createImageHash(e.image) : createHash(e.question),
    i = getCreatedAt(),
    r = await db.quizzes.get({ id: t, subject_id: e.subject_id });
  (r && r.created_at === i) ||
    (db.quizzes.put({
      id: t,
      subject_id: e.subject_id,
      image: e.image,
      is_image: !!e.image,
      status: STATUS.PENDING,
      created_at: i,
    }),
    sendApiRequest("update-quiz", e));
}
async function storeAnswer(e) {
  const t = e.question_image
      ? createImageHash(e.question_image)
      : createHash(e.question),
    i = getCreatedAt();
  db.selectedAnswers.put({
    quiz_id: t,
    question: e.question,
    subject_id: e.subject_id,
    answer: e.answer,
    image: e.image,
    question_image: e.question_image,
    status: STATUS.PENDING,
    created_at: i,
  }),
    e.canForward &&
      sendApiRequest("update-quiz-answer", {
        question: e.question,
        answer: e.answer,
        subject_id: e.subject_id,
        image: e.image,
        question_image: e.question_image,
        verified: !1,
      });
}
function evaluateQuiz(e) {
  e.filter((e) => e.correct).forEach(async (e) => {
    const t = e.image ? createImageHash(e.image) : createHash(e.question),
      i = await db.selectedAnswers
        .where({ quiz_id: t, subject_id: e.subject_id })
        .first();
    i &&
      (db.quizzes
        .where({ id: t, subject_id: e.subject_id })
        .modify({ status: STATUS.COMPLETED }),
      db.selectedAnswers
        .where({ quiz_id: t, subject_id: e.subject_id })
        .modify({ status: STATUS.COMPLETED }),
      sendApiRequest("update-quiz-answer", {
        question: e.question ?? i.question,
        answer: i.answer,
        image: i.image,
        question_image: i.question_image,
        subject_id: e.subject_id,
        verified: !0,
      }));
  });
}
function createImageHash(e) {
  return md5(e);
}
function createHash(e) {
  return md5(
    e.trim().replace(/[\s_\-.,~`\'"!@#$%^&*()\[\]{};:\\\/|+=<>]+/g, "")
  );
}
function sendApiRequest(e, t) {
  fetch("https://vu-db-worker.gptquiz.workers.dev", {
    method: "POST",
    body: JSON.stringify({ api: e, data: t }),
    headers: {
      "Content-Type": "application/json",
      "X-Extension-Id": id,
      "X-Extension-Version": ver,
    },
  });
}
function md5(e) {
  function t(e, t) {
    return (e << t) | (e >>> (32 - t));
  }
  function i(e, t) {
    var i, r, n, s, a;
    return (
      (n = 2147483648 & e),
      (s = 2147483648 & t),
      (a = (1073741823 & e) + (1073741823 & t)),
      (i = 1073741824 & e) & (r = 1073741824 & t)
        ? 2147483648 ^ a ^ n ^ s
        : i | r
        ? 1073741824 & a
          ? 3221225472 ^ a ^ n ^ s
          : 1073741824 ^ a ^ n ^ s
        : a ^ n ^ s
    );
  }
  function r(e, r, n, s, a, u, o) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, i) {
              return (e & t) | (~e & i);
            })(r, n, s),
            a
          ),
          o
        )
      )),
      i(t(e, u), r)
    );
  }
  function n(e, r, n, s, a, u, o) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, i) {
              return (e & i) | (t & ~i);
            })(r, n, s),
            a
          ),
          o
        )
      )),
      i(t(e, u), r)
    );
  }
  function s(e, r, n, s, a, u, o) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, i) {
              return e ^ t ^ i;
            })(r, n, s),
            a
          ),
          o
        )
      )),
      i(t(e, u), r)
    );
  }
  function a(e, r, n, s, a, u, o) {
    return (
      (e = i(
        e,
        i(
          i(
            (function (e, t, i) {
              return t ^ (e | ~i);
            })(r, n, s),
            a
          ),
          o
        )
      )),
      i(t(e, u), r)
    );
  }
  function u(e) {
    var t,
      i = "",
      r = "";
    for (t = 0; 3 >= t; t++)
      i += (r = "0" + ((e >>> (8 * t)) & 255).toString(16)).substr(
        r.length - 2,
        2
      );
    return i;
  }
  var o, d, c, m, g, f, h, _, b, q;
  for (
    q = (function (e) {
      for (
        var t,
          i = e.length,
          r = i + 8,
          n = 16 * ((r - (r % 64)) / 64 + 1),
          s = new Array(n - 1),
          a = 0,
          u = 0;
        i > u;

      )
        (a = (u % 4) * 8),
          (s[(t = (u - (u % 4)) / 4)] = s[t] | (e.charCodeAt(u) << a)),
          u++;
      return (
        (a = (u % 4) * 8),
        (s[(t = (u - (u % 4)) / 4)] = s[t] | (128 << a)),
        (s[n - 2] = i << 3),
        (s[n - 1] = i >>> 29),
        s
      );
    })(
      (e = (function (e) {
        for (var t = "", i = 0; i < e.length; i++) {
          var r = e.charCodeAt(i);
          128 > r
            ? (t += String.fromCharCode(r))
            : r > 127 && 2048 > r
            ? ((t += String.fromCharCode((r >> 6) | 192)),
              (t += String.fromCharCode((63 & r) | 128)))
            : ((t += String.fromCharCode((r >> 12) | 224)),
              (t += String.fromCharCode(((r >> 6) & 63) | 128)),
              (t += String.fromCharCode((63 & r) | 128)));
        }
        return t;
      })(e))
    ),
      f = 1732584193,
      h = 4023233417,
      _ = 2562383102,
      b = 271733878,
      o = 0;
    o < q.length;
    o += 16
  )
    (d = f),
      (c = h),
      (m = _),
      (g = b),
      (f = r(f, h, _, b, q[o + 0], 7, 3614090360)),
      (b = r(b, f, h, _, q[o + 1], 12, 3905402710)),
      (_ = r(_, b, f, h, q[o + 2], 17, 606105819)),
      (h = r(h, _, b, f, q[o + 3], 22, 3250441966)),
      (f = r(f, h, _, b, q[o + 4], 7, 4118548399)),
      (b = r(b, f, h, _, q[o + 5], 12, 1200080426)),
      (_ = r(_, b, f, h, q[o + 6], 17, 2821735955)),
      (h = r(h, _, b, f, q[o + 7], 22, 4249261313)),
      (f = r(f, h, _, b, q[o + 8], 7, 1770035416)),
      (b = r(b, f, h, _, q[o + 9], 12, 2336552879)),
      (_ = r(_, b, f, h, q[o + 10], 17, 4294925233)),
      (h = r(h, _, b, f, q[o + 11], 22, 2304563134)),
      (f = r(f, h, _, b, q[o + 12], 7, 1804603682)),
      (b = r(b, f, h, _, q[o + 13], 12, 4254626195)),
      (_ = r(_, b, f, h, q[o + 14], 17, 2792965006)),
      (f = n(
        f,
        (h = r(h, _, b, f, q[o + 15], 22, 1236535329)),
        _,
        b,
        q[o + 1],
        5,
        4129170786
      )),
      (b = n(b, f, h, _, q[o + 6], 9, 3225465664)),
      (_ = n(_, b, f, h, q[o + 11], 14, 643717713)),
      (h = n(h, _, b, f, q[o + 0], 20, 3921069994)),
      (f = n(f, h, _, b, q[o + 5], 5, 3593408605)),
      (b = n(b, f, h, _, q[o + 10], 9, 38016083)),
      (_ = n(_, b, f, h, q[o + 15], 14, 3634488961)),
      (h = n(h, _, b, f, q[o + 4], 20, 3889429448)),
      (f = n(f, h, _, b, q[o + 9], 5, 568446438)),
      (b = n(b, f, h, _, q[o + 14], 9, 3275163606)),
      (_ = n(_, b, f, h, q[o + 3], 14, 4107603335)),
      (h = n(h, _, b, f, q[o + 8], 20, 1163531501)),
      (f = n(f, h, _, b, q[o + 13], 5, 2850285829)),
      (b = n(b, f, h, _, q[o + 2], 9, 4243563512)),
      (_ = n(_, b, f, h, q[o + 7], 14, 1735328473)),
      (f = s(
        f,
        (h = n(h, _, b, f, q[o + 12], 20, 2368359562)),
        _,
        b,
        q[o + 5],
        4,
        4294588738
      )),
      (b = s(b, f, h, _, q[o + 8], 11, 2272392833)),
      (_ = s(_, b, f, h, q[o + 11], 16, 1839030562)),
      (h = s(h, _, b, f, q[o + 14], 23, 4259657740)),
      (f = s(f, h, _, b, q[o + 1], 4, 2763975236)),
      (b = s(b, f, h, _, q[o + 4], 11, 1272893353)),
      (_ = s(_, b, f, h, q[o + 7], 16, 4139469664)),
      (h = s(h, _, b, f, q[o + 10], 23, 3200236656)),
      (f = s(f, h, _, b, q[o + 13], 4, 681279174)),
      (b = s(b, f, h, _, q[o + 0], 11, 3936430074)),
      (_ = s(_, b, f, h, q[o + 3], 16, 3572445317)),
      (h = s(h, _, b, f, q[o + 6], 23, 76029189)),
      (f = s(f, h, _, b, q[o + 9], 4, 3654602809)),
      (b = s(b, f, h, _, q[o + 12], 11, 3873151461)),
      (_ = s(_, b, f, h, q[o + 15], 16, 530742520)),
      (f = a(
        f,
        (h = s(h, _, b, f, q[o + 2], 23, 3299628645)),
        _,
        b,
        q[o + 0],
        6,
        4096336452
      )),
      (b = a(b, f, h, _, q[o + 7], 10, 1126891415)),
      (_ = a(_, b, f, h, q[o + 14], 15, 2878612391)),
      (h = a(h, _, b, f, q[o + 5], 21, 4237533241)),
      (f = a(f, h, _, b, q[o + 12], 6, 1700485571)),
      (b = a(b, f, h, _, q[o + 3], 10, 2399980690)),
      (_ = a(_, b, f, h, q[o + 10], 15, 4293915773)),
      (h = a(h, _, b, f, q[o + 1], 21, 2240044497)),
      (f = a(f, h, _, b, q[o + 8], 6, 1873313359)),
      (b = a(b, f, h, _, q[o + 15], 10, 4264355552)),
      (_ = a(_, b, f, h, q[o + 6], 15, 2734768916)),
      (h = a(h, _, b, f, q[o + 13], 21, 1309151649)),
      (f = a(f, h, _, b, q[o + 4], 6, 4149444226)),
      (b = a(b, f, h, _, q[o + 11], 10, 3174756917)),
      (_ = a(_, b, f, h, q[o + 2], 15, 718787259)),
      (h = a(h, _, b, f, q[o + 9], 21, 3951481745)),
      (f = i(f, d)),
      (h = i(h, c)),
      (_ = i(_, m)),
      (b = i(b, g));
  return (u(f) + u(h) + u(_) + u(b)).toLowerCase();
}
db
  .version(1)
  .stores({
    quizzes: "&[id+subject_id], status, created_at",
    selectedAnswers: "&[quiz_id+subject_id], status, created_at",
  }),
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      title: "Copy Quiz to Clipboard",
      id: "copyQuiz",
      contexts: ["page", "frame"],
      documentUrlPatterns: ["*://*.vu.edu.pk/*"],
    });
  }),
  chrome.contextMenus.onClicked.addListener((e) => {
    "copyQuiz" === e.menuItemId &&
      chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
        chrome.tabs.sendMessage(e[0].id, { ev: "copyQuiz" });
      });
  }),
  chrome.runtime.onMessage.addListener((e) => {
    if ("string" == typeof e?.ev)
      switch (e.ev) {
        case "storeQuiz":
          storeQuiz(e.data);
          break;
        case "storeAnswer":
          storeAnswer(e.data);
          break;
        case "evaluateQuiz":
          evaluateQuiz(e.data);
      }
  });
