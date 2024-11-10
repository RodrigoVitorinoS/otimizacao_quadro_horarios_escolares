const tempos_materia={ "Geografia": 2, "Matemática": 4, "Português": 4, "Projeto de Vida": 2, "Química": 2, "Educacao Física": 2, "História": 2, "Filosofia": 2, "Biologia": 2, "Inglês": 2, "Física": 2 }

const materiasPorAno = {
    "neja_3": ["Geografia", "Matemática", "Português", "História", "Filosofia", "Educação Física", "Sociologia"],
    "neja_2": ["Matemática", "Português", "Vida", "Química", "Biologia", "Física", "Artes"],
    "neja_1": ["Geografia", "Matemática", "Português", "História", "Filosofia", "Educação Física", "Inglês"],
    "terceiro": ["Geografia", "Matemática", "Português", "História", "Filosofia", "Química", "Biologia", "Física", "Língua Estrangeira", "Sociologia"],
    "segundo": ["Geografia", "Matemática", "Português", "História", "Filosofia", "Química", "Biologia", "Educacao Física", "Física", "Artes", "Língua Estrangeira", "Sociologia"],
    "primeiro": ["Geografia", "Matemática", "Português", "Projeto de Vida", "Química", "Educacao Física", "História", "Filosofia", "Biologia", "Inglês", "Física"],
    "nono": ["Geografia", "Matemática", "Português", "História", "Educação Física", "Inglês", "Ciências", "Artes", "RPM", "PT"],
    "oitavo": ["Geografia", "Matemática", "Português", "História", "Educação Física", "Inglês", "Ciências", "Letramento Matemática", "Letramento Português", "Artes"],
    "setimo": ["Geografia", "Matemática", "Português", "História", "Educação Física", "Inglês", "Ciências", "Letramento Matemática", "Letramento Português", "Artes"],
    "sexto": ["Geografia", "Matemática", "Português", "História", "Educação Física", "Inglês", "Ciências", "Letramento Matemática", "Letramento Português", "Artes"]
};


document.getElementById('ano').addEventListener('change', function() {
    const anoSelecionado = this.value;
    console.log('Ano selecionado:', anoSelecionado);
    colocarMateriasNaTela(anoSelecionado)
    quadrosContainer.innerHTML = ''

});



const form_tempos = document.getElementById("form_tempos")
function colocarMateriasNaTela(ano){
    form_tempos.innerHTML = ""
    const form_container = document.createElement('div')
    form_container.classList.add("form_container")
    form_tempos.appendChild(form_container)
    materias = materiasPorAno[ano]

    materiasPorAno[ano].forEach(materia=>{
        const div_materia = document.createElement('div')
        div_materia.classList.add('materia_input')
        let input_materia = document.createElement('input')
        input_materia.classList.add('tempo_input')
        let span_text =  document.createElement('span')
        span_text.textContent = materia
        input_materia.setAttribute('type', 'number')
        input_materia.setAttribute('value', 2)
        input_materia.setAttribute('id', `input_${materia}`)
        div_materia.appendChild(span_text)
        div_materia.appendChild(input_materia)

        form_container.appendChild(div_materia)


    })



    button_submit = document.createElement('button')
    button_submit.classList.add('button-submit')
    button_submit.setAttribute('type', 'submit')
    button_submit.setAttribute('id', 'submit_tempos')
    button_submit.textContent = 'Enviar'
    button_submit.addEventListener("click", (event)=>{
        event.preventDefault()
        let API_URL = 'https://otimizacao-quadro-horarios-escolares.onrender.com/quadro/?tempos_materia={'
        // API_URL = 'https://otimizacao-quadro-api.onrender.com/quadro/?tempos_materia={' 
        // API_URL = 'http://127.0.0.1:8000/quadro/?tempos_materia={ '

        materiasPorAno[ano].forEach((materia, index)=>{
            API_URL +=`"${materia}": ${document.getElementById(`input_${materia}`).value}`
            console.log(document.getElementById(`input_${materia}`).value)
            if (index < materiasPorAno[ano].length -1){
                API_URL +=','
            }
        })
        API_URL+=`}&ano=${ano}&quantidade_quadros=3`

        getQuadroHorarios(API_URL)
    })

    form_tempos.appendChild(button_submit)


}




async function getQuadroHorarios(API_URL) {
    document.getElementById('loading').style.display = 'block';
    try{
        const fetchResponse = await fetch(API_URL);
        let quadros_lista = await fetchResponse.json();
        console.log(quadros_lista)  
        fazerQuadroHorarios(quadros_lista)     
    }catch(error){
        console.error("Erro ao buscar os quadros:", error);
    }finally {
        document.getElementById('loading').style.display = 'none';
    }

}

const quadrosContainer = document.querySelector(".quadros-container")

function fazerQuadroHorarios(quadros_lista){
    quadrosContainer.innerHTML = ''
    let sugestao = 1
    quadros_lista.forEach(quadro=>{
        
        let tabela_quadro = document.createElement('table')
        tabela_quadro.classList.add('tabela-quadro')
        let tabela_titulo = document.createElement('caption')
        tabela_titulo.textContent = `Sugestão ${sugestao}`
        tabela_titulo.classList.add('titulo-tabela')
        let colunas = document.createElement('tr')
        dias = Object.keys(quadro)
        
        dias.forEach(dia =>{
            let dia_th = document.createElement('th')
            dia_th.textContent = dia
            colunas.appendChild(dia_th)
            dia_th.classList.add('titulo-colunas')
        })
        tabela_quadro.appendChild(colunas)

        let maxMaterias = Math.max(...Object.values(quadro).map(materias => materias.length));
        for (let i = 0; i < maxMaterias; i++) {
            let linha = document.createElement("tr");
            for (let j = 0; j < dias.length; j++) {
                let cell = document.createElement("td");
                cell.classList.add("materia")
                linha.appendChild(cell);
            }
            tabela_quadro.appendChild(linha);
        }



        j = 0
        dias.forEach(dia =>{

            i = 1
            quadro[dia].forEach(materia=>{

                tabela_quadro.rows[i].cells[j].textContent = materia
                i +=1
            })
            j +=1
        })
        
        tabela_quadro.appendChild(tabela_titulo)
        quadrosContainer.appendChild(tabela_quadro)

        sugestao +=1
        
    })

}

