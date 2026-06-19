# AGENTES-DE-MARKETING

Arquitetura de agentes para marketing, growth e operacao comercial, com camada generica e vertical especializada em food service.

## Objetivo

Este repositorio organiza agentes com papeis claros para evitar um agente generico que tenta fazer tudo. Cada agente segue um contrato padrao:

- Objetivo
- Quando Acionar
- Entradas
- Processo
- Saida
- Restricoes

Os agentes ficam em .github/agents. Os prompts ficam em .github/prompts. Os playbooks de nicho e marca ficam em playbooks.

## Arquitetura completa

### Camada generica

- Orquestrador de Marketing: coordenador geral para demandas amplas de marketing.
- Pesquisador de Mercado
- Estrategista de Marketing
- Copywriter de Conversao
- Conteudista Editorial
- Design Criativo
- Especialista em Midia Paga
- CRM e Funil
- Analytics e Otimizacao
- SEO Growth

### Vertical food service

- Food Growth Master: orquestrador principal da vertical food service.
- Consultor iFood: vitrine, CTR, cardapio, descricoes, categorias e upsell em app.
- Engenheiro de Cardapio: ticket, margem, mix, CMV e menu engineering.
- WhatsApp Delivery: retorno, recompra, fidelizacao e automacoes.
- Promocoes Food: combos, upsell, cross sell e campanhas com protecao de margem.
- Google Reviews: reputacao local, reclamacoes e plano de melhoria.

## Fluxo de orquestracao

### Fluxo generico

Orquestrador de Marketing

-> Pesquisador de Mercado
-> Estrategista de Marketing
-> Copywriter de Conversao
-> Design Criativo
-> Conteudista Editorial ou Especialista em Midia Paga
-> CRM e Funil
-> Analytics e Otimizacao

### Fluxo food service

Food Growth Master

-> Consultor iFood
-> Engenheiro de Cardapio
-> WhatsApp Delivery
-> Promocoes Food
-> Google Reviews
-> Copywriter de Conversao
-> Conteudista Editorial
-> Especialista em Midia Paga
-> CRM e Funil
-> Analytics e Otimizacao

## Handoffs e compatibilidade

- O handoff principal e feito pela lista agents: dentro dos agentes orquestradores.
- O Orquestrador de Marketing pode encaminhar casos de food service para o Food Growth Master.
- Nenhum agente existente foi removido.
- A camada generica continua funcional e compativel com os prompts anteriores.

## Estrutura do projeto

```text
.github/
	agents/
		analytics-otimizacao.agent.md
		consultor-ifood.agent.md
		conteudo-editorial.agent.md
		copywriter-conversao.agent.md
		crm-funil.agent.md
		design-criativo.agent.md
		engenheiro-cardapio.agent.md
		estrategista-marketing.agent.md
		food-growth-master.agent.md
		google-reviews.agent.md
		midia-paga.agent.md
		orquestrador-marketing.agent.md
		pesquisa-mercado.agent.md
		promocoes-food.agent.md
		seo-growth.agent.md
		whatsapp-delivery.agent.md
	prompts/
		briefing-analytics-otimizacao.prompt.md
		briefing-conteudo-editorial.prompt.md
		briefing-copywriter.prompt.md
		briefing-crm-funil.prompt.md
		briefing-design-criativo.prompt.md
		briefing-estrategia-marketing.prompt.md
		briefing-food-growth-master.prompt.md
		briefing-lancheria-food-service.prompt.md
		briefing-midia-paga.prompt.md
		briefing-orquestrador.prompt.md
		briefing-paulinhos-burguer.prompt.md
		briefing-pesquisa-mercado.prompt.md
		briefing-seo-growth.prompt.md
		post-paulinhos-comando-direto.prompt.md
playbooks/
	lancheria-hamburgueria.md
	paulinhos-burguer-sombrio-sc.md
```

## Lista de agentes

### Orquestradores

- Food Growth Master
- Orquestrador de Marketing

### Especialistas genericos

- Pesquisador de Mercado
- Estrategista de Marketing
- Copywriter de Conversao
- Conteudista Editorial
- Design Criativo
- Especialista em Midia Paga
- CRM e Funil
- Analytics e Otimizacao
- SEO Growth

### Especialistas food service

- Consultor iFood
- Engenheiro de Cardapio
- WhatsApp Delivery
- Promocoes Food
- Google Reviews

## Como usar

Abra o chat com o agente desejado ou use um prompt da pasta .github/prompts.

Use o Orquestrador de Marketing para demandas gerais.

Use o Food Growth Master para:

- restaurantes
- delivery
- hamburguerias
- pizzarias
- lancherias
- operacoes locais de food service

Passe o maximo de contexto util:

- produto ou servico
- publico-alvo
- objetivo da campanha
- canal principal
- oferta atual
- restricoes de marca
- referencia de linguagem ou estilo

Quanto melhor o briefing, melhor a saida de cada agente.

## Prompts de briefing

O projeto inclui prompts em .github/prompts para acelerar o uso no chat com slash command.

- Briefing Food Growth Master: ponto de entrada da vertical food service.
- Briefing Orquestrador de Marketing: ponto de entrada principal para projetos novos.
- Briefing Pesquisa de Mercado
- Briefing Estrategia de Marketing
- Briefing Copywriter de Conversao
- Briefing Conteudo Editorial
- Briefing SEO Growth
- Briefing Midia Paga
- Briefing CRM e Funil
- Briefing Analytics e Otimizacao
- Briefing Design Criativo

Para usar, abra o chat, digite / e selecione o prompt desejado.

## Adaptacao por nicho

O projeto tem um playbook inicial para food service em [playbooks/lancheria-hamburgueria.md](playbooks/lancheria-hamburgueria.md).

Esse material concentra:

- perfil do nicho
- dores, desejos e objecoes
- angulos de campanha
- ofertas que costumam performar
- pilares de conteudo
- direcao visual
- funil e recompra

Se quiser entrar mais rapido no fluxo, use o prompt [.github/prompts/briefing-lancheria-food-service.prompt.md](.github/prompts/briefing-lancheria-food-service.prompt.md), feito para lancheria, xis, hamburguer e tabuas.

## Caso real: Paulinhos Burguer

Foi adicionado um material especifico da marca para acelerar as campanhas:

- playbook da marca: [playbooks/paulinhos-burguer-sombrio-sc.md](playbooks/paulinhos-burguer-sombrio-sc.md)
- prompt dedicado da marca: [.github/prompts/briefing-paulinhos-burguer.prompt.md](.github/prompts/briefing-paulinhos-burguer.prompt.md)
- prompt de execucao por comando: [.github/prompts/post-paulinhos-comando-direto.prompt.md](.github/prompts/post-paulinhos-comando-direto.prompt.md)

Com isso, voce pode iniciar as rodadas no chat com /Briefing Paulinhos Burguer e o Food Growth Master ja usa o contexto da operacao em Sombrio-SC.

## Casos de uso por operacao

### Restaurantes

- promocao por dia da semana
- reputacao e reviews
- organizacao de menu e ticket medio

### Delivery

- iFood
- WhatsApp de recompra
- oferta de horario e retorno de clientes

### Hamburguerias

- combinacao de burger, porcao e combo
- criativos visuais e reels de produto
- lancamento de burger da semana

### Pizzarias

- combos familia
- oferta sazonal e data comemorativa
- upsell de borda, bebida e sobremesa

## Exemplo de uso

"Tenho uma hamburgueria em bairro residencial, vendo mais no delivery e preciso melhorar cardapio no app, retorno no WhatsApp e campanhas de quinta a domingo."

Resultado esperado:

- Food Growth Master decide a sequencia
- chama Consultor iFood, Promocoes Food, WhatsApp Delivery e Analytics
- consolida tudo em um plano unico

## Proximos passos naturais

1. templates de saida por agente
2. playbooks por tipo de operacao e ticket
3. base de referencias de marketing para treinar os agentes
4. prompts por rotina semanal da operacao