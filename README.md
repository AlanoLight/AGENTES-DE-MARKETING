# AGENTES-DE-MARKETING

Sistema inicial de agentes especializados para operacao de marketing, estrategia, conteudo, copy, design e otimizacao.

## Objetivo

Este repositorio organiza agentes com papeis claros para evitar o erro de usar um unico agente generico para tudo. Cada agente tem:

- uma responsabilidade definida
- um tipo de entrada esperado
- um formato de saida consistente
- limites explicitos do que deve ou nao fazer

Os agentes foram criados em .github/agents para uso no workspace.

## Agente orquestrador

- Orquestrador de Marketing: recebe um briefing unico, escolhe os especialistas necessarios, chama os agentes na ordem certa e devolve um plano consolidado.

## Agentes disponiveis

### Estrategia

- Estrategista de Marketing: define posicionamento, oferta, ICP, persona, angulos e estrutura de funil.
- Pesquisador de Mercado: levanta linguagem do cliente, dores, objecoes, concorrencia e oportunidades.

### Producao

- Copywriter de Conversao: cria headlines, anuncios, paginas, emails e variacoes para teste.
- Conteudista Editorial: monta pautas, calendarios e adaptacoes por canal.
- SEO Growth: organiza palavras-chave, clusters, intencao de busca e briefs organicos.
- Design Criativo: define direcao de arte e gera prompts visuais para imagens e pecas.

### Distribuicao e funil

- Especialista em Midia Paga: estrutura campanhas, segmentacao, anuncios e testes.
- CRM e Funil: desenha fluxos de nutricao, follow-up, recuperacao e automacao.

### Leitura de performance

- Analytics e Otimizacao: interpreta metricas, identifica gargalos e prioriza proximos testes.

## Estrutura do projeto

```text
.github/
	agents/
		orquestrador-marketing.agent.md
		analytics-otimizacao.agent.md
		conteudo-editorial.agent.md
		copywriter-conversao.agent.md
		crm-funil.agent.md
		design-criativo.agent.md
		estrategista-marketing.agent.md
		midia-paga.agent.md
		pesquisa-mercado.agent.md
		seo-growth.agent.md
	prompts/
		briefing-orquestrador.prompt.md
		briefing-lancheria-food-service.prompt.md
		briefing-paulinhos-burguer.prompt.md
		post-paulinhos-comando-direto.prompt.md
		briefing-pesquisa-mercado.prompt.md
		briefing-estrategia-marketing.prompt.md
		briefing-copywriter.prompt.md
		briefing-conteudo-editorial.prompt.md
		briefing-seo-growth.prompt.md
		briefing-midia-paga.prompt.md
		briefing-crm-funil.prompt.md
		briefing-analytics-otimizacao.prompt.md
		briefing-design-criativo.prompt.md
playbooks/
	lancheria-hamburgueria.md
	paulinhos-burguer-sombrio-sc.md
```

## Fluxo recomendado

Use os agentes em cadeia, nao de forma isolada:

Se quiser operar com um unico ponto de entrada, use primeiro o Orquestrador de Marketing. Ele decide a cadeia e consolida a resposta.

1. Pesquisador de Mercado
2. Estrategista de Marketing
3. Copywriter de Conversao
4. Design Criativo
5. Conteudista Editorial ou Especialista em Midia Paga
6. CRM e Funil
7. Analytics e Otimizacao

## Exemplo de operacao

Briefing bruto:

"Tenho uma oferta para clinicas esteticas e quero gerar leads pelo Instagram e WhatsApp."

Sequencia sugerida:

1. Pesquisador de Mercado: mapear dores, concorrentes e linguagem.
2. Estrategista de Marketing: definir oferta, promessa e angulos.
3. Copywriter de Conversao: criar anuncios e mensagens.
4. Design Criativo: gerar conceito visual e prompt de imagem.
5. Especialista em Midia Paga: montar campanha e plano de testes.
6. CRM e Funil: estruturar follow-up e nutricao.
7. Analytics e Otimizacao: ler resultados e sugerir melhorias.

## Como usar

Abra o chat com o agente desejado e passe um briefing com o maximo possivel de contexto:

Se preferir, abra direto com o Orquestrador de Marketing e envie o briefing completo. Ele decide quais agentes devem entrar em seguida.

- produto ou servico
- publico-alvo
- objetivo da campanha
- canal principal
- oferta atual
- restricoes de marca
- referencia de linguagem ou estilo

Quanto melhor o briefing, melhor a saida de cada agente.

## Prompts de briefing

O projeto agora tambem inclui prompts em .github/prompts para acelerar o uso no chat com slash command.

- Briefing Orquestrador de Marketing: ponto de entrada principal para projetos novos.
- Briefing Pesquisa de Mercado: quando faltar contexto sobre audiencia e concorrencia.
- Briefing Estrategia de Marketing: quando a oferta e o posicionamento ainda nao estiverem fechados.
- Briefing Copywriter de Conversao: quando a estrategia ja existir e voce quiser pecas persuasivas.
- Briefing Conteudo Editorial: quando precisar de pauta e calendario.
- Briefing SEO Growth: quando o foco for aquisicao organica.
- Briefing Midia Paga: quando quiser campanha, segmentacao e testes.
- Briefing CRM e Funil: quando a necessidade for nutricao e follow-up.
- Briefing Analytics e Otimizacao: quando ja houver dados para leitura e melhoria.
- Briefing Design Criativo: quando for hora de traduzir a mensagem em imagem.

Para usar, abra o chat, digite / e selecione o prompt desejado.

## Adaptacao por nicho

O projeto agora tambem tem um playbook inicial para o seu nicho em [playbooks/lancheria-hamburgueria.md](playbooks/lancheria-hamburgueria.md).

Esse material concentra:

- perfil do nicho
- dores, desejos e objecoes
- angulos de campanha
- ofertas que costumam performar
- pilares de conteudo
- direcao visual
- funil e recompra

Se quiser entrar mais rapido no fluxo, use o prompt [briefing-lancheria-food-service.prompt.md](.github/prompts/briefing-lancheria-food-service.prompt.md), feito para lancheria, xis, hamburguer e tabuas.

## Caso real: Paulinhos Burguer

Foi adicionado um material especifico da sua marca para acelerar as campanhas:

- playbook da marca: [playbooks/paulinhos-burguer-sombrio-sc.md](playbooks/paulinhos-burguer-sombrio-sc.md)
- prompt dedicado da marca: [.github/prompts/briefing-paulinhos-burguer.prompt.md](.github/prompts/briefing-paulinhos-burguer.prompt.md)
- prompt de execucao por comando: [.github/prompts/post-paulinhos-comando-direto.prompt.md](.github/prompts/post-paulinhos-comando-direto.prompt.md)

Com isso, voce pode iniciar as rodadas no chat com /Briefing Paulinhos Burguer e o orquestrador ja usa o contexto da sua operacao em Sombrio-SC.

### Exemplo de prompt para o orquestrador

"Tenho uma consultoria para clinicas odontologicas. Quero criar uma campanha para captar leads no Instagram e converter no WhatsApp. Minha oferta e avaliacao inicial gratuita. Quero ajuda para pesquisa, estrategia, copy, criativos e follow-up."

## Proximo passo natural

O projeto ja tem a base dos agentes. A evolucao mais util agora e adicionar:

1. prompts padrao de briefing
2. templates de saida por agente
3. exemplos reais de campanhas por nicho
4. handoffs e playbooks por tipo de campanha