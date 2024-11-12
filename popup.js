alert("Please keep in mind that focusing on your studies is very important. Relying too much on shortcuts and tools might affect your learning and growth. Always try to understand the material and do your best.");

function getActiveTab() {
    return chrome.tabs.query({ active: !0, currentWindow: !0 }).then((e) => e[0]);
}
function showMessage(e, t) {
    (e._originalText = e._originalText || e.textContent),
        (e.textContent = t),
        e.setAttribute("disabled", "true"),
        clearTimeout(e._timeout),
        (e._timeout = setTimeout(() => {
            (e.textContent = e._originalText), e.removeAttribute("disabled");
        }, 2e3));
}
(document.getElementById("version-string").textContent =
    chrome.runtime.getManifest().version),
    document
        .getElementById("bypass-video")
        .addEventListener("click", async (e) => {
            const t = await getActiveTab();
            let n = e.currentTarget || e.target;
            if (
                (n.matches("button") || (n = n.closest("button")),
                    !t.url.includes("vulms.vu.edu.pk") ||
                    !t.url.includes("LessonViewer.aspx"))
            )
                return showMessage(n, "Only works on Lesson page.");
            showMessage(n, "In Progress"),
                chrome.scripting
                    .executeScript({
                        target: { tabId: t.id },
                        world: "MAIN",
                        func: function () {
                            return new Promise((e, t) => {
                                const n = $("#hfActiveTab").val().replace("tabHeader", ""),
                                    o = document.querySelector(
                                        `li[data-contentid="tab${n}"]`
                                    ).nextElementSibling,
                                    r = o?.dataset?.contentid?.replace?.("tab", "") ?? "-1",
                                    s = $("#hfIsVideo" + n)?.val();
                                if (!s || "0" == s) return e("Not a video tab");
                                const i = $("#hfContentID" + n).val(),
                                    a = $("#hfIsAvailableOnYoutube" + n).val(),
                                    u = $("#hfIsAvailableOnLocal" + n).val(),
                                    c = $("#hfVideoID" + n).val();
                                let l = "";
                                const d = $("#hfStudentID").val(),
                                    g = $("#hfCourseCode").val(),
                                    p = $("#hfEnrollmentSemester").val(),
                                    f = document
                                        .getElementById("MainContent_lblLessonTitle")
                                        .title.split(":")[0]
                                        .replace("Lesson", "")
                                        .trim();
                                function m(e, t) {
                                    return Math.floor(Math.random() * (t - e + 1) + e);
                                }
                                "True" == a
                                    ? (l = CurrentPlayer.getDuration())
                                    : "True" == u && (l = CurrentLVPlayer.duration);
                                let v = m(120, 180);
                                ("True" != a && "True" != u) ||
                                    (v = m(Number(l) / 3, Number(l) / 2)),
                                    PageMethods.SaveStudentVideoLog(
                                        d,
                                        g,
                                        p,
                                        f,
                                        i,
                                        v,
                                        l,
                                        c,
                                        s,
                                        window.location.href,
                                        function (t) {
                                            UpdateTabStatus(t, n, r), e("Complete");
                                        }
                                    );
                            });
                        },
                    })
                    .then((e) => {
                        "string" == typeof e[0].result && showMessage(n, e[0].result);
                    });
        }),
    document
        .getElementById("allow-events")
        .addEventListener("click", async function (e) {
            let t = e.currentTarget || e.target;
            t.matches("button") || (t = t.closest("button")),
                showMessage(t, "In Progress"),
                chrome.scripting
                    .executeScript({
                        target: { tabId: (await getActiveTab()).id, allFrames: !0 },
                        world: "MAIN",
                        func: function () {
                            if (
                                "function" != typeof window.Node?.prototype?._getEventListeners
                            )
                                return "Not supported";
                            !(function (e) {
                                "function" == typeof e.Element.prototype._getEventListeners &&
                                    (function () {
                                        const t = e.Array.prototype.slice.call(
                                            e.document.querySelectorAll("*")
                                        );
                                        t.push(e.document), t.push(e);
                                        const n = [
                                            "copy",
                                            "paste",
                                            "cut",
                                            "contextmenu",
                                            "keyup",
                                            "keypress",
                                            "keydown",
                                            "auxclick",
                                        ];
                                        let o = [];
                                        for (const e of t) {
                                            if ("function" != typeof e._getEventListeners) continue;
                                            const t = e._getEventListeners();
                                            for (const e in t) {
                                                if (!n.includes(e)) continue;
                                                const r = t[e];
                                                for (const e of r) o.push(e.controller);
                                            }
                                        }
                                        return o;
                                    })().forEach((e) => {
                                        e.abort();
                                    });
                            })(window);
                        },
                    })
                    .then((e) => {
                        const n = e.every((e) => "string" == typeof e.result);
                        showMessage(
                            t,
                            n
                                ? "Not supported on this page."
                                : "Done! You can now copy, paste."
                        );
                    });
        }),
    getActiveTab().then((e) => {
        "string" == typeof e.url &&
            e.url.includes("vulms.vu.edu.pk") &&
            e.url.includes("GDB/StudentMessage.aspx") &&
            document.getElementById("gdb-copy-paste").classList.remove("hidden");
    });




// ++++++++++++++++++++++++++++++++++

// Show user Image or name id
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve and display user image, student name, and ID
    chrome.storage.local.get(['imageUrl', 'studentName', 'studentId'], function (result) {
        // Update the user image
        const userImage = document.getElementById('userImage');
        userImage.src = result.imageUrl || 'DefaultImage.jpg'; // Use a default image if none found

        // Update the student name and ID
        document.getElementById('StName').innerText = result.studentName || 'Not Found';
        document.getElementById('StId').innerText = result.studentId || 'Not Found';
    });
});
