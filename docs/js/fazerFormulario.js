import { getQuadroHorarios } from "./script.js";
import { quadrosContainer } from "./quadrosDeHorarios.js";

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

const form_tempos = document.getElementById("form_tempos")

export function colocarMateriasNaTela(ano){
    form_tempos.innerHTML = ""
    const form_container = document.createElement('div')
    form_container.classList.add("form_container")
    form_tempos.appendChild(form_container)

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



    const button_submit = document.createElement('button')
    button_submit.classList.add('button-submit')
    button_submit.setAttribute('type', 'submit')
    button_submit.setAttribute('id', 'submit_tempos')
    button_submit.textContent = 'Enviar'
    
    button_submit.addEventListener("click", (event)=>{
        event.preventDefault()
        quadrosContainer.innerHTML = ''
        let API_URL = 'https://otimizacao-quadro-horarios-escolares.onrender.com/quadro/?tempos_materia={'
        let sum_tempos = 0
        let num_inteiros = true
        materiasPorAno[ano].forEach((materia, index)=>{
            sum_tempos += Number(document.getElementById(`input_${materia}`).value)
            if(!/^\d+$/.test(document.getElementById(`input_${materia}`).value)){
                num_inteiros = false
            }
            API_URL +=`"${materia}": ${document.getElementById(`input_${materia}`).value}`
            if (index < materiasPorAno[ano].length -1){
                API_URL +=','
            }
        })
        API_URL+=`}&ano=${ano}&quantidade_quadros=3`
        if (sum_tempos<=30 && num_inteiros){
            getQuadroHorarios(API_URL)
        }else if (sum_tempos>30){
            alert("Quantidade de tempos inválida. A soma dos tempo não deve exceder 30")
        } else {
            alert("Os tempos devem ser números inteiros maiores que zero")
        }
        
    })

    form_tempos.appendChild(button_submit)


}