from fastapi import FastAPI
from api.otimazacao import  quadroHorarios 
import json

from api.ano import pesos
from fastapi.middleware.cors import CORSMiddleware
from api.stats import tratamento, analize
import pandas as pd
from fastapi.responses import JSONResponse


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
def stats():
    dados = pd.read_excel("data/FreqR.xlsx")
    json_data = dados.to_json(orient='records')
    df_from_json = pd.read_json(json_data)
    
    return json_data

    # dados = tratamento(dados, "601-T")
    # dados = analize(dados, "601-T")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)


