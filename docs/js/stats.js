document.getElementById('excelInput').addEventListener('change', function(e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Pega a primeira planilha do arquivo Excel
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];
      
      // Converte a planilha para um array de objetos JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      getXLSX(jsonData);
    };
    reader.readAsBinaryString(file);
  }
});


async function getXLSX(jsonData) {
    try{
        const jsonString = JSON.stringify(jsonData);

        API_URL =`http://127.0.0.1:8000/stats/?dados=${jsonString}&valores=601-T&grupos=DS`
        const fetchResponse = await fetch(API_URL);
        let dados = await fetchResponse.json();
        // console.log(dados)
        statsTela(dados)
    }catch(error){
        console.error("Erro ao buscar os quadros:", error);
    }

}

function statsTela(dados){
  json_data = dados.slice(3, 5)
  // console.log(json_data)
  json_data.forEach((quadro, titulo_i) => {

    let qnt_colunas = Object.keys(quadro).length
    let qnt_linhas = Object.keys(quadro[Object.keys(quadro)[0]]).length
    // console.log(quadro)
   
    let colunas = document.createElement('tr')

    let tabela_dados = document.createElement('table')
    tabela_dados.classList.add('tabela-quadro')
    let tabela_dados_titulo = document.createElement('caption')
    tabela_dados_titulo.textContent = titulo_i == 0 ? "Tabela Anova": "Tabela Tukey"
    tabela_dados_titulo.classList.add('titulo-tabela')
    tabela_dados.appendChild(tabela_dados_titulo)





    Object.keys(quadro).forEach(colum=>{
      
      let colum_th = document.createElement('th')
      colum_th.textContent = colum
      colunas.appendChild(colum_th)
      colum_th.classList.add('titulo-colunas')
    })
    tabela_dados.appendChild(colunas)

    for (let i = 0; i < qnt_linhas; i++) {
      let linha = document.createElement("tr");
      for (let j = 0; j < qnt_colunas; j++) {
          let cell = document.createElement("td");
          cell.classList.add("materia")
          linha.appendChild(cell);
      }
      tabela_dados.appendChild(linha);
    }

    Object.keys(quadro).forEach((colum, index_j) =>{
      Object.keys(quadro[colum]).forEach((dado, index_i)=>{
        if(typeof quadro[colum][dado] === "number"){
          tabela_dados.rows[index_i+1].cells[index_j].textContent = quadro[colum][dado].toPrecision(5)
        }else{
          tabela_dados.rows[index_i+1].cells[index_j].textContent = quadro[colum][dado]
        }
      })
     })




    dadosContainer.appendChild(tabela_dados)
    
  });

}

const dadosContainer = document.querySelector(".dados-container")

