import pandas as pd
from scipy.stats import shapiro, bartlett, levene, boxcox, boxcox_normmax
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import statsmodels.api as sm
from statsmodels.formula.api import ols

def tratamento(dados, turma):
  
  df_turma = dados.copy()
  df_turma = df_turma[['DS',turma]]
  df_turma.rename(columns={turma:'freq', 'Data':'data', 'DS':'ds'}, inplace = True)
  df_turma.dropna(inplace = True)
  df_turma.replace({'seg':'Segunda',
                    'ter':'Terça',
                    'qua':'Quarta',
                    'qui':'Quinta',
                    'sex':'Sexta'}, inplace = True)
  return df_turma

def anova(df_analise):
  # Criar o modelo de ANOVA
  modelo_anova = ols('freq ~ C(ds)', data=df_analise).fit()

  # Obter os resíduos
  residuos_anova = modelo_anova.resid
  anova_resultados = sm.stats.anova_lm(modelo_anova, typ=1)
  _, p_shapiro = shapiro(residuos_anova)
  _, p_bartlett = bartlett(*[df_analise['freq'][df_analise['ds'] == dia] for dia in df_analise['ds'].unique()])

  if p_shapiro > 0.05 and p_bartlett > 0.05:
      return p_shapiro, p_bartlett, residuos_anova, anova_resultados, False, 1

  else:
    lamb = boxcox_normmax(df_analise['freq'])
    df_transformado = df_analise.copy()
    df_transformado['freq'] = df_transformado['freq']**lamb
    modelo_anova = ols('freq ~ C(ds)', data=df_transformado).fit()
    residuos_anova = modelo_anova.resid
    anova_resultados = sm.stats.anova_lm(modelo_anova, typ=1)
    _, p_shapiro = shapiro(residuos_anova)
    _, p_bartlett = bartlett(*[df_transformado['freq'][df_transformado['ds'] == dia] for dia in df_transformado['ds'].unique()])

    if p_shapiro > 0.05 and p_bartlett > 0.05:
        return p_shapiro, p_bartlett, residuos_anova, anova_resultados, True, 1

    else:
         return p_shapiro, p_bartlett, residuos_anova, anova_resultados, True, 0

def analize(df_analise, turma):
  p_shapiro, p_bartlett, residuos_anova, anova_resultados, foram_transformados, op = anova(df_analise)

  tukey_results = pairwise_tukeyhsd(endog=df_analise['freq'], groups=df_analise['ds'])
  # Converter o resultado para um DataFrame
  tukey_df = pd.DataFrame(data=tukey_results._results_table.data[1:], columns=tukey_results._results_table.data[0])
  # Exibir o DataFrame






  return op, anova_resultados