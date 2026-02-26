import os
import random
from flask import Flask, jsonify, render_template_string

app = Flask(__name__)

# Página principal com um botão para gerar música
HTML_PAGE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Gerador de Melodia Aleatória</title>
</head>
<body>
    <h1>🎵 Inteligência Musical "Feito à Toa"</h1>
    <button onclick="gerarMelodia()">Gerar Nova Melodia</button>
    <p id="melodia"></p>
    <hr>
    <h2>Auto-cópia do Código</h2>
    <p>Este aplicativo pode se copiar: <a href="/codigo">ver código-fonte</a></p>
    <script>
        function gerarMelodia() {
            fetch('/gerar')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('melodia').innerText = data.melodia;
                });
        }
    </script>
</body>
</html>
'''

# Pequeno banco de notas e probabilidades (Markov simples)
notas = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si']
transicoes = {
    'Dó': ['Ré', 'Mi', 'Sol'],
    'Ré': ['Mi', 'Fá', 'Lá'],
    'Mi': ['Fá', 'Sol', 'Si'],
    'Fá': ['Sol', 'Lá', 'Dó'],
    'Sol': ['Lá', 'Si', 'Ré'],
    'Lá': ['Si', 'Dó', 'Mi'],
    'Si': ['Dó', 'Ré', 'Fá']
}

def gerar_sequencia(comprimento=8):
    """Gera uma sequência de notas usando cadeia de Markov (inteligência tosca)."""
    nota_atual = random.choice(notas)
    sequencia = [nota_atual]
    for _ in range(comprimento - 1):
        possiveis = transicoes.get(nota_atual, notas)
        nota_atual = random.choice(possiveis)
        sequencia.append(nota_atual)
    return ' - '.join(sequencia)

@app.route('/')
def index():
    return render_template_string(HTML_PAGE)

@app.route('/gerar')
def gerar():
    melodia = gerar_sequencia()
    return jsonify({'melodia': melodia})

@app.route('/codigo')
def codigo():
    """Retorna o próprio código-fonte (auto-cópia)."""
    with open(__file__, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    return f'<pre>{conteudo}</pre>', 200, {'Content-Type': 'text/html; charset=utf-8'}

if __name__ == '__main__':
    app.run(debug=True)
