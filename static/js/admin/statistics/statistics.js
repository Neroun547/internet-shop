const dateFromInput = document.getElementById("date-from-input");
const dateToInput = document.getElementById("date-to-input");
const svg = document.getElementById("svg");
const svgWidth = Number(svg.getAttribute("width"));

const lengthForYLine = 1240;
const lengthForXLine = 630;

if(dateToInput.value && dateFromInput.value) {
    fetch("/admin/statistics/data?date_from=" + dateFromInput.value + "&" + "date_to=" + dateToInput.value)
        .then((res) => {
            return res.json();
        })
        .then(async (data) => {
            for(let i = 0; i < data.length; i++) {
                data[i].statsUsers = await calculatePercentUsers(data[i].users);
            }
            drawStats(data);
        });
}

dateFromInput.addEventListener("change", async function (e) {

    if(dateToInput.value) {
        const api = await fetch("/admin/statistics/data?date_from=" + e.target.value + "&" + "date_to=" + dateToInput.value);
        const res = await api.json();

        for(let i = 0; i < res.length; i++) {
            res[i].statsUsers = await calculatePercentUsers(res[i].users);
        }
        drawStats(res);
    }
});

dateToInput.addEventListener("change", async function (e) {

    if(dateFromInput.value) {
        const api = await fetch("/admin/statistics/data?date_from=" + dateFromInput.value + "&" + "date_to=" + e.target.value);
        const res = await api.json();

        for(let i = 0; i < res.length; i++) {
            res[i].statsUsers = await calculatePercentUsers(res[i].users);
        }
        drawStats(res);
    }
});

function drawStats(data) {
    clearStats();
    drawTimes(data);

    const { intervalLinesForX, intervalLinesForY } = drawLines(getCountLines(data), data.length);
    const maxVisits = getMaxValueFromStatisticsData(data);
    const minVisits = getMinValueFromStatisticsData(data);

    drawMinAndMaxVisits(minVisits, maxVisits, intervalLinesForX, intervalLinesForY, getCountLines(data));

    let posX = 65;
    let height;

    for(let i = 0; i < data.length; i++) {
        height = (data[i].countVisits / maxVisits) * 629;
        const rect = drawRectangle(posX, (629 - height) + 30, intervalLinesForY - 10, height, "#456dff");

        rect.setAttribute("index", i);

        rect.addEventListener("mousemove", function (e) {
            const index = e.target.attributes[6].value;
            showModal(
                data[index].dateFrom,
                data[index].dateTo,
                data[index].countVisits,
                data[index].statsUsers,
                e.target.x.baseVal.value,
                e.target.y.baseVal.value + 20
            );
        });
        window.addEventListener("mousemove", function (e) {

            if (e.target.className.baseVal !== "stats-item" && e.target.className.baseVal !== "modal-item") {
                deleteModal();
            }
        });
        posX += intervalLinesForY;
    }


}

function drawMinAndMaxVisits(min, max, intervalForX, intervalForY, countLines) {
    const textZero = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textZero.setAttribute("x", 20);
    textZero.setAttribute("y", 660);
    textZero.setAttribute("class", "stats-item");
    textZero.setAttribute("fill", "white");
    textZero.innerHTML = "0";

    const textMax = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textMax.setAttribute("x", 20);
    textMax.setAttribute("y", 30);
    textMax.setAttribute("class", "stats-item");
    textMax.setAttribute("fill", "white");
    textMax.innerHTML = String(max);

    svg.appendChild(textZero);
    svg.appendChild(textMax);

    let textValue = max;
    let cordText = 30 + intervalForX;

    for(let i = 1; i <= countLines - 1; i++) {
        textValue -= (max * (1 / (countLines)));
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.setAttribute("x", 20);
        text.setAttribute("y", cordText);
        text.setAttribute("class", "stats-item");
        text.setAttribute("fill", "white");
        text.innerHTML = textValue.toFixed(1);

        svg.appendChild(text);

        cordText += intervalForX;
    }
}

function drawRectangle(x, y, width, height, backgroundColor="white") {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", backgroundColor);

    rect.setAttribute("class", "stats-item");

    svg.appendChild(rect);

    return rect;
}

function getMaxValueFromStatisticsData(data) {
    let max = data[0].countVisits;

    for(let i = 1; i < data.length; i++) {
        if(data[i].countVisits > max) {
            max = data[i].countVisits;
        }
    }
    return max;
}

function getMinValueFromStatisticsData(data) {
    let min = data[0].countVisits;

    for(let i = 1; i < data.length; i++) {
        if(data[i].countVisits < min) {
            min = data[i].countVisits;
        }
    }
    return min;
}

function drawLines(countX, countY) {
    const intervalLinesForX = lengthForXLine / countX;
    const intervalLinesForY = lengthForYLine / countY;

    let posY = 30;
    let posX = 60;

    for(let i = 0; i < countX; i++) {
        const lineX = document.createElementNS("http://www.w3.org/2000/svg", "line");

        lineX.setAttribute("x1", 60);
        lineX.setAttribute("x2", 1300);

        lineX.setAttribute("y1", posY);
        lineX.setAttribute("y2", posY);

        lineX.setAttribute("stroke-width", "1");

        lineX.setAttribute("stroke", "#525252")

        lineX.setAttribute("class", "stats-item");

        svg.appendChild(lineX);

        posY += intervalLinesForX;
    }

    for(let i = 0; i < countY; i++) {
        const lineY = document.createElementNS("http://www.w3.org/2000/svg", "line");

        lineY.setAttribute("x1", posX);
        lineY.setAttribute("x2", posX);

        lineY.setAttribute("y1", 30);
        lineY.setAttribute("y2", 660);

        lineY.setAttribute("stroke-width", "1");

        lineY.setAttribute("stroke", "#525252");

        lineY.setAttribute("class", "stats-item");

        svg.appendChild(lineY);

        posX += intervalLinesForY;
    }

    return { intervalLinesForX, intervalLinesForY };
}

function drawTimes(data) {
    const interval = lengthForYLine / data.length;
    let posX = 30;

    for(let i = 0; i < data.length; i++) {

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.setAttribute("x", posX);
        text.setAttribute("y", 690);
        text.setAttribute("class", "stats-item");
        text.setAttribute("fill", "white");
        text.style.fontSize = "10px";
        text.innerHTML = data[i].dateFrom;

        svg.appendChild(text);

        posX += interval;
    }
}

function getCountLines(data) {
    const parseData = [];

    for(let i = 0; i < data.length; i++) {
        if(!parseData.find(el => el === data[i].countVisits)) {
            parseData.push(data[i].countVisits);
        }
    }

    return parseData.length;
}

function clearStats() {
    const items = document.querySelectorAll(".stats-item");

    if(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].remove();
        }
    }
}

function showModal(dateFrom, dateTo, countVisits, statsUsers, cordX, cordY) {
    deleteModal();

    const textDateFrom = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textDateFrom.setAttribute("fill", "black");
    textDateFrom.setAttribute("x", cordX + 20);
    textDateFrom.setAttribute("y", cordY + 30);
    textDateFrom.setAttribute("font-size", "14");
    textDateFrom.setAttribute("class", "modal-item");

    textDateFrom.innerHTML = "Від: " + dateFrom;

    const textDateTo = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textDateTo.setAttribute("fill", "black");
    textDateTo.setAttribute("x", cordX + 20);
    textDateTo.setAttribute("y", cordY + 50);
    textDateTo.setAttribute("font-size", "14");
    textDateTo.setAttribute("class", "modal-item");

    textDateTo.innerHTML = "До: " + dateTo;

    const textVisits = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textVisits.setAttribute("fill", "black");
    textVisits.setAttribute("x", cordX + 20);
    textVisits.setAttribute("y", cordY + 70);
    textVisits.setAttribute("font-size", "14");
    textVisits.setAttribute("class", "modal-item");

    textVisits.innerHTML = "Кількість відвідувань: " + countVisits;

    let cordYPercentText = cordY + 70;
    let heightModal = 120;

    for(let key in statsUsers) {
        heightModal += 20;
    }

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", cordX);
    rect.setAttribute("y", cordY);
    rect.setAttribute("width", "230");
    rect.setAttribute("height", heightModal);
    rect.setAttribute("fill", "#f5f5f5");
    rect.setAttribute("rx", "10");
    rect.setAttribute("class", "modal-item");

    svg.appendChild(rect);

    for(let key in statsUsers) {
        cordYPercentText += 20;

        const textPercent = document.createElementNS("http://www.w3.org/2000/svg", "text");

        textPercent.setAttribute("fill", "black");
        textPercent.setAttribute("x", cordX + 40);
        textPercent.setAttribute("y", cordYPercentText);
        textPercent.setAttribute("font-size", "14");
        textPercent.setAttribute("class", "modal-item");

        textPercent.innerHTML = key + ": " + statsUsers[key] + "%";

        const imageFlag = document.createElementNS("http://www.w3.org/2000/svg", "image");

        imageFlag.setAttribute("href", `https://flagsapi.com/${key}/flat/16.png`);

        imageFlag.setAttribute("x", cordX+20);
        imageFlag.setAttribute("y", cordYPercentText-12);
        imageFlag.setAttribute("class", "modal-item");

        svg.appendChild(textPercent);
        svg.appendChild(imageFlag);
    }

    svg.appendChild(textDateFrom);
    svg.appendChild(textDateTo);
    svg.appendChild(textVisits);
}

function deleteModal() {
    const modalItems = document.querySelectorAll(".modal-item");

    if(modalItems) {
        for(let i = 0; i < modalItems.length; i++) {
            modalItems[i].remove();
        }
    }
}

async function calculatePercentUsers(users) {
    const statsObject = {};
    let sumAllUsers = 0;

    for(let i = 0; i < users.length; i++) {
        const api = await fetch("http://ip-api.com/json/" + users[i].user.replace("::ffff:", ""));
        const data = await api.json();

        if(statsObject[data.countryCode]) {
            statsObject[data.countryCode] += 1;
            sumAllUsers += 1;
        } else {
            statsObject[data.countryCode] = 1;
            sumAllUsers += 1;
        }
    }
    for(let key in statsObject) {
        statsObject[key] = (statsObject[key] / sumAllUsers) * 100;
    }

    return statsObject;
}
