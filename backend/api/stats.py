import pandas as pd
from scipy.stats import shapiro, bartlett, levene, boxcox, boxcox_normmax
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import statsmodels.api as sm
from statsmodels.formula.api import ols

def tratamento(dados, grupos, valores):
  dados = dados[[grupos,valores]]
  dados.rename(columns={valores:'valores', grupos:'grupos'}, inplace = True)

  dados.dropna(inplace = True)
  return dados

def anova(df_analise):
  
  # Criar o modelo de ANOVA
  modelo_anova = ols('valores ~ C(grupos)', data=df_analise).fit()

  # Obter os resíduos
  residuos_anova = modelo_anova.resid
  anova_resultados = sm.stats.anova_lm(modelo_anova, typ=1)
  _, p_shapiro = shapiro(residuos_anova)
  _, p_bartlett = bartlett(*[df_analise['valores'][df_analise['grupos'] == dia] for dia in df_analise['grupos'].unique()])

  if p_shapiro > 0.05 and p_bartlett > 0.05:
      return p_shapiro, p_bartlett, residuos_anova, anova_resultados, False, 1

  else:
    lamb = boxcox_normmax(df_analise['valores'])
    df_transformado = df_analise.copy()
    df_transformado['valores'] = df_transformado['valores']**lamb
    modelo_anova = ols('valores ~ C(grupos)', data=df_transformado).fit()
    residuos_anova = modelo_anova.resid
    anova_resultados = sm.stats.anova_lm(modelo_anova, typ=1)
    _, p_shapiro = shapiro(residuos_anova)
    _, p_bartlett = bartlett(*[df_transformado['valores'][df_transformado['grupos'] == dia] for dia in df_transformado['grupos'].unique()])

    if p_shapiro > 0.05 and p_bartlett > 0.05:
        return p_shapiro, p_bartlett, residuos_anova, anova_resultados, True, 1

    else:
         return p_shapiro, p_bartlett, residuos_anova, anova_resultados, True, 0

def analize(dados_tratados, valores, grupos):
  p_shapiro, p_bartlett, residuos_anova, anova_resultados, foram_transformados, op = anova(dados_tratados)

  tukey_results = pairwise_tukeyhsd(endog=dados_tratados['valores'], groups=dados_tratados['grupos'])
  # Converter o resultado para um DataFrame
  tukey_df = pd.DataFrame(data=tukey_results._results_table.data[1:], columns=tukey_results._results_table.data[0])
  # Exibir o DataFrame
  anova_resultados = anova_resultados.fillna('')





  return p_shapiro, p_bartlett, anova_resultados, foram_transformados, tukey_df
  # return p_shapiro, p_bartlett, residuos_anova, anova_resultados, foram_transformados, op, tukey_df