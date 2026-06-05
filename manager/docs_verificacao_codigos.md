# Especificação Técnica: Verificação de Segurança para Alteração Cadastral

Este documento especifica o contrato de API e os fluxos necessários no backend para suportar a alteração segura de dados sensíveis (E-mail, Senha e Telefone) com verificação em dois passos via E-mail ou WhatsApp.

---

## 1. Fluxo de Trabalho Geral

1. **Solicitação**: O cliente envia uma intenção de alteração informando o tipo de alteração (E-mail, Senha ou Telefone), o novo valor (se aplicável) e o canal desejado para recebimento do código (E-mail ou WhatsApp).
2. **Envio**: O backend gera um código numérico de 6 dígitos de uso único (OTP), envia-o para o canal escolhido e registra a expiração (expira em 5 minutos).
3. **Confirmação & Aplicação**: O cliente envia o código recebido junto com as credenciais ou dados adicionais. O backend valida o código e, em caso de sucesso, persiste a alteração.

---

## 2. Endpoints e Payloads

### 2.1. Solicitação do Código de Verificação

Solicita o envio do código OTP de 6 dígitos para o canal escolhido.

* **Rota**: `/users/me/verification-code`
* **Método**: `POST`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Payload**:

```json
{
  "type": "EMAIL" | "PHONE" | "PASSWORD",
  "channel": "EMAIL" | "WHATSAPP",
  "value": "string" 
}
```

* **Campos**:
  * `type`: O tipo de dado a ser modificado.
  * `channel`: Canal por onde o código deve ser enviado.
  * `value`: Obrigatório para `EMAIL` e `PHONE`. Representa o novo e-mail ou telefone (`+55...`) para onde o código deve ser enviado para validar a posse. Para `PASSWORD`, pode ser omitido (o código será enviado para o e-mail cadastrado do usuário atual).

* **Respostas**:
  * `200 OK`: Código enviado com sucesso.
    ```json
    {
      "message": "Código de verificação enviado com sucesso.",
      "expiresIn": 300
    }
    ```
  * `400 Bad Request`: Canal inválido ou novo valor ausente/mal-formado.
  * `401 Unauthorized`: Token de autenticação inválido ou ausente.

---

### 2.2. Confirmação e Atualização dos Dados

Envia o código para validação e efetiva a alteração cadastral se o código for correto e estiver dentro do tempo de validade.

* **Rota**: `/users/me/update-with-code`
* **Método**: `PUT`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Payload**:

```json
{
  "type": "EMAIL" | "PHONE" | "PASSWORD",
  "code": "123456",
  "newValue": "string",
  "currentPassword": "string"
}
```

* **Campos**:
  * `type`: O tipo de alteração sendo confirmada (`EMAIL`, `PHONE` ou `PASSWORD`).
  * `code`: Código OTP de 6 dígitos enviado ao canal de verificação.
  * `newValue`: O novo valor a ser persistido (novo e-mail, novo telefone ou nova senha).
  * `currentPassword`: Obrigatório e aplicável apenas quando `type` for `PASSWORD` para validação de identidade adicional.

* **Respostas**:
  * `200 OK`: Alteração efetuada com sucesso. Retorna os dados atualizados do usuário.
    ```json
    {
      "id": "e4b171c4-0677-448f-bb7e-f519391ab1a1",
      "name": "John Doe",
      "email": "novoemail@municipality.gov.br",
      "phone": "+5511999999999",
      "role": "MANAGER"
    }
    ```
  * `400 Bad Request`: Código de verificação incorreto ou expirado, ou nova senha incompatível com os critérios de segurança.
  * `401 Unauthorized`: Token de autenticação inválido.
