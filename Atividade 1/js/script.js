// Atualiza o relógio
function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Atualiza a data
function updateDate() {
    const dateElement = document.getElementById("date");
    const now = new Date();

    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("pt-BR", options);

    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    dateElement.textContent = capitalizedDate;
}

// Alternar tema
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    const icon = document.getElementById("themeIcon");
    const gif = document.getElementById("themeGif");

    if (document.body.classList.contains("dark-mode")) {
        icon.src = "img/sol.jpg";
    } else {
        icon.src = "img/lua.jpg";
    }

    // Mostra o gif por 1 segundo
    gif.style.display = "block";
    setTimeout(() => {
        gif.style.display = "none";
    }, 5000);
});

// Atualização automática
setInterval(updateClock, 1000);
updateClock();
updateDate();