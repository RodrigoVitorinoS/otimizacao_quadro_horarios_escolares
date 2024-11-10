import { colocarMateriasNaTela } from "./fazerFormulario.js";
import { quadrosContainer } from "./quadrosDeHorarios.js";
import { fazerQuadroHorarios } from "./quadrosDeHorarios.js";

document.getElementById('ano').addEventListener('change', function() {
    const anoSelecionado = this.value;
    colocarMateriasNaTela(anoSelecionado)
    quadrosContainer.innerHTML = ''

});


export async function getQuadroHorarios(API_URL) {
    document.getElementById('loading').style.display = 'block';
    try{
        const fetchResponse = await fetch(API_URL);
        let quadros_lista = await fetchResponse.json();
        fazerQuadroHorarios(quadros_lista)     
    }catch(error){
        console.error("Erro ao buscar os quadros:", error);
    }finally {
        document.getElementById('loading').style.display = 'none';
    }

}



