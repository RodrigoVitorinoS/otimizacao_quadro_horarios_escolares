from fastapi import FastAPI
from api.otimazacao import  quadroHorarios 
import json

from api.ano import pesos
from fastapi.middleware.cors import CORSMiddleware
from api.stats import tratamento, analize,anova
import pandas as pd
from fastapi.responses import JSONResponse
from io import StringIO
from urllib.parse import unquote




app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def hello():
    return "Bem vindo a otimização de quadro de horários v1.0" 

@app.get('/quadro/')
def quadro(tempos_materia: str, ano, quantidade_quadros):
    quantidade_quadros =int(quantidade_quadros)
    peso_ano = pesos(ano)
    if peso_ano =="Ano Inválido":
        return f"{ano} não é um ano válido"
    try:
        tempos_materia = json.loads(tempos_materia)
    except json.JSONDecodeError:
        return {"error": "Formato JSON inválido"}
    
    materias = list(tempos_materia.keys())

    solver = quadroHorarios(materias, tempos_materia, peso_ano, quantidade_quadros)
    nquadros = solver.resultado_quadro()    

    return nquadros

@app.get('/stats/')
async def stats(dados, grupos, valores):
    # dados = pd.read_excel("data/FreqR.xlsx")

    json_data = json.loads(dados)  # Converte a string para um objeto JSON
    df = pd.DataFrame(json_data[1:], columns=json_data[0])
    # print(df)
    dados_tratados = tratamento(df, grupos, valores)
    text =0
    # text = anova(dados_tratados)
    # print(text)
    p_shapiro, p_bartlett, anova_resultados, foram_transformados, tukey_df= analize(dados_tratados, valores, grupos)
    # print(p_shapiro, p_bartlett, anova_resultados, foram_transformados, tukey_df)
    # json_data =dados.to_json(orient="columns")
    # data_dict = json.loads(json_data)
    # print(dados_tratados.info())
    anova_resultados =anova_resultados.to_dict(orient='dict')
    tukey_df =tukey_df.to_dict(orient='dict')
    print(tukey_df)

    volta = [p_shapiro, p_bartlett, foram_transformados, anova_resultados, tukey_df]

    return JSONResponse(volta)




if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)


