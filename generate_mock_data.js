const fs = require('fs');

const SC_CITIES_COORDS = [
  "Florianopolis", "Joinville", "Blumenau", "Sao Jose", "Criciuma", 
  "Chapeco", "Itajai", "Lages", "Jaragua do Sul", "Palhoca", 
  "Balneario Camboriu", "Tubarao", "Brusque", "Sao Bento do Sul"
];

const BAIRROS_FLIPA = ["Centro", "Trindade", "Agronomica", "Ingleses", "Campeche", "Estreito", "Coqueiros"];
const BAIRROS_JOINVILLE = ["Centro", "Costa e Silva", "Aventureiro", "Iririu", "Bucarein", "America", "Boa Vista"];
const LIDERANCAS = ["Joao Silva", "Maria Paula", "Carlos Eduardo", "Ana Beatriz", "Vereador XYZ"];
const GENEROS = ["Masculino", "Feminino", "Outro"];
const TAGS_POSSIVEIS = ["Doador", "Voluntario", "Liderança", "Influenciador", "Reclamante", "Indeciso", "Apoiador Forte"];

function removeAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhone() {
    return `(4${Math.floor(Math.random() * 3) + 7}) 9${Math.floor(Math.random() * 8999) + 1000}-${Math.floor(Math.random() * 8999) + 1000}`;
}

// Cabeçalhos (adicionando "Posicao")
const csvHeader = "Nome,Cidade,Bairro,Engajamento,Posicao,Lideranca,Idade,Genero,Telefone,Email,Tags,DataRegistro\n";
const csvRows = [];

for(let i=0; i<850; i++) {
    const nome = `Eleitor ${i+1}`;
    
    // Distribuição de cidades
    let citySeed = Math.random();
    let cidade = "";
    let bairro = "Centro";

    if (citySeed < 0.25) {
        cidade = "Joinville";
        bairro = BAIRROS_JOINVILLE[Math.floor(Math.random() * BAIRROS_JOINVILLE.length)];
    } else if (citySeed < 0.45) {
        cidade = "Florianopolis";
        bairro = BAIRROS_FLIPA[Math.floor(Math.random() * BAIRROS_FLIPA.length)];
    } else if (citySeed < 0.55) {
        cidade = "Sao Jose";
    } else if (citySeed < 0.65) {
        cidade = "Blumenau";
    } else {
        cidade = SC_CITIES_COORDS[Math.floor(Math.random() * SC_CITIES_COORDS.length)];
    }

    // Outros dados
    const engajamento = Math.floor(Math.random() * 5) + 1;
    
    // Força Política / Posição (1-5), weighted towards lower numbers
    const positionRand = Math.random();
    let posicao = 1;
    if (positionRand > 0.95) posicao = 5;
    else if (positionRand > 0.85) posicao = 4;
    else if (positionRand > 0.7) posicao = 3;
    else if (positionRand > 0.5) posicao = 2;

    const dataRegistro = getRandomDate(new Date(2023, 0, 1), new Date());
    
    // Pick 1 to 3 random leaders
    const numLeaders = Math.floor(Math.random() * 3) + 1;
    const shuffledLiderancas = [...LIDERANCAS].sort(() => 0.5 - Math.random());
    const liderancasStr = removeAcentos(shuffledLiderancas.slice(0, numLeaders).join(';'));

    const hasPhone = Math.random() > 0.3;
    const telefone = hasPhone ? generatePhone(cidade) : '';
    
    const email = hasPhone && Math.random() > 0.5 ? `${nome.toLowerCase().replace(/ /g, '.')}@email.com` : '';
    
    const idade = Math.floor(Math.random() * (80 - 16 + 1)) + 16;
    const genero = GENEROS[Math.floor(Math.random() * GENEROS.length)];
    // Tags aleatórias
    let tagsAtribuidas = [];
    if (Math.random() > 0.5) tagsAtribuidas.push(TAGS_POSSIVEIS[Math.floor(Math.random() * TAGS_POSSIVEIS.length)]);
    if (Math.random() > 0.8) tagsAtribuidas.push(TAGS_POSSIVEIS[Math.floor(Math.random() * TAGS_POSSIVEIS.length)]);

    // Remove duplicadas e formata
    const tagsUnicas = [...new Set(tagsAtribuidas)];
    const tagsString = removeAcentos(tagsUnicas.join(";"));

    // Adiciona na linha
    csvRows.push(`${nome},${cidade},${bairro},${engajamento},${posicao},${liderancasStr},${idade},${genero},${telefone},${email},${tagsString},${dataRegistro.toISOString()}`);
}

const csvContent = csvHeader + csvRows.join("\n");
console.log(csvContent);
