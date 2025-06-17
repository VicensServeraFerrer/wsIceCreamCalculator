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
    ingredient_ids = data.get("ingredientIds", [])
    
    # Verificar que las matrices no estén vacías
    if A.size == 0 or B.size == 0:
        print(json.dumps({"error": "Matrices no proporcionadas correctamente"}))
        return
    
    # TODO: Añadir restricciones a la solución (por ejemplo, límites en las variables)
    lower_bounds = np.zeros(A.shape[1])
    upper_bounds = np.full(A.shape[1], 1000)
    
    # Resolver el sistema con restricciones
    res = lsq_linear(A, B, bounds=(lower_bounds, upper_bounds))  # Se pueden añadir bounds=[min, max]
    
    result = [
        {"id": id, "quantity": round(valor, 4)}
        for id, valor in zip(ingredient_ids, res.x)
    ]

    # Construir la respuesta JSON
    # result = {"solution": res.x.tolist()}
    print(json.dumps(result))
    
if __name__ == "__main__":
    main()