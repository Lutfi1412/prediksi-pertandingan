import "./style.css";


const jsonFiles =
import.meta.glob(
    "./data/*.json"
);


const app =
document.getElementById(
    "app"
);


let files = Object.keys(jsonFiles)
.map(path => path.split("/").pop())
.sort();


function beautifyFilename(filename){

    return filename
    .replace(".json","")
    .replaceAll("_"," ")
    .replace(/\b\w/g,
        char => char.toUpperCase()
    );

}


function renderHome(){

    const options = files
    .map(file => `
        <option value="${file}">
            ${beautifyFilename(file)}
        </option>
    `)
    .join("");


    app.innerHTML = `

    <div class="hero-card">

        <div class="hero-icon">
            ⚽
        </div>

        <h1>
            AI Match Prediction
        </h1>

        <p>
            Pilih pertandingan untuk melihat hasil prediksi
        </p>

        <select
            id="matchSelect"
            class="form-select custom-select"
        >

            <option value="">
                Pilih Pertandingan
            </option>

            ${options}

        </select>

    </div>

    `;


    document
    .getElementById("matchSelect")
    .addEventListener(
        "change",
        async (e)=>{

            if(!e.target.value) return;

            await renderMatch(
                e.target.value
            );

        }
    );

}


async function loadPrediction(file){

    const module =
    await jsonFiles[
        `./data/${file}`
    ]();

    return module.default;

}


async function renderMatch(selectedFile){

    const data =
    await loadPrediction(
        selectedFile
    );


    const options =
    files.map(file=>`

    <option
        value="${file}"
        ${selectedFile === file
            ? "selected"
            : ""
        }
    >

        ${beautifyFilename(file)}

    </option>

    `)
    .join("");


    const scoreHTML =
    data.prediksi_skor
    .map(item=>`

    <div class="prediction-box">

        <div class="score">

            ${item.prediksi}

        </div>

        <div class="progress mb-3">

            <div
                class="progress-bar"
                style="
                width:
                ${item.akurasi.replace("%","")}%;
                "
            >

                ${item.akurasi}

            </div>

        </div>

        <p class="text-center">

            ${item.keterangan}

        </p>

    </div>

    `)
    .join("");


    const eventHTML =
    data.prediksi_pertandingan
    .map(item=>`

    <div
        class="event-card"
        data-accuracy="
        ${item.akurasi.replace("%","")}
        "
    >

        <div class="event-title">

            ${item.prediksi}

        </div>

        <div class="progress mb-3">

            <div
                class="
                progress-bar
                bg-success
                "
                style="
                width:
                ${item.akurasi.replace("%","")}%;
                "
            >

                ${item.akurasi}

            </div>

        </div>

        <div>

            ${item.keterangan}

        </div>

    </div>

    `)
    .join("");


    app.innerHTML = `

    <div class="top-select">

        <select
            id="matchSelect"
            class="form-select"
        >

            ${options}

        </select>

    </div>


    <div class="match-header">

        <h1>

            ${beautifyFilename(
                selectedFile
            )}

        </h1>

        <p>
            Hasil prediksi pertandingan berbasis AI
        </p>

    </div>


    <div class="section-title">

        Top Prediksi Skor

    </div>


    <div class="prediction-grid">

        ${scoreHTML}

    </div>


    <div class="prediction-header">

        <div class="section-title mb-0">

            Prediksi Pertandingan

        </div>


        <select
            id="sortAccuracy"
            class="
            form-select
            sort-select
            "
        >

            <option value="desc">

                Akurasi Tertinggi

            </option>

            <option value="asc">

                Akurasi Terendah

            </option>

        </select>

    </div>


    <div
        class="event-grid"
        id="eventGrid"
    >

        ${eventHTML}

    </div>

    `;


    document
    .getElementById("matchSelect")
    .addEventListener(
        "change",
        async (e)=>{

            await renderMatch(
                e.target.value
            );

        }
    );


    const sortSelect =
    document.getElementById(
        "sortAccuracy"
    );


    sortSelect.addEventListener(
        "change",
        sortCards
    );


    sortCards();

}


function sortCards(){

    const sortSelect =
    document.getElementById(
        "sortAccuracy"
    );

    const grid =
    document.getElementById(
        "eventGrid"
    );

    const cards =
    Array.from(
        grid.querySelectorAll(
            ".event-card"
        )
    );

    const mode =
    sortSelect.value;


    cards.sort(
        (a,b)=>{

            const accA =
            parseFloat(
                a.dataset.accuracy
            );

            const accB =
            parseFloat(
                b.dataset.accuracy
            );

            return mode === "desc"
                ? accB - accA
                : accA - accB;

        }
    );


    cards.forEach(
        card =>
        grid.appendChild(card)
    );

}


renderHome();