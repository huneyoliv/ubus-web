# Documentação de Endpoints para Pontos de Desembarque (Dropoff Points)

Para suportar o gerenciamento de pontos de desembarque no painel do gestor, a API backend deve implementar os seguintes endpoints baseados no padrão já utilizado para os pontos de embarque (Pickup Points).

---

## 1. Listar Pontos de Desembarque de uma Rota
Retorna todos os pontos de desembarque cadastrados para uma rota específica.

* **URL:** `/fleet/routes/:routeId/dropoff-points`
* **Método:** `GET`
* **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "uuid-ponto-desembarque-1",
      "name": "Parada do Campus Universitário",
      "lat": -10.9472,
      "lng": -37.0731,
      "routeId": "uuid-da-rota"
    }
  ]
  ```

---

## 2. Criar Ponto de Desembarque
Cria um novo ponto de desembarque associado a uma rota.

* **URL:** `/fleet/routes/:routeId/dropoff-points`
* **Método:** `POST`
* **Payload:**
  ```json
  {
    "name": "Parada do Campus Universitário",
    "lat": -10.9472,
    "lng": -37.0731
  }
  ```
* **Resposta de Sucesso (201 Created):**
  ```json
  {
    "id": "uuid-ponto-desembarque-1",
    "name": "Parada do Campus Universitário",
    "lat": -10.9472,
    "lng": -37.0731,
    "routeId": "uuid-da-rota"
  }
  ```

---

## 3. Atualizar Ponto de Desembarque
Atualiza os dados de um ponto de desembarque existente de forma direta.

* **URL:** `/fleet/dropoff-points/:pointId`
* **Método:** `PATCH`
* **Payload:**
  ```json
  {
    "name": "Novo Nome do Ponto",
    "lat": -10.9500,
    "lng": -37.0700
  }
  ```
* **Resposta de Sucesso (200 OK):**
  ```json
  {
    "id": "uuid-ponto-desembarque-1",
    "name": "Novo Nome do Ponto",
    "lat": -10.9500,
    "lng": -37.0700,
    "routeId": "uuid-da-rota"
  }
  ```

---

## 4. Excluir Ponto de Desembarque
Exclui um ponto de desembarque existente.

* **URL:** `/fleet/dropoff-points/:pointId`
* **Método:** `DELETE`
* **Resposta de Sucesso (204 No Content ou 200 OK):** Sem corpo na resposta.
