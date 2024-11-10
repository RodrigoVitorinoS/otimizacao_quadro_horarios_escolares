export const quadrosContainer = document.querySelector(".quadros-container")

export function fazerQuadroHorarios(quadros_lista){
    quadrosContainer.innerHTML = ''
    quadros_lista.forEach((quadro,sugestao)=>{
        
        let tabela_quadro = document.createElement('table')
        tabela_quadro.classList.add('tabela-quadro')
        let tabela_titulo = document.createElement('caption')
        tabela_titulo.textContent = `Sugestão ${sugestao +1 }`
        tabela_titulo.classList.add('titulo-tabela')
        let colunas = document.createElement('tr')
        let dias = Object.keys(quadro)
        
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



        dias.forEach((dia, index_j) =>{
            quadro[dia].forEach((materia, index_i)=>{
                tabela_quadro.rows[index_i+1].cells[index_j].textContent = materia
            })
        })
        
        tabela_quadro.appendChild(tabela_titulo)
        quadrosContainer.appendChild(tabela_quadro)

        
    })

}