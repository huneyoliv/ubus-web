# Proposta de Endpoints: Atribuição Padrão de Ônibus e Motorista na Rota

Este documento descreve os paths e payloads sugeridos para a especificação da API e Swagger da Ubus (`api.ubus.me/v1/docs`). O objetivo é permitir que o gestor defina o ônibus e o motorista padrão de uma Rota de forma independente da geração de viagens no calendário.

---

## 1. Atribuição de Ônibus Padrão à Rota

Define o ônibus que ficará escalado por padrão para realizar o trajeto desta rota.

* **Path**: `/v1/fleet/routes/{id}/bus`
* **Método**: `PATCH`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Parâmetros de Path**:
  * `id` (UUID): ID da Rota.
* **Payload**:
```json
{
  "busId": "e4b171c4-0677-448f-bb7e-f519391ab1a1"
}
```
* **Respostas**:
  * `200 OK`: Ônibus associado com sucesso. Retorna o objeto da rota atualizada.
  * `400 Bad Request`: Ônibus inativo ou inválido.
  * `404 Not Found`: Rota ou Ônibus não encontrado.

---

## 2. Atribuição de Motorista Padrão à Rota

Define o motorista que ficará escalado por padrão para guiar o veículo nesta rota.

* **Path**: `/v1/fleet/routes/{id}/driver`
* **Método**: `PATCH`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Parâmetros de Path**:
  * `id` (UUID): ID da Rota.
* **Payload**:
```json
{
  "driverId": "c4d282e4-0577-438f-cc7e-f619391ab1b2"
}
```
* **Respostas**:
  * `200 OK`: Motorista associado com sucesso. Retorna o objeto da rota atualizada.
  * `400 Bad Request`: Motorista sem aprovação ou com licença inválida.
  * `404 Not Found`: Rota ou Motorista não encontrado.

---

## 3. Geração de Viagens Automatizada (Uso da Escalação Padrão)

Permite gerar a escala de viagens (trips) para datas específicas sem a necessidade de enviar o `busId` e `driverId` novamente em lote. O backend usará automaticamente o ônibus e o motorista associados por padrão à rota através dos endpoints anteriores.

* **Path**: `/v1/fleet/routes/{id}/trips`
* **Método**: `POST`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Parâmetros de Path**:
  * `id` (UUID): ID da Rota.
* **Payload**:
```json
{
  "dates": [
    "2026-06-08",
    "2026-06-09",
    "2026-06-10"
  ]
}
```
* **Respostas**:
  * `201 Created`: Viagens geradas com base na escala padrão com sucesso.
  * `400 Bad Request`: Rota inativa, ou ônibus/motorista padrão ausente/incompleto na rota.

---

## 4. Atualizações Necessárias no Swagger (Componentes e Schemas)

Para habilitar essas rotas no Swagger UI (`/v1/docs`), as seguintes definições de DTO devem ser criadas no backend:

### 4.1. `AssignRouteBusDto`
```yaml
type: object
properties:
  busId:
    type: string
    format: uuid
    example: "e4b171c4-0677-448f-bb7e-f519391ab1a1"
required:
  - busId
```

### 4.2. `AssignRouteDriverDto`
```yaml
type: object
properties:
  driverId:
    type: string
    format: uuid
    example: "c4d282e4-0577-438f-cc7e-f619391ab1b2"
required:
  - driverId
```

### 4.3. `GenerateDefaultTripsDto`
```yaml
type: object
properties:
  dates:
    type: array
    items:
      type: string
      format: date
      example: "2026-06-08"
required:
  - dates
```
