import xlsx from 'xlsx';
import { supabase } from '../config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clearFictionalBooks() {
  console.log('🗑️  Removendo livros fictícios...');
  
  // Remove holdings (exemplares) primeiro
  const { error: holdingsError } = await supabase
    .from('holdings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (holdingsError) {
    console.error('Erro ao remover exemplares:', holdingsError);
  } else {
    console.log('✅ Exemplares removidos');
  }

  // Remove bibliographic records
  const { error: recordsError } = await supabase
    .from('bibliographic_records')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (recordsError) {
    console.error('Erro ao remover registros bibliográficos:', recordsError);
  } else {
    console.log('✅ Registros bibliográficos removidos');
  }
}

async function importBooksFromExcel() {
  try {
    console.log('📚 Iniciando importação de livros da planilha...\n');

    // Caminho da planilha
    const excelPath = path.join(__dirname, '..', '..', '..', 'Cópia de Planilha de Descarte de material da Biblioteca Municipal(10).xlsx');
    
    console.log('📂 Lendo arquivo:', excelPath);
    
    // Ler o arquivo Excel
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Primeira aba
    const sheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`📊 Total de registros encontrados: ${data.length}\n`);
    
    // Limpar livros fictícios
    await clearFictionalBooks();
    
    console.log('\n📥 Importando livros reais...\n');
    
    let imported = 0;
    let errors = 0;

    for (const row of data) {
      try {
        // Mapear os campos da planilha para o banco de dados
        // Ajuste os nomes das colunas conforme sua planilha
        const bookData = {
          title: row['Título principal'] || row['Título'] || row['TÍTULO'] || row['titulo'] || 'Sem título',
          subtitle: row['Subtítulo'] || row['SUBTÍTULO'] || null,
          author: row['Autor'] || row['AUTOR'] || row['autor'] || null,
          publisher: row['Editora'] || row['EDITORA'] || row['editora'] || null,
          publication_year: row['Ano'] || row['ANO'] || row['ano'] || null,
          isbn: row['ISBN'] || row['isbn'] || null,
          call_number: row['Classificação'] || row['CLASSIFICAÇÃO'] || row['Tombo'] || row['TOMBO'] || null,
          material_type: 'book',
          language: 'pt',
          pages: row['Páginas'] || row['PÁGINAS'] || null,
          edition: row['Edição'] || row['EDIÇÃO'] || null,
          notes: row['Observações'] || row['OBSERVAÇÕES'] || null,
          subject: row['Assunto'] ? [row['Assunto']] : [],
        };

        // Inserir registro bibliográfico
        const { data: record, error: recordError } = await supabase
          .from('bibliographic_records')
          .insert(bookData)
          .select()
          .single();

        if (recordError) {
          console.error(`❌ Erro ao importar: ${bookData.title}`, recordError.message);
          errors++;
          continue;
        }

        // Criar exemplar (holding) para o livro
        const holdingData = {
          bibliographic_record_id: record.id,
          barcode: row['Código de Barras'] || row['CÓDIGO'] || null,
          acquisition_date: row['Data Aquisição'] || new Date().toISOString(),
          status: 'available',
          location: row['Localização'] || row['LOCALIZAÇÃO'] || 'Acervo Principal',
        };

        const { error: holdingError } = await supabase
          .from('holdings')
          .insert(holdingData);

        if (holdingError) {
          console.error(`⚠️  Livro importado mas erro ao criar exemplar: ${bookData.title}`);
        }

        imported++;
        if (imported % 10 === 0) {
          console.log(`   ✓ ${imported} livros importados...`);
        }

      } catch (error) {
        console.error('❌ Erro ao processar linha:', error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Importação concluída!');
    console.log(`📚 Livros importados: ${imported}`);
    console.log(`❌ Erros: ${errors}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Erro fatal:', error);
  }
}

// Executar importação
importBooksFromExcel().then(() => {
  console.log('\n✅ Processo finalizado!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
