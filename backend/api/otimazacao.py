from ortools.linear_solver import pywraplp


tempos = [1, 2, 3, 4, 5, 6]
dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']




class quadroHorarios:
  def __init__(self, materias, tempos_materia, pesos, quantidade_quadros):
    self.materias = materias
    self.tempos_materia = tempos_materia
    self.quantidade_quadros = quantidade_quadros
    self.pesos = pesos
    self.solver, self.aulas = self.criar_modelo_inteiro()

  def criar_modelo_inteiro(self):
    # Cria o solver
    solver = pywraplp.Solver.CreateSolver('SCIP')
    


    # Declara variáveis
    aulas = {}
    for dia in dias:
        for materia in self.materias:
            for tempo in range(1, self.tempos_materia[materia]+1):  # Considerando tempos de 1 a 6
                aulas[(dia, materia, tempo)] = solver.BoolVar(f'aulas[{dia, materia, tempo}]')

    menor_qtd_materias = solver.IntVar(0, solver.infinity(), 'menor_qtd_materias')

    # Função objetivo: maximizar a menor quantidade de matérias
    solver.Maximize(menor_qtd_materias)

    # Restrição de menor quantidade de aulas
    for dia in dias:
        solver.Add(sum(self.pesos[materia] * aulas[(dia, materia, tempo)] 
                      for materia in self.materias 
                      for tempo in range(1, self.tempos_materia[materia]+1)) >= menor_qtd_materias)

    # Restrição de tempos por dia
    for dia in dias:
        solver.Add(sum(aulas[(dia, materia, tempo)] 
                      for materia in self.materias 
                      for tempo in range(1, self.tempos_materia[materia]+1)) <= 6)

    # Restrição de tempos de cada matéria
    for materia in self.materias:
        solver.Add(sum(aulas[(dia, materia, tempo)] 
                      for dia in dias 
                      for tempo in range(1, self.tempos_materia[materia]+1)) == self.tempos_materia[materia])

    # Restrições específicas para as matérias
    for materia in self.materias:
        for tempo in range(1, self.tempos_materia[materia]+1):
            # Restrição de aulas de 1 a 6
            solver.Add(sum(aulas[(dia, materia, tempo)] for dia in dias) == 1)
        for dia in dias:
            solver.Add(aulas[(dia, materia, 2)] <= aulas[(dia, materia, 1)])
            if self.tempos_materia[materia] >= 4:
                solver.Add(aulas[(dia, materia, 4)] <= aulas[(dia, materia, 3)])
            # if tempos_materia[materia] == 5:
            #     solver.Add(aulas[(dia, materia, 5)] <= aulas[(dia, materia, 4)])

            # Restrição de no máximo 4 aulas por dia
            solver.Add(sum(aulas[(dia, materia, tempo)] for tempo in range(1, self.tempos_materia[materia]+1)) <= 4)
    
    # nquadros = resultado_quadro(solver, materias, aulas, tempos_materia, quantidade_quadros)
    return solver, aulas

  def resultado_quadro(self):
      nquadros =[]
      quadro = {}
      
      
      
      status = self.solver.Solve()
      if status != pywraplp.Solver.OPTIMAL:
            return "Modelo Sem soluções"
      for dia in dias:
              for materia in self.materias:
                  for tempo in range(1, self.tempos_materia[materia]+1):
                      if self.aulas[(dia, materia, tempo)].solution_value() == 1:
                          quadro[dia] = quadro.get(dia, []) + [materia]
      nquadros.append(quadro)

      for i in range(self.quantidade_quadros - 1):
          quadro = {}
          expr = 0
          for var in self.aulas.values():
              if var.solution_value() < 0.5:
                  expr += var
              else:
                  expr += (1 - var)
          self.solver.Add(expr >=1)
          status = self.solver.Solve()
          for dia in dias:
              for materia in self.materias:
                  for tempo in range(1, self.tempos_materia[materia]+1):
                      if self.aulas[(dia, materia, tempo)].solution_value() == 1:
                          quadro[dia] = quadro.get(dia, []) + [materia]
          nquadros.append(quadro)

      return nquadros

    
    

