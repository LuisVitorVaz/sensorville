
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import csv
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Libera todas as origens por padrão

UPLOAD_FOLDER = 'uploads'
CSV_FILE = 'dados.csv'

# Garante que a pasta de upload exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['POST'])
def receber_dados():
    nome = request.form.get('nome', '').strip().lower()
    email = request.form.get('email', '').strip().lower()
    mensagem = request.form.get('mensagem', '').strip()

    imagem = request.files.get('imagem')
    nome_arquivo = ''

    # Verifica duplicidade no CSV
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for linha in reader:
                if len(linha) >= 3:
                    nome_existente = linha[1].strip().lower()
                    email_existente = linha[2].strip().lower()
                    if nome == nome_existente or email == email_existente:
                        return make_response("Nome ou email já cadastrados!", 409)

    # Se tiver imagem, salvar com UUID único
    if imagem and imagem.filename:
        ext = os.path.splitext(imagem.filename)[1]
        nome_arquivo = f"{uuid.uuid4().hex}{ext}"
        imagem.save(os.path.join(UPLOAD_FOLDER, nome_arquivo))

    # Salvar os dados no CSV
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), nome, email, mensagem, nome_arquivo])

    return make_response("Formulário recebido com sucesso.", 200)

@app.route('/dados.csv', methods=['GET'])
def baixar_csv():
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        response = make_response(conteudo)
        response.headers['Content-Type'] = 'text/csv'
        return response
    return make_response("Arquivo CSV não encontrado.", 404)

if __name__ == '__main__':
    app.run(debug=True, port=8000)


# comando para acessar arquivo :http://localhost:8000/dados.csv
