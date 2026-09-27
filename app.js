const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const settingsBtn = document.getElementById("settingsBtn");
const toolsBtn = document.getElementById("toolsBtn");
const voiceBtn = document.getElementById("voiceBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");

const settingsModal = document.getElementById("settingsModal");
const toolsModal = document.getElementById("toolsModal");

const backendUrl = document.getElementById("backendUrl");
const language = document.getElementById("language");

const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const themeBtn = document.getElementById("themeBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const exportChatBtn = document.getElementById("exportChatBtn");

const CHAT_STORAGE = "AI_Mehrob_Chat";
const BACKEND_STORAGE = "AI_Mehrob_Backend";
const LANGUAGE_STORAGE = "AI_Mehrob_Language";
const THEME_STORAGE = "AI_Mehrob_Theme";

let messages = [];

function saveMessages() {
    localStorage.setItem(
        CHAT_STORAGE,
        JSON.stringify(messages)
    );
}

function loadMessages() {
    const saved = localStorage.getItem(CHAT_STORAGE);

    if (!saved) return;

    try {
        messages = JSON.parse(saved);

        messages.forEach(message => {
            addMessageToScreen(
                message.role,
                message.content
            );
        });
    } catch {
        messages = [];
    }
}

function addMessageToScreen(role, text) {
    const div = document.createElement("div");

    div.className =
        role === "user"
            ? "message user-message"
            : "message ai-message";

    div.textContent = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

function addMessage(role, content) {
    messages.push({
        role,
        content
    });

    addMessageToScreen(role, content);

    saveMessages();
}

function showTyping() {
    const div = document.createElement("div");

    div.id = "typing";
    div.className = "message ai-message";

    div.textContent = "AI.Mehrob менависад...";

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing");

    if (typing) {
        typing.remove();
    }
}

function localAI(text) {
    const message = text.toLowerCase();

    if (
        message.includes("салом") ||
        message.includes("hello") ||
        message.includes("hi")
    ) {
        return "Салом! 👋 Ман AI.Mehrob ҳастам. Чӣ кӯмак лозим?";
    }

    if (
        message.includes("c#") ||
        message.includes("programming") ||
        message.includes("програм")
    ) {
        return "Албатта. Ман метавонам дар C#, ASP.NET Core, HTML, CSS, JavaScript ва SQL ба ту кӯмак кунам.";
    }

    if (
        message.includes("sql") ||
        message.includes("database")
    ) {
        return "SQL барои кор бо database истифода мешавад. Агар хоҳӣ, ман метавонам SELECT, INSERT, UPDATE, DELETE ва JOIN-ро омӯзонам.";
    }

    if (
        message.includes("html") ||
        message.includes("css") ||
        message.includes("javascript")
    ) {
        return "Ман метавонам барои сохтани website бо HTML, CSS ва JavaScript ба ту код нависам.";
    }

    if (
        message.includes("iphone") ||
        message.includes("ios")
    ) {
        return "Барои iOS development одатан Swift ва SwiftUI истифода мешаванд.";
    }

    return "Ман ҳоло дар Demo Mode ҳастам. Барои ҷавобҳои воқеии AI, Backend-и AI.Mehrob-ро пайваст кардан лозим мешавад.";
}

async function sendMessage() {
    const text = input.value.trim();

    if (!text) return;

    input.value = "";

    input.style.height = "auto";

    addMessage("user", text);

    showTyping();

    const url =
        localStorage.getItem(BACKEND_STORAGE);

    try {
        if (!url) {
            await new Promise(resolve =>
                setTimeout(resolve, 700)
            );

            removeTyping();

            addMessage(
                "assistant",
                localAI(text)
            );

            return;
        }

        const response = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text,
                messages: messages,
                language:
                    language?.value || "tg"
            })
        });

        if (!response.ok) {
            throw new Error(
                "Backend error: " +
                response.status
            );
        }

        const data =
            await response.json();

        removeTyping();

        addMessage(
            "assistant",
            data.answer ||
            "AI ҷавоб надод."
        );

    } catch (error) {
        removeTyping();

        addMessage(
            "assistant",
            "❌ Backend пайваст нашуд. URL ва server-ро санҷ."
        );

        console.error(error);
    }
}

sendBtn?.addEventListener(
    "click",
    sendMessage
);

input?.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    }
);

input?.addEventListener(
    "input",
    () => {
        input.style.height = "auto";
        input.style.height =
            input.scrollHeight + "px";
    }
);

newChatBtn?.addEventListener(
    "click",
    () => {
        messages = [];

        localStorage.removeItem(
            CHAT_STORAGE
        );

        chat.innerHTML = "";
    }
);

settingsBtn?.addEventListener(
    "click",
    () => {
        if (backendUrl) {
            backendUrl.value =
                localStorage.getItem(
                    BACKEND_STORAGE
                ) || "";
        }

        if (language) {
            language.value =
                localStorage.getItem(
                    LANGUAGE_STORAGE
                ) || "tg";
        }

        settingsModal?.classList.add(
            "show"
        );
    }
);

toolsBtn?.addEventListener(
    "click",
    () => {
        toolsModal?.classList.add(
            "show"
        );
    }
);

saveSettingsBtn?.addEventListener(
    "click",
    () => {
        if (backendUrl) {
            localStorage.setItem(
                BACKEND_STORAGE,
                backendUrl.value.trim()
            );
        }

        if (language) {
            localStorage.setItem(
                LANGUAGE_STORAGE,
                language.value
            );
        }

        settingsModal?.classList.remove(
            "show"
        );
    }
);

themeBtn?.addEventListener(
    "click",
    () => {
        document.body.classList.toggle(
            "light"
        );

        const theme =
            document.body.classList.contains(
                "light"
            )
                ? "light"
                : "dark";

        localStorage.setItem(
            THEME_STORAGE,
            theme
        );
    }
);

clearChatBtn?.addEventListener(
    "click",
    () => {
        messages = [];

        localStorage.removeItem(
            CHAT_STORAGE
        );

        chat.innerHTML = "";
    }
);

exportChatBtn?.addEventListener(
    "click",
    () => {
        const text =
            messages
                .map(message => {
                    const name =
                        message.role === "user"
                            ? "You"
                            : "AI.Mehrob";

                    return (
                        name +
                        ": " +
                        message.content
                    );
                })
                .join("\n\n");

        const blob = new Blob(
            [text],
            {
                type: "text/plain"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download =
            "AI.Mehrob-chat.txt";

        a.click();

        URL.revokeObjectURL(url);
    }
);

fileBtn?.addEventListener(
    "click",
    () => {
        fileInput?.click();
    }
);

fileInput?.addEventListener(
    "change",
    () => {
        const file =
            fileInput.files?.[0];

        if (!file) return;

        input.value +=
            `[Файл: ${file.name}]`;

        input.dispatchEvent(
            new Event("input")
        );
    }
);

voiceBtn?.addEventListener(
    "click",
    () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Voice recognition дар ин browser дастгирӣ намешавад."
            );

            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.lang = "tg-TJ";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult =
            event => {
                const result =
                    event.results[0][0]
                        .transcript;

                input.value =
                    result;

                input.dispatchEvent(
                    new Event("input")
                );
            };

        recognition.onerror =
            () => {
                alert(
                    "Voice recognition кор накард."
                );
            };

        recognition.start();
    }
);

document.addEventListener(
    "click",
    event => {
        if (
            event.target ===
            settingsModal
        ) {
            settingsModal.classList.remove(
                "show"
            );
        }

        if (
            event.target ===
            toolsModal
        ) {
            toolsModal.classList.remove(
                "show"
            );
        }
    }
);

document.querySelectorAll(
    ".suggestion"
).forEach(button => {
    button.addEventListener(
        "click",
        () => {
            input.value =
                button.textContent.trim();

            input.dispatchEvent(
                new Event("input")
            );

            input.focus();
        }
    );
});

document.querySelectorAll(
    ".tool-button"
).forEach(button => {
    button.addEventListener(
        "click",
        () => {
            const tool =
                button.dataset.tool ||
                button.textContent.trim();

            input.value =
                `Ба ман дар ${tool} кӯмак кун.`;

            toolsModal?.classList.remove(
                "show"
            );

            input.focus();
        }
    );
});

const savedTheme =
    localStorage.getItem(
        THEME_STORAGE
    );

if (savedTheme === "light") {
    document.body.classList.add(
        "light"
    );
}

loadMessages();