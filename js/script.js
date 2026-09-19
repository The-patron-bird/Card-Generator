let form = document.querySelector("#cardForm");

let inputs = document.querySelectorAll("form input");

let main = document.querySelector("#main");

let main2 = document.querySelector("#main2");

let card;

form.addEventListener("submit", (det) => {

    det.preventDefault();

    // =========================
    // CREATE CARD ELEMENTS
    // =========================

    card = document.createElement("div");
    card.classList.add("card");

    let mstar = document.createElement("div");

    let n1 = document.createElement("h2");
    let n2 = document.createElement("h2");

    let hello = document.createElement("h2");

    let w2 = document.createElement("h3");

    let name = document.createElement("h5");

    let img = document.createElement("img");

    let photo = document.createElement("div");

    let pic = document.createElement("img");


    // =========================
    // APPEND ELEMENTS
    // =========================

    card.append(mstar);
    card.append(n1);
    card.append(n2);
    card.append(hello);
    card.append(w2);
    card.append(name);
    card.append(img);
    card.append(photo);

    photo.append(pic);


    // =========================
    // CARD ELEMENT SETTINGS
    // =========================

    mstar.classList.add("star");

    n1.setAttribute("id", "n1");

    n2.setAttribute("id", "n2");

    hello.textContent = "Hello";

    w2.setAttribute("id", "w2");

    w2.innerHTML = "Its your<br>DIGITAL FOOTPRINT";

    name.setAttribute("id", "name");

    img.setAttribute("id", "star");

    img.setAttribute("src", "./assets/images/star.svg");

    photo.setAttribute("id", "photo");

    pic.setAttribute("id", "pic");


    // =========================
    // USER INPUT
    // =========================

    n1.textContent = inputs[0].value;

    n2.textContent = inputs[1].value;

    name.textContent = inputs[0].value + " " + inputs[1].value;


    // =========================
    // PROFILE IMAGE
    // =========================

    pic.crossOrigin = "anonymous";

    pic.src = inputs[2].value;


    // =========================
    // SHOW CARD
    // =========================

    main2.innerHTML = "";

    main2.append(card);

    main2.insertAdjacentHTML(
        "beforeend",
        `
    <div id="download-status">
        <span id="download-count">10</span>
        <span>Preparing your card...</span>
    </div>
    `
    );

    console.log(card);


    // =========================
    // FORM EXIT ANIMATION
    // =========================

    // Start form exit animation

    main.classList.add("form-exit");


    // Wait for the form to fade out

    setTimeout(() => {

        // Hide form completely

        main.style.display = "none";


        // Show card screen

        main2.style.display = "flex";


        // Smooth card entrance

        requestAnimationFrame(() => {

            main2.classList.add("card-enter");

        });

    }, 350);


    console.log(card);


    // =========================
    // WAIT FOR IMAGE + FONTS
    // =========================

    const generateCardImage = () => {

        document.fonts.ready.then(() => {

            const countElement =
                document.querySelector("#download-count");

            const statusText =
                document.querySelector(
                    "#download-status span:last-child"
                );

            let count = 10;

            countElement.textContent = count;
            statusText.textContent = "Preparing your card...";

            const countdown = setInterval(() => {

                count--;

                countElement.textContent = count;

                if (count <= 0) {

                    clearInterval(countdown);

                    statusText.textContent = "Creating your PNG...";

                    // =========================
                    // GENERATE PNG AFTER COUNTDOWN
                    // =========================

                    htmlToImage.toPng(card, {
                        pixelRatio: 2,
                        cacheBust: true,
                        backgroundColor: null
                    })

                        .then((dataUrl) => {

                            // =========================
                            // CONVERT PNG DATA URL
                            // TO BLOB
                            // =========================

                            const byteString =
                                atob(dataUrl.split(",")[1]);

                            const mimeString =
                                dataUrl
                                    .split(",")[0]
                                    .split(":")[1]
                                    .split(";")[0];

                            const byteArray =
                                new Uint8Array(
                                    byteString.length
                                );

                            for (
                                let i = 0;
                                i < byteString.length;
                                i++
                            ) {
                                byteArray[i] =
                                    byteString.charCodeAt(i);
                            }

                            const blob =
                                new Blob(
                                    [byteArray],
                                    { type: mimeString }
                                );

                            const url =
                                URL.createObjectURL(blob);

                            // =========================
                            // DOWNLOAD
                            // =========================

                            const link =
                                document.createElement("a");

                            link.download = "my-card.png";
                            link.href = url;

                            document.body.appendChild(link);

                            link.click();

                            link.remove();

                            setTimeout(() => {
                                URL.revokeObjectURL(url);
                            }, 1000);

                            // =========================
                            // SUCCESS MESSAGE
                            // =========================

                            countElement.textContent = "✓";

                            statusText.textContent =
                                "Your card is ready!";

                        })

                        .catch((error) => {

                            console.error(
                                "Screenshot error:",
                                error
                            );

                            countElement.textContent = "!";

                            statusText.textContent =
                                "Something went wrong.";

                        });

                }

            }, 1000);

        });

    };


    // =========================
    // IMAGE LOADING HANDLER
    // =========================

    if (pic.complete) {

        // Image already loaded

        generateCardImage();

    } else {

        // Wait until image finishes loading

        pic.onload = () => {

            generateCardImage();

        };

        pic.onerror = () => {

            console.error(
                "Profile image could not be loaded."
            );

            // Still generate the card without
            // waiting forever for the image

            generateCardImage();

        };

    }

});
