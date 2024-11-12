// quiz aur assignment questions

!(function () {
    let e = !1;
    function t(e) {
        return null == e;
    }
    function n(e, t) {
        return chrome.runtime.sendMessage({ ev: e, data: t });
    }
    const r = {
        getQuestionWrapper: () =>
            document.querySelector(
                "textarea[id^='txtQuestion'], div > table > tbody > tr > td > table > tbody > tr > td > div:first-child, div > table p"
            ),
        isMathQuiz: () => r.hasMathJax(r.getQuestionWrapper()),
        parseMathJax(e) {
            e = e.cloneNode(!0);
            Array.from(e.querySelectorAll("script")).forEach((e) => {
                const t = document.createElement("span");
                (t.textContent = r.reconstructLatex(e.textContent)), e.replaceWith(t);
            });
            return (
                Array.from(
                    e.querySelectorAll(".MathJax_Display, .MathJax_Preview, .MathJax")
                ).forEach((e) => e.remove()),
                e.textContent
            );
        },
        isImage: () =>
            document.querySelector("#QImage") instanceof Element ||
            document.querySelector('img[src^="data:image/"]') instanceof Element,
        getImageSrc: () => document.querySelector('img[src^="data:image/"]')?.src,
        hasMathJax: (e) => e?.querySelector(".MathJax_Preview") instanceof Element,
        isLatexString: (e) =>
            ((e) => /\$(.*|\n)+\$/g.test(e))(e) ||
            ((e) => /\\\((.*|\n)+\)/g.test(e))(e) ||
            ((e) => /^\$\$(.*|\n)+?/gi.test(e) && /\$\$$/g.test(e))(e) ||
            ((e) => /^\\\[(.*|\n)+?/gi.test(e) && /\\]$/g.test(e))(e),
        getQuestionText() {
            let e,
                t = Array.from(
                    document.querySelectorAll("textarea[id^='txtQuestion']")
                );
            if (t.length)
                t.filter(
                    (e) => !("none" === e.style.display || "" !== e.style.opacity)
                ).forEach((t) => {
                    void 0 !== t.value && "" !== t.value && (e = t.value.trim());
                });
            else {
                let n = document.querySelector(
                    "div > table > tbody > tr > td > table > tbody > tr > td > div:first-child"
                );
                if ((n || (n = r.getQuestionWrapper()), !n)) return e;
                const i = r.hasMathJax(n);
                t = Array.from(n.querySelectorAll("textarea, p"));
                let o = Array.from(n.children).filter(
                    (e) =>
                        !(
                            "none" === e.style.display ||
                            "" !== e.style.opacity ||
                            !e.firstElementChild ||
                            "" === e.innerText ||
                            null === e.innerText
                        )
                );
                if (
                    ((o = o.map((e) => {
                        if (Array.from(e.children).length > 0) {
                            let t = Array.from(e.children).filter(
                                (e) =>
                                    !(
                                        "none" === e.style.display ||
                                        "" !== e.style.opacity ||
                                        "" === e.innerText ||
                                        null === e.innerText
                                    )
                            );
                            return t.length > 0 ? t[0].textContent.trim() : null;
                        }
                        return "none" !== e.style.display ? e.textContent.trim() : null;
                    })),
                        t.length &&
                        !o.length &&
                        t
                            .filter(
                                (e) => "none" !== e.style.display && "" === e.style.opacity
                            )
                            .forEach((t) => {
                                void 0 !== t.value && "" !== t.value && (e = t.value.trim());
                            }),
                        (e = o.length > 0 ? o[0]?.trim() : e),
                        i)
                ) {
                    const t = n.querySelector(".MathJax_Preview")?.parentElement;
                    e = t
                        ? r.parseMathJax(t)
                        : r.reconstructLatex(n.querySelector("script")?.textContent) ?? e;
                }
            }
            return e;
        },
        reconstructLatex: (e) =>
            "string" != typeof e
                ? e
                : ((e = e.trim()), r.isLatexString(e) ? e : `\\[${e}\\]`),
        getAnswersElement: () =>
            Array.from(
                document.querySelectorAll(
                    "table table table td > div span[id^='lblExpression'], textarea[name^='lblAnswer']"
                )
            ),
        getAnswerText(e) {
            if (!e) return null;
            let t = "value" in e ? e.value.trim() : e.textContent.trim(),
                n = e.querySelector(".MathJax_Preview") instanceof Element;
            if (n) {
                const n = e.querySelector(".MathJax_Preview").parentElement;
                t = r.parseMathJax(n);
            }
            let i = null;
            const o = e.querySelector('img[src^="data:image/"]');
            return (
                o instanceof Element && (i = o.src),
                (t = t?.trim()),
                { text: t, latex: n || r.isLatexString(t), image: i }
            );
        },
        getAnswersText: () =>
            r
                .getAnswersElement()
                .map(r.getAnswerText)
                .filter((e) => void 0 !== e || null !== e),
        getAnswersInput: () =>
            Array.from(
                document.querySelectorAll(
                    "table table table td > span input[id^='radioBtn']"
                )
            ),
        getRelatedAnswerText(e) {
            const t = e.closest("tr");
            return r.getAnswerText(
                t?.querySelector("span[id^='lblExpression'], textarea")
            );
        },
        getSubmitButton: () => document.querySelector("input#btnSave"),
        getCourseElement: () =>
            document.querySelector("#lblCourseCode, #m_lblCourseCode"),
        getCourseText() {
            if (e)
                return window.parent.document
                    .querySelector("#hfCourseCode")
                    .value?.toLowerCase()
                    .trim();
            const t = r.getCourseElement();
            if (!t) return null;
            const [n] = t.textContent.trim().split(" - ");
            return n?.toLowerCase().trim();
        },
        filterCheckedInput: (e) => e.filter((e) => e.checked),
        getTags() {
            if (!e) {
                const e = ["semester"],
                    t = document.querySelector("#lblCourseCode");
                if (t instanceof HTMLElement) {
                    const n = t.textContent.trim();
                    e.push(`extra:${n}`);
                    const r = Array.from(
                        n
                            .toLowerCase()
                            .matchAll(
                                /(?:quiz|quizzes|quizes|quizze)(?:\s|\.|-|_|\(|\[|\{){0,}?(?:no\.?|number|num){0,1}?(?:\s|\.|-|_|\(|\[|\{){0,}?(\d+)/g
                            )
                    );
                    r?.length &&
                        r[0]?.length > 1 &&
                        r[0][1] &&
                        e.push(`quiz ${Number(r[0][1])}`);
                }
                const n = document.querySelector("#lblStartTime");
                if (n instanceof HTMLElement) {
                    const t = n.textContent.trim(),
                        r = t.split(",").at(-1).trim();
                    r?.length && e.push(r), e.push(`extra:${t}`);
                }
                return e;
            }
            return [
                document
                    .querySelector("#lblQuizTitle")
                    ?.textContent.trim()
                    .toLowerCase(),
            ];
        },
        getLession() {
            if (e)
                return window.parent.document
                    .querySelector("#MainContent_lblLessonTitle")
                    ?.textContent.trim();
        },
        isDetailPage: () =>
            !!e && document.querySelector("#divQuizDetail") instanceof Element,
    };
    function i(e) {
        !(function (e) {
            chrome.runtime.onMessage.addListener(e);
        })((t) => {
            "copyQuiz" === t.ev &&
                navigator.clipboard.writeText(
                    `${e.question}\n\n${e.answers.map((e) => e.text).join("\n\n")}`
                );
        });
    }
    function o() {
        const o = r.isMathQuiz(),
            a = r.getQuestionText(),
            l = r.isImage() ? r.getImageSrc() : null,
            s = r.getAnswersText(),
            u = r.getCourseText(),
            c = [...r.getTags()].filter((e) => !t(e)),
            m = [r.getLession()].filter((e) => !t(e)),
            d = r.getSubmitButton();
        a &&
            u &&
            s.length &&
            (i({ question: a, answers: s, subject_id: u }),
                n("storeQuiz", {
                    latex: o,
                    question: a,
                    answers: s,
                    subject_id: u,
                    tags: c,
                    lessons: m,
                    image: l,
                }),
                d?.addEventListener(
                    "click",
                    () => {
                        const t = r
                            .filterCheckedInput(r.getAnswersInput())
                            .map(r.getRelatedAnswerText);
                        t.length &&
                            n("storeAnswer", {
                                question: a,
                                subject_id: u,
                                answer: t.at(0).text,
                                question_image: l,
                                image: t.at(0).image,
                                canForward: !e,
                            });
                    },
                    { once: !0 }
                ));
    }
    function a() {
        if (window.parent && window.parent !== window) {
            if (
                ((e = !0), !window.location.pathname.includes("FAQuizQuestions.aspx"))
            )
                return;
            if (r.isDetailPage()) {
                const e = r.getCourseText(),
                    t = document.querySelectorAll(
                        "#divQuizDetail table tbody tr:not(:first-child)"
                    );
                n(
                    "evaluateQuiz",
                    Array.from(t).map((t) => {
                        const n = t.querySelector("td p").textContent.trim(),
                            r = t.querySelector("td img")?.src,
                            i = t.querySelector("td i.text-success") instanceof Element;
                        return { question: n, image: r, subject_id: e, correct: i };
                    })
                );
            } else o();
        } else {
            if (!window.location.pathname.includes("QuizQuestion.aspx")) return;
            o();
        }
    }
    "complete" === document.readyState
        ? a()
        : window.addEventListener("load", a, { once: !0 });
})();
