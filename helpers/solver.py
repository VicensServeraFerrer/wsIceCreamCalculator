import sys
import json
import numpy as np
from scipy.optimize import lsq_linear

def main():
    # Leer JSON desde stdin (entrada desde Node.js)
    data = json.load(sys.stdin)
    
    # Extraer matrices desde JSON
    A = np.array(data.get("matrixA", []))
    B = np.array(data.get("matrixB", []))
    ingredient_names = data.get("ingredientNames", [])
    
    # Verificar que las matrices no estén vacías
    if A.size == 0 or B.size == 0:
        print(json.dumps({"error": "Matrices no proporcionadas correctamente"}))
        return
    
    # TODO: Añadir restricciones a la solución (por ejemplo, límites en las variables)
    lower_bounds = np.zeros(A.shape[1])
    upper_bounds = np.full(A.shape[1], 1000)

    suma_restriccion = np.ones((1, A.shape[1]))       # Fila [1, 1, ..., 1]
    A = np.vstack([A, suma_restriccion])            # Añadir la fila a la matriz A
    B = np.append(B, [1000]) 
    
    # Resolver el sistema con restricciones
    res = lsq_linear(A, B, bounds=(lower_bounds, upper_bounds))  # Se pueden añadir bounds=[min, max]
    
    result = [
        {"nombre": nombre, "valor": round(valor, 4)}
        for nombre, valor in zip(ingredient_names, res.x)
    ]

    # Construir la respuesta JSON
    # result = {"solution": res.x.tolist()}
    print(json.dumps(result))
    
if __name__ == "__main__":
    main()