from gtts import gTTS

texto = """
Encontre um lugar tranquilo onde possa relaxar sem interrupções.
Sente-se ou deite-se confortavelmente.
Feche os olhos… e comece a respirar fundo…
Inspirando pelo nariz…
Segurando um instante…
E soltando lentamente pela boca.
Sinta seu corpo relaxando a cada respiração.

Agora, imagine uma luz suave e calma no topo da sua cabeça.
Essa luz vai descendo lentamente, trazendo paz e relaxamento.
Ela percorre sua testa, seus olhos, seu rosto…
Seus ombros… braços… peito…
Vai descendo até os pés.
Você está completamente relaxado.

Visualize agora um ponto de luz entre as sobrancelhas, o chamado terceiro olho.
Essa luz vai ficando mais brilhante a cada respiração.
Sinta que sua mente está ficando clara, aberta, receptiva.
Repita mentalmente:
Minha intuição está desperta. Eu confio nas respostas que recebo.

Imagine à sua frente uma tela branca, como se fosse uma lousa ou um quadro.
Respire fundo.
E permita que um número de 1 a 9 apareça nessa tela.
Não force. Apenas deixe o número surgir naturalmente.
Qualquer número que venha está certo.
Observe.
Anote mentalmente.

Agora, deixe esse número desaparecer.
Volte a olhar para a tela branca.
Respire fundo mais uma vez…
E permita que um novo número apareça.
Repita esse processo três vezes.

A tela agora vai se apagar.
A luz suave volta a envolver todo o seu corpo.
Você se sente leve, em paz, centrado.

Respire fundo mais uma vez.
Movimente levemente os dedos das mãos e dos pés.
E, quando estiver pronto, abra os olhos devagar, trazendo consigo a sensação de clareza e intuição.
"""

tts = gTTS(text=texto, lang="pt", slow=False)
tts.save("meditacao_intuicao.mp3")
print("✅ Áudio salvo como meditacao_intuicao.mp3")
