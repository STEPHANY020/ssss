/* =====================================================
   BIBLIOTECA
   Sistema completo de libros
===================================================== */


let libros = JSON.parse(
    localStorage.getItem("bibliotecaLibros")
) || [];


let libroActual = {
    titulo: "",
    autor: "",
    fraseGeneral: "",
    fraseInicial: "",
    sinopsis: "",
    logo: "",
    capitulos: []
};


/* =====================================================
   NAVEGACIÓN
===================================================== */

function mostrarSeccion(nombre) {

    document.querySelectorAll(".seccion")
        .forEach(seccion => {
            seccion.classList.remove("activa");
        });

    document.getElementById(nombre)
        .classList.add("activa");


    document.querySelectorAll(".menu")
        .forEach(menu => {
            menu.classList.remove("active");
        });


    const menu = [...document.querySelectorAll(".menu")]
        .find(m => m.getAttribute("onclick")?.includes(nombre));

    if (menu) {
        menu.classList.add("active");
    }


    const nombres = {
        inicio: "Inicio",
        crear: "Crear libro",
        libros: "Mis libros",
        proceso: "Proceso de libro",
        chat: "Chat con IA"
    };


    document.getElementById("tituloPagina")
        .textContent = nombres[nombre];


    if (nombre === "libros") {
        mostrarLibros();
    }

    if (nombre === "proceso") {
        mostrarProceso();
    }

}


/* =====================================================
   NUEVO LIBRO
===================================================== */

function nuevoLibro() {

    libroActual = {
        titulo: "",
        autor: "",
        fraseGeneral: "",
        fraseInicial: "",
        sinopsis: "",
        logo: "",
        capitulos: []
    };


    document.getElementById("tituloLibro").value = "";
    document.getElementById("autorLibro").value = "";
    document.getElementById("fraseGeneral").value = "";
    document.getElementById("fraseInicial").value = "";
    document.getElementById("sinopsisLibro").value = "";


    document.getElementById("logoPreview")
        .style.backgroundImage = "";


    document.getElementById("listaCapitulos")
        .innerHTML = "";


    mostrarSeccion("crear");


    crearCapitulo();

}


/* =====================================================
   LOGO
===================================================== */

document
    .getElementById("logoInput")
    .addEventListener("change", function(e) {

        const archivo = e.target.files[0];

        if (!archivo) return;


        const lector = new FileReader();


        lector.onload = function(event) {

            libroActual.logo = event.target.result;


            document.getElementById("logoPreview")
                .style.backgroundImage =
                `url("${event.target.result}")`;

        };


        lector.readAsDataURL(archivo);

    });


/* =====================================================
   CREAR CAPÍTULO
===================================================== */

function crearCapitulo() {

    const numero =
        libroActual.capitulos.length + 1;


    libroActual.capitulos.push({

        id: Date.now(),

        titulo: `Capítulo ${numero}`,

        contenido: "",

        guardado: false

    });


    mostrarCapitulos();

}


/* =====================================================
   MOSTRAR CAPÍTULOS
===================================================== */

function mostrarCapitulos() {

    const contenedor =
        document.getElementById("listaCapitulos");


    contenedor.innerHTML = "";


    libroActual.capitulos.forEach(
        (capitulo, indice) => {


        const div =
            document.createElement("div");


        div.className = "capitulo";


        div.innerHTML = `

            <div class="capitulo-header">

                <div class="numero-capitulo">
                    ${indice + 1}
                </div>

                <input
                    class="titulo-capitulo"
                    value="${escapeHTML(capitulo.titulo)}"
                    onchange="cambiarTituloCapitulo(${indice}, this.value)"
                >

                <button
                    class="eliminar-capitulo"
                    onclick="eliminarCapitulo(${indice})">

                    Eliminar

                </button>

            </div>


            <div class="editor-capitulo">

                <div class="toolbar">

                    <button
                        onclick="ejecutarComando('bold')">

                        <b>N</b>

                    </button>


                    <button
                        onclick="ejecutarComando('italic')">

                        <i>C</i>

                    </button>


                    <button
                        onclick="ejecutarComando('underline')">

                        <u>S</u>

                    </button>


                    <select
                        onchange="cambiarFuente(this.value)">

                        <option value="Times New Roman">
                            Times New Roman
                        </option>

                        <option value="Arial">
                            Arial
                        </option>

                        <option value="Georgia">
                            Georgia
                        </option>

                        <option value="Garamond">
                            Garamond
                        </option>

                    </select>


                    <select
                        onchange="cambiarTamano(this.value)">

                        <option value="12">
                            12 pt
                        </option>

                        <option value="10">
                            10 pt
                        </option>

                        <option value="14">
                            14 pt
                        </option>

                        <option value="16">
                            16 pt
                        </option>

                        <option value="18">
                            18 pt
                        </option>

                        <option value="24">
                            24 pt
                        </option>

                    </select>


                    <button
                        onclick="ejecutarComando('justifyLeft')">

                        Izquierda

                    </button>


                    <button
                        onclick="ejecutarComando('justifyCenter')">

                        Centro

                    </button>


                    <button
                        onclick="ejecutarComando('justifyRight')">

                        Derecha

                    </button>


                    <button
                        onclick="ejecutarComando('justifyFull')">

                        Justificar

                    </button>


                    <button
                        onclick="ejecutarComando('insertUnorderedList')">

                        • Lista

                    </button>

                </div>


                <div
                    id="editor-${capitulo.id}"
                    class="area-escritura"
                    contenteditable="true"
                    oninput="guardarContenidoCapitulo(${indice}, this.innerHTML)"
                >
                    ${capitulo.contenido}
                </div>


                <div class="final-capitulo">

                    <span class="guardado">

                        ${
                            capitulo.guardado
                            ? "✓ Capítulo guardado"
                            : "Capítulo sin guardar"
                        }

                    </span>


                    <button
                        class="btn-secundario"
                        onclick="guardarCapitulo(${indice})">

                        Guardar capítulo

                    </button>

                </div>

            </div>

        `;


        contenedor.appendChild(div);

    });

}


/* =====================================================
   EDITOR
===================================================== */

function ejecutarComando(comando) {

    document.execCommand(
        comando,
        false,
        null
    );

}


function cambiarFuente(fuente) {

    document.execCommand(
        "fontName",
        false,
        fuente
    );

}


function cambiarTamano(tamano) {

    document.execCommand(
        "fontSize",
        false,
        "7"
    );


    document
        .querySelectorAll(".area-escritura")
        .forEach(editor => {

            if (document.activeElement === editor) {

                editor.style.fontSize =
                    `${tamano}pt`;

            }

        });

}


/* =====================================================
   CAPÍTULOS
===================================================== */

function cambiarTituloCapitulo(indice, titulo) {

    libroActual.capitulos[indice].titulo =
        titulo;

}


function guardarContenidoCapitulo(indice, contenido) {

    libroActual.capitulos[indice].contenido =
        contenido;

}


function guardarCapitulo(indice) {

    libroActual.capitulos[indice].guardado =
        true;


    mostrarCapitulos();


    alert(
        `✓ ${libroActual.capitulos[indice].titulo} guardado correctamente`
    );

}


function eliminarCapitulo(indice) {

    if (
        !confirm(
            "¿Quieres eliminar este capítulo?"
        )
    ) {
        return;
    }


    libroActual.capitulos.splice(
        indice,
        1
    );


    libroActual.capitulos
        .forEach((capitulo, i) => {

            if (
                !capitulo.titulo ||
                /^Capítulo \d+$/.test(
                    capitulo.titulo
                )
            ) {

                capitulo.titulo =
                    `Capítulo ${i + 1}`;

            }

        });


    mostrarCapitulos();

}


/* =====================================================
   GUARDAR LIBRO
===================================================== */

function guardarLibro() {

    libroActual.titulo =
        document.getElementById(
            "tituloLibro"
        ).value.trim();


    libroActual.autor =
        document.getElementById(
            "autorLibro"
        ).value.trim();


    libroActual.fraseGeneral =
        document.getElementById(
            "fraseGeneral"
        ).value.trim();


    libroActual.fraseInicial =
        document.getElementById(
            "fraseInicial"
        ).value.trim();


    libroActual.sinopsis =
        document.getElementById(
            "sinopsisLibro"
        ).value.trim();


    if (!libroActual.titulo) {

        alert(
            "Debes colocar un título para el libro."
        );

        return;

    }


    const libro = {

        ...libroActual,

        id:
            "libro-" +
            Date.now(),

        fecha:
            new Date().toISOString()

    };


    libros.unshift(libro);


    guardarDatos();


    alert(
        "✓ Libro guardado correctamente."
    );


    mostrarEstadisticas();

    mostrarSeccion("libros");

}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function guardarDatos() {

    localStorage.setItem(
        "bibliotecaLibros",
        JSON.stringify(libros)
    );

}


/* =====================================================
   MOSTRAR LIBROS
===================================================== */

function mostrarLibros() {

    const contenedor =
        document.getElementById(
            "todosLosLibros"
        );


    if (!libros.length) {

        contenedor.innerHTML = `
            <div class="vacio">

                📚

                <h3>
                    Todavía no tienes libros
                </h3>

                <p>
                    Crea tu primer libro
                    para comenzar.
                </p>

            </div>
        `;

        return;

    }


    contenedor.innerHTML =
        libros.map(crearTarjetaLibro)
        .join("");


}


/* =====================================================
   TARJETA LIBRO
===================================================== */

function crearTarjetaLibro(libro) {

    const total =
        libro.capitulos.length;


    const terminados =
        libro.capitulos.filter(
            c => c.guardado
        ).length;


    const porcentaje =
        total
        ? Math.round(
            terminados / total * 100
        )
        : 0;


    return `

        <article class="libro-card">

            <div class="portada">

                ${
                    libro.logo
                    ? `<img src="${libro.logo}">`
                    : ""
                }

                <small>
                    ${escapeHTML(libro.autor || "Autor")}
                </small>

                <h4>
                    ${escapeHTML(libro.titulo)}
                </h4>

            </div>


            <div class="libro-body">

                <div class="autor">

                    ${total}
                    capítulo(s)

                </div>


                <div class="barra-progreso">

                    <i
                        style="width:${porcentaje}%">
                    </i>

                </div>


                <div class="meta-libro">

                    <span>
                        ${porcentaje}% completado
                    </span>

                    <span>
                        ${terminados}/${total}
                    </span>

                </div>


                <div class="acciones">

                    <button
                        onclick="leerLibro('${libro.id}')">

                        📖 Leer

                    </button>


                    <button
                        onclick="editarLibro('${libro.id}')">

                        ✏️ Editar

                    </button>


                    <button
                        onclick="descargarPDF('${libro.id}')">

                        📄 PDF

                    </button>


                    <button
                        onclick="compartirLibro('${libro.id}')">

                        🔗 Compartir

                    </button>


                    <button
                        class="eliminar"
                        onclick="eliminarLibro('${libro.id}')">

                        🗑 Eliminar

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   LEER LIBRO
===================================================== */

function leerLibro(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    let contenido = `

        <h1>
            ${escapeHTML(libro.titulo)}
        </h1>

        <p style="text-align:center">
            <b>
                ${escapeHTML(libro.autor || "")}
            </b>
        </p>

        <div class="frase-lectura">

            ${escapeHTML(
                libro.fraseGeneral || ""
            )}

        </div>


        <h2>
            Frase inicial
        </h2>

        <p>
            ${escapeHTML(
                libro.fraseInicial || ""
            )}
        </p>


        <h2>
            Sinopsis
        </h2>

        <p>
            ${escapeHTML(
                libro.sinopsis || ""
            )}
        </p>

    `;


    libro.capitulos.forEach(
        (capitulo, indice) => {

            contenido += `

                <div class="capitulo-lectura">

                    <h2>
                        ${
                            escapeHTML(
                                capitulo.titulo ||
                                `Capítulo ${indice + 1}`
                            )
                        }
                    </h2>

                    <div>
                        ${
                            capitulo.contenido ||
                            "<i>Capítulo vacío.</i>"
                        }
                    </div>

                </div>

            `;

        }
    );


    document.getElementById(
        "contenidoLectura"
    ).innerHTML = contenido;


    abrirModal("modalLeer");

}


/* =====================================================
   EDITAR LIBRO
===================================================== */

function editarLibro(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    let contenido = `

        <span class="etiqueta">
            EDITAR LIBRO
        </span>

        <h2>
            ${escapeHTML(libro.titulo)}
        </h2>


        <label>

            Título

            <input
                id="editarTitulo"
                value="${escapeHTML(libro.titulo)}"
            >

        </label>


        <br>


        <label>

            Autor

            <input
                id="editarAutor"
                value="${escapeHTML(libro.autor)}"
            >

        </label>


        <br>


        <label>

            Frase general

            <input
                id="editarFrase"
                value="${escapeHTML(libro.fraseGeneral)}"
            >

        </label>


        <br>


        <label>

            Frase inicial

            <textarea
                id="editarInicial"
            >${escapeHTML(libro.fraseInicial)}</textarea>

        </label>


        <br>


        <label>

            Sinopsis

            <textarea
                id="editarSinopsis"
            >${escapeHTML(libro.sinopsis)}</textarea>

        </label>


        <br>

        <h3>
            Partes del libro
        </h3>

    `;


    contenido += `

        <div class="capitulo">

            <div class="capitulo-header">

                📘 Sinopsis

            </div>

        </div>

    `;


    libro.capitulos.forEach(
        (capitulo, indice) => {

            contenido += `

                <div class="capitulo">

                    <div class="capitulo-header">

                        <div class="numero-capitulo">
                            ${indice + 1}
                        </div>

                        <input
                            id="editarCapituloTitulo${indice}"
                            class="titulo-capitulo"
                            value="${escapeHTML(capitulo.titulo)}"
                        >

                    </div>


                    <div class="editor-capitulo">

                        <div
                            id="editarCapitulo${indice}"
                            class="area-escritura"
                            contenteditable="true"
                        >
                            ${capitulo.contenido}
                        </div>

                    </div>

                </div>

            `;

        }
    );


    contenido += `

        <button
            class="btn-principal"
            onclick="guardarEdicion('${id}')">

            Guardar cambios

        </button>

    `;


    document.getElementById(
        "contenidoEditar"
    ).innerHTML = contenido;


    abrirModal("modalEditar");

}


/* =====================================================
   GUARDAR EDICIÓN
===================================================== */

function guardarEdicion(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    libro.titulo =
        document.getElementById(
            "editarTitulo"
        ).value;


    libro.autor =
        document.getElementById(
            "editarAutor"
        ).value;


    libro.fraseGeneral =
        document.getElementById(
            "editarFrase"
        ).value;


    libro.fraseInicial =
        document.getElementById(
            "editarInicial"
        ).value;


    libro.sinopsis =
        document.getElementById(
            "editarSinopsis"
        ).value;


    libro.capitulos.forEach(
        (capitulo, indice) => {

            capitulo.titulo =
                document.getElementById(
                    `editarCapituloTitulo${indice}`
                ).value;


            capitulo.contenido =
                document.getElementById(
                    `editarCapitulo${indice}`
                ).innerHTML;

        }
    );


    guardarDatos();

    cerrarModal("modalEditar");

    mostrarLibros();

    mostrarEstadisticas();


    alert(
        "✓ Cambios guardados."
    );

}


/* =====================================================
   ELIMINAR
===================================================== */

function eliminarLibro(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    const confirmar =
        confirm(
            `¿Quieres eliminar "${libro.titulo}"?`
        );


    if (!confirmar) return;


    libros =
        libros.filter(
            l => l.id !== id
        );


    guardarDatos();

    mostrarLibros();

    mostrarEstadisticas();

}


/* =====================================================
   PDF
===================================================== */

function descargarPDF(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    const margen = 25;

    let y = 35;


    /* PORTADA */

    pdf.setFont(
        "times",
        "bold"
    );

    pdf.setFontSize(25);


    pdf.text(
        libro.titulo,
        105,
        y,
        {
            align: "center"
        }
    );


    y += 15;


    pdf.setFont(
        "times",
        "normal"
    );

    pdf.setFontSize(12);


    pdf.text(
        `Autor: ${libro.autor}`,
        105,
        y,
        {
            align: "center"
        }
    );


    y += 25;


    if (libro.fraseGeneral) {

        pdf.setFont(
            "times",
            "italic"
        );

        pdf.setFontSize(13);


        y = escribirPDF(
            pdf,
            libro.fraseGeneral,
            y,
            margen,
            160,
            true
        );


        y += 15;

    }


    /* SINOPSIS */

    pdf.setFont(
        "times",
        "bold"
    );

    pdf.setFontSize(16);

    pdf.text(
        "Sinopsis",
        margen,
        y
    );


    y += 10;


    pdf.setFont(
        "times",
        "normal"
    );

    pdf.setFontSize(12);


    y = escribirPDF(
        pdf,
        libro.sinopsis,
        y,
        margen,
        160,
        false
    );


    y += 15;


    /* CAPÍTULOS */

    libro.capitulos.forEach(
        (capitulo, indice) => {

            if (y > 250) {

                pdf.addPage();

                y = 30;

            }


            pdf.setFont(
                "times",
                "bold"
            );

            pdf.setFontSize(16);


            pdf.text(
                capitulo.titulo ||
                `Capítulo ${indice + 1}`,
                margen,
                y
            );


            y += 10;


            pdf.setFont(
                "times",
                "normal"
            );

            pdf.setFontSize(12);


            const texto =
                capitulo.contenido
                    .replace(
                        /<br\s*\/?>/gi,
                        "\n"
                    )
                    .replace(
                        /<[^>]*>/g,
                        ""
                    );


            y = escribirPDF(
                pdf,
                texto,
                y,
                margen,
                160,
                false
            );


            y += 15;

        }
    );


    const nombre =
        libro.titulo
            .replace(
                /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g,
                ""
            )
            .trim();


    pdf.save(
        `${nombre || "mi-libro"}.pdf`
    );

}


/* =====================================================
   ESCRIBIR PDF
===================================================== */

function escribirPDF(
    pdf,
    texto,
    y,
    x,
    ancho,
    centrado
) {

    if (!texto) return y;


    const lineas =
        pdf.splitTextToSize(
            texto,
            ancho
        );


    lineas.forEach(
        linea => {

            if (y > 270) {

                pdf.addPage();

                y = 30;

            }


            pdf.text(
                linea,
                centrado ? 105 : x,
                y,
                centrado
                ? {
                    align: "center"
                }
                : {}
            );


            y += 7;

        }
    );


    return y;

}


/* =====================================================
   COMPARTIR
===================================================== */

function compartirLibro(id) {

    const enlace =
        `${window.location.href.split("#")[0]}#libro=${id}`;


    document.getElementById(
        "enlaceLibro"
    ).value = enlace;


    abrirModal(
        "modalCompartir"
    );

}


function copiarEnlace() {

    const campo =
        document.getElementById(
            "enlaceLibro"
        );


    navigator.clipboard
        .writeText(campo.value)
        .then(() => {

            alert(
                "✓ Enlace copiado."
            );

        });

}


function compartirNativo() {

    const enlace =
        document.getElementById(
            "enlaceLibro"
        ).value;


    if (
        navigator.share
    ) {

        navigator.share({
            title: "Mi libro",
            url: enlace
        });

    } else {

        copiarEnlace();

    }

}


/* =====================================================
   PROCESO
===================================================== */

function mostrarProceso() {

    const contenedor =
        document.getElementById(
            "listaProceso"
        );


    if (!libros.length) {

        contenedor.innerHTML = `
            <div class="vacio">

                No tienes libros todavía.

            </div>
        `;

        return;

    }


    contenedor.innerHTML =
        libros.map(libro => {

            const total =
                libro.capitulos.length;


            const terminados =
                libro.capitulos.filter(
                    c => c.guardado
                ).length;


            const porcentaje =
                total
                ? Math.round(
                    terminados /
                    total *
                    100
                )
                : 0;


            return `

                <div class="item-proceso">

                    <div class="titulo-proceso">

                        <h4>
                            ${escapeHTML(libro.titulo)}
                        </h4>

                        <span>
                            ${porcentaje}%
                        </span>

                    </div>


                    <div class="progreso-grande">

                        <i
                            style="width:${porcentaje}%">
                        </i>

                    </div>


                    <div class="detalle-proceso">

                        ${terminados}
                        de
                        ${total}
                        capítulos terminados

                    </div>

                </div>

            `;

        }).join("");

}


/* =====================================================
   CHAT IA
===================================================== */

function preguntaIA(boton) {

    document.getElementById(
        "entradaChat"
    ).value =
        boton.textContent;


    document
        .querySelector(".chat-input")
        .requestSubmit();

}


function enviarPregunta(event) {

    event.preventDefault();


    const entrada =
        document.getElementById(
            "entradaChat"
        );


    const pregunta =
        entrada.value.trim();


    if (!pregunta) return;


    agregarMensaje(
        pregunta,
        "usuario"
    );


    entrada.value = "";


    setTimeout(
        () => {

            const respuesta =
                responderIA(pregunta);


            agregarMensaje(
                respuesta,
                "ia"
            );

        },
        400
    );

}


function agregarMensaje(
    texto,
    tipo
) {

    const contenedor =
        document.getElementById(
            "mensajesChat"
        );


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        `mensaje ${tipo}`;


    mensaje.innerHTML =
        texto;


    contenedor.appendChild(
        mensaje
    );


    contenedor.scrollTop =
        contenedor.scrollHeight;

}


/* =====================================================
   RESPUESTAS IA
===================================================== */

function responderIA(pregunta) {

    if (!libros.length) {

        return `
            Todavía no tienes libros guardados.
            Crea tu primer libro para que pueda
            analizar su proceso.
        `;

    }


    const totalCapitulos =
        libros.reduce(
            (total, libro) =>
                total +
                libro.capitulos.length,
            0
        );


    const capitulosTerminados =
        libros.reduce(
            (total, libro) =>
                total +
                libro.capitulos.filter(
                    c => c.guardado
                ).length,
            0
        );


    const porcentaje =
        totalCapitulos
        ? Math.round(
            capitulosTerminados /
            totalCapitulos *
            100
        )
        : 0;


    let libroMayorProgreso =
        libros[0];


    libros.forEach(libro => {

        const progresoActual =
            libro.capitulos.length
            ? libro.capitulos.filter(
                c => c.guardado
            ).length /
            libro.capitulos.length
            : 0;


        const progresoMayor =
            libroMayorProgreso.capitulos.length
            ? libroMayorProgreso.capitulos.filter(
                c => c.guardado
            ).length /
            libroMayorProgreso.capitulos.length
            : 0;


        if (
            progresoActual >
            progresoMayor
        ) {

            libroMayorProgreso =
                libro;

        }

    });


    const texto =
        pregunta.toLowerCase();


    if (
        texto.includes("capítulo") ||
        texto.includes("capitulos")
    ) {

        return `
            Actualmente tienes
            <b>${totalCapitulos}</b>
            capítulos creados.

            <br><br>

            De ellos,
            <b>${capitulosTerminados}</b>
            están guardados como terminados.
        `;

    }


    if (
        texto.includes("avanzado")
    ) {

        return `
            El libro que actualmente
            está más avanzado es:

            <br><br>

            <b>
                ${escapeHTML(
                    libroMayorProgreso.titulo
                )}
            </b>

            <br><br>

            Tiene
            ${
                libroMayorProgreso.capitulos
                    .filter(c => c.guardado)
                    .length
            }
            capítulos terminados de
            ${
                libroMayorProgreso.capitulos.length
            }.
        `;

    }


    return `
        He revisado el proceso de tu biblioteca.

        <br><br>

        📚 Tienes
        <b>${libros.length}</b>
        libro(s).

        <br><br>

        📖 Tienes
        <b>${totalCapitulos}</b>
        capítulo(s).

        <br><br>

        ✓ Has terminado
        <b>${capitulosTerminados}</b>
        capítulo(s).

        <br><br>

        📊 Tu avance general es de
        <b>${porcentaje}%</b>.

        <br><br>

        Tu libro más avanzado actualmente es
        <b>
            ${escapeHTML(
                libroMayorProgreso.titulo
            )}
        </b>.
    `;

}


/* =====================================================
   ESTADÍSTICAS
===================================================== */

function mostrarEstadisticas() {

    document.getElementById(
        "cantidadLibros"
    ).textContent =
        libros.length;


    const capitulos =
        libros.reduce(
            (total, libro) =>
                total +
                libro.capitulos.length,
            0
        );


    document.getElementById(
        "cantidadCapitulos"
    ).textContent =
        capitulos;


    const terminados =
        libros.reduce(
            (total, libro) =>
                total +
                libro.capitulos.filter(
                    c => c.guardado
                ).length,
            0
        );


    const porcentaje =
        capitulos
        ? Math.round(
            terminados /
            capitulos *
            100
        )
        : 0;


    document.getElementById(
        "porcentajeGeneral"
    ).textContent =
        `${porcentaje}%`;


    const recientes =
        document.getElementById(
            "librosRecientes"
        );


    if (!libros.length) {

        recientes.innerHTML = `
            <div class="vacio">

                📚

                <h3>
                    Aún no tienes libros.
                </h3>

                <p>
                    ¡Crea el primero!
                </p>

            </div>
        `;

        return;

    }


    recientes.innerHTML =
        libros
            .slice(0, 4)
            .map(crearTarjetaLibro)
            .join("");

}


/* =====================================================
   MODALES
===================================================== */

function abrirModal(id) {

    document
        .getElementById(id)
        .classList.add("abierto");

}


function cerrarModal(id) {

    document
        .getElementById(id)
        .classList.remove("abierto");

}


/* =====================================================
   LIMPIAR
===================================================== */

function limpiarFormulario() {

    if (
        !confirm(
            "¿Quieres limpiar el formulario?"
        )
    ) {
        return;
    }


    nuevoLibro();

}


/* =====================================================
   SEGURIDAD HTML
===================================================== */

function escapeHTML(text = "") {

    return text
        .replace(
            /[&<>"']/g,
            function(caracter) {

                const mapa = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                };

                return mapa[caracter];

            }
        );

}


/* =====================================================
   INICIO
===================================================== */

mostrarEstadisticas();


/* =====================================================
   ABRIR LIBRO DESDE ENLACE
===================================================== */

window.addEventListener(
    "load",
    function() {

        if (
            window.location.hash.startsWith(
                "#libro="
            )
        ) {

            const id =
                window.location.hash
                    .replace(
                        "#libro=",
                        ""
                    );


            const libro =
                libros.find(
                    l => l.id === id
                );


            if (libro) {

                leerLibro(id);

            }

        }

    }
);