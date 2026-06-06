# Detalhamento das Correções de Endpoints e Regras de Negócio

Este documento descreve as correções técnicas efetuadas na integração com a API da Ubus no painel do Gestor (`manager`).

---

## 1. Correção nas Rotas de Pontos de Embarque (Pickup Points)
* **Problema:** A atualização e exclusão de pontos de embarque de uma rota estavam gerando erros `404 Not Found` porque o frontend enviava requisições para URLs incorretas ou incompletas sob `/fleet/routes/...`.
* **Solução:** Sincronizamos os métodos com a API real de produção no arquivo [fleet.ts](file:///home/huneyoliv/Projetos/ubus-web/manager/src/api/fleet.ts):
  * **Atualização (PATCH):** Redirecionada de forma direta para `/fleet/points/${pointId}` em vez de incluir a rota no caminho.
  * **Exclusão (DELETE):** Redirecionada de forma direta para `/fleet/points/${pointId}`.
* **Código Ajustado:**
  ```typescript
  export async function updatePickupPoint(routeId: string, pointId: string, payload: { name?: string; lat?: number; lng?: number }): Promise<PickupPoint> {
    const r = await api.patch(`/fleet/points/${pointId}`, payload);
    return r.data;
  }

  export async function deletePickupPoint(routeId: string, pointId: string): Promise<void> {
    await api.delete(`/fleet/points/${pointId}`);
  }
  ```

---

## 2. Correção de Formato de Parâmetro no Calendário de Viagens
* **Problema:** O carregamento do calendário de rotas quebrava com erro `500 Internal Server Error` no backend. O frontend enviava o parâmetro `month` no formato `YYYY-MM` (ex: `2026-06`), porém o backend espera os valores de ano e mês separados na query string.
* **Solução:** Ajustamos a função `getRouteCalendar` no [fleet.ts](file:///home/huneyoliv/Projetos/ubus-web/manager/src/api/fleet.ts) para desmembrar a string `month` no caractere `-` e enviar `year` e `month` (numérico e sem zeros à esquerda) separadamente.
* **Código Ajustado:**
  ```typescript
  export async function getRouteCalendar(routeId: string, month: string): Promise<{ scheduledDates: string[] }> {
    const [year, monthStr] = month.split('-');
    const monthNum = parseInt(monthStr, 10).toString(); // remove zero à esquerda (ex: "06" -> "6")
    const r = await api.get(`/trips/route/${routeId}/calendar`, { params: { year, month: monthNum } });
    const trips = Array.isArray(r.data) ? r.data : [];
    const scheduledDates = Array.from(new Set(trips.map((t: any) => t.tripDate)));
    return { scheduledDates };
  }
  ```

---

## 3. Correção do Mapeamento de Capacidade do Veículo
* **Problema:** O backend da API utiliza a propriedade `standardCapacity` para ler/salvar a capacidade dos assentos do ônibus, enquanto o frontend esperava e exibia a propriedade `capacity`. Isso causava inconsistências de dados e crashes de tela branca (erros `NaN` ao iterar no mapa visual de poltronas).
* **Solução:** Implementamos um mapeamento bidirecional transparente na API no [fleet.ts](file:///home/huneyoliv/Projetos/ubus-web/manager/src/api/fleet.ts):
  * Na listagem (`GET`), convertemos `standardCapacity` para a propriedade `capacity`.
  * Na criação (`POST`) e atualização (`PATCH`), convertemos `capacity` de volta para `standardCapacity` antes de enviar o payload para o backend.
* **Código Ajustado:**
  ```typescript
  export async function listBuses(): Promise<Bus[]> {
    const r = await api.get('/fleet/buses');
    return r.data.map((bus: any) => ({
      ...bus,
      capacity: bus.standardCapacity ?? bus.capacity,
    }));
  }

  export async function createBus(payload: Omit<Bus, 'id'>): Promise<Bus> {
    const { capacity, ...rest } = payload;
    const backendPayload = { ...rest, standardCapacity: capacity };
    const r = await api.post('/fleet/buses', backendPayload);
    return { ...r.data, capacity: r.data.standardCapacity ?? r.data.capacity };
  }
  ```

---

## 4. Inclusão do Campo Obrigatório `identificationNumber`
* **Problema:** A criação de ônibus retornava erro `400 Bad Request` com a mensagem `identificationNumber should not be empty`, pois a propriedade de prefixo/identificação é obrigatória no banco de dados e não estava sendo enviada pelo frontend.
* **Solução:** 
  * Adicionamos a propriedade `identificationNumber` à interface `Bus` no [fleet.ts](file:///home/huneyoliv/Projetos/ubus-web/manager/src/api/fleet.ts).
  * Adicionamos o estado e o respectivo campo de input na Etapa 1 do formulário de cadastro ([FrotaPage.tsx](file:///home/huneyoliv/Projetos/ubus-web/manager/src/pages/frota/FrotaPage.tsx)).
  * Incluímos o campo no formulário de detalhes e edição do veículo ([OnibusDetailPage.tsx](file:///home/huneyoliv/Projetos/ubus-web/manager/src/pages/frota/OnibusDetailPage.tsx)).

---

## 5. Remoção de `weekDays` e Simplificação de Horários nas Rotas
* **Problema:** De acordo com a nova regra operacional, não existem mais dias de semana fixos ou janelas de votação para rotas. O agendamento ocorre diretamente nas datas selecionadas no calendário pelo gestor. Além disso, as rotas agora possuem apenas o horário exato em que o ônibus sai de cada cidade (tanto origem quanto destino).
* **Solução:** 
  * Removemos toda a lógica, visualização e referências a `weekDays` nos arquivos [RotasPage.tsx](file:///home/huneyoliv/Projetos/ubus-web/manager/src/pages/rotas/RotasPage.tsx) e [RotaDetailPage.tsx](file:///home/huneyoliv/Projetos/ubus-web/manager/src/pages/rotas/RotaDetailPage.tsx).
  * Substituímos na interface `Route` e nas telas pelas propriedades `departureTimeOutbound` (horário de saída da ida) e `departureTimeInbound` (horário de saída da volta).
wh